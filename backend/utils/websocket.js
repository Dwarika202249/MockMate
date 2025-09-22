const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

function setupWebSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    // Authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    // Handle connections
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userId}`);

        // Join user-specific room
        socket.join(`user_${socket.userId}`);

        // Handle interview start
        socket.on('interview:start', (interviewId) => {
            socket.join(`interview_${interviewId}`);
        });

        // Handle answer submission
        socket.on('answer:submit', async (data) => {
            const { interviewId, answer, question } = data;
            
            // Emit immediate acknowledgment
            socket.emit('answer:received', { interviewId, status: 'processing' });
            
            // Broadcast local evaluation results immediately
            io.to(`interview_${interviewId}`).emit('evaluation:local', {
                type: 'local',
                result: data.localEvaluation
            });
        });

        // Handle AI feedback ready
        socket.on('feedback:ready', (data) => {
            io.to(`interview_${data.interviewId}`).emit('evaluation:ai', {
                type: 'ai',
                result: data.evaluation
            });
        });

        // Handle interview end
        socket.on('interview:end', (interviewId) => {
            socket.leave(`interview_${interviewId}`);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);
        });
    });

    return io;
}

module.exports = setupWebSocket;