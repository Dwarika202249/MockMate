const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const router = express.Router();
const userAuth = require("../middleware/userAuth")

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Token configuration - shorter expiry for security
const ACCESS_TOKEN_EXPIRY = '1h';  // 1 hour (was 100 hours!)
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // 7 days
const REFRESH_TOKEN_EXPIRY_MS = REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

// Generate access token
const generateAccessToken = (userId) => {
  return jwt.sign(
    { user: { id: userId } },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// Generate refresh token
const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Get refresh token expiry date
const getRefreshTokenExpiry = () => {
  return new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
};

router.post('/google', async (req, res) => {
    const { id_token } = req.body;
    
  
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
          photoURL: payload.picture,
        });
        await user.save();
      }
  
      const token = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken();
      
      // Store refresh token with expiry
      user.refreshToken = refreshToken;
      user.refreshTokenExpiry = getRefreshTokenExpiry();
      await user.save();
  
      res.json({ 
        token, 
        refreshToken,
        user: { id: user.id, name: user.name, email: user.email, photoURL: user.photoURL }
      });
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
        
        // Generate refresh token
        const refreshToken = generateRefreshToken();
        user.refreshToken = refreshToken;
        user.refreshTokenExpiry = getRefreshTokenExpiry();
        
        await user.save(); //user save to mongodb

        const token = generateAccessToken(user.id);
        
        res.json({ 
          token, 
          refreshToken,
          user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error(error.message);
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

        // Generate tokens
        const token = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken();
        
        // Store refresh token
        user.refreshToken = refreshToken;
        user.refreshTokenExpiry = getRefreshTokenExpiry();
        await user.save();

        res.json({ 
          token, 
          refreshToken,
          user: { id: user.id, name: user.name, email: user.email, photoURL: user.photoURL }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
        
    }
})

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return res.status(400).json({ msg: 'Refresh token required' });
    }
    
    try {
        const user = await User.findOne({ 
            refreshToken,
            refreshTokenExpiry: { $gt: new Date() }
        });
        
        if (!user) {
            return res.status(401).json({ msg: 'Invalid or expired refresh token' });
        }
        
        // Generate new tokens
        const newToken = generateAccessToken(user.id);
        const newRefreshToken = generateRefreshToken();
        
        // Update refresh token
        user.refreshToken = newRefreshToken;
        user.refreshTokenExpiry = getRefreshTokenExpiry();
        await user.save();
        
        res.json({ token: newToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Logout endpoint - invalidate refresh token
router.post('/logout', userAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.refreshToken = null;
            user.refreshTokenExpiry = null;
            await user.save();
        }
        res.json({ msg: 'Logged out successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/user', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/update-profile', userAuth, async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Fetch the user by ID
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;

    // If password is provided, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({ msg: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



module.exports = router;