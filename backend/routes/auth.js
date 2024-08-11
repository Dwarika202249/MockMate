const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const userAuth = require("../middleware/userAuth")

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
    const { id_token } = req.body;

    console.log(id_token);
    
  
    try {
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
  
      let user = await User.findOne({ email: payload.email });
      if (!user) {
        user = new User({
          name: payload.name,
          email: payload.email,
          googleId: payload.sub,
        });
        await user.save();
      }
  
      const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
        expiresIn: 360000,
      });
  
      res.json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  });

router.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    
    try {
        let user = await User.findOne({email});
        if(user) {
            return res.status(400).json({msg: "User already exists."})
        }

        user = new User({ name, email, password })
        

        // encrypting passsword
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, salt);
        
        await user.save(); //user save to mongodb

        // jwt
        const payload = {user: { id: user.id}}
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 360000
        }, (error, token) => {
            if (error) throw error;
            res.json({token});
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal server error');
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        //check if user exist
        let user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({msg: "Invalid Credentials."});
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({msg: "Invalid Credentials."}); 
        }

        // return JWT token
        const payload = {user:{id: user.id}};
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 360000
        }, (error, token) => {
            if(error) throw error;
            res.json({token})
        })


    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
        
    }
})

router.get('/user', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;