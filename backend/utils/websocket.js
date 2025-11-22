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
            socket.userId = decoded.user.id;
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

        // Backwards-compatible basic events
        socket.on('interview:start', (interviewId) => {
            socket.join(`interview_${interviewId}`);
        });

        socket.on('answer:submit', async (data) => {
            const { interviewId } = data;
            socket.emit('answer:received', { interviewId, status: 'processing' });
            io.to(`interview_${interviewId}`).emit('evaluation:local', {
                type: 'local',
                result: data.localEvaluation || null
            });
        });

        socket.on('feedback:ready', (data) => {
            io.to(`interview_${data.interviewId}`).emit('evaluation:ai', {
                type: 'ai',
                result: data.evaluation
            });
        });

        socket.on('interview:end', (interviewId) => {
            socket.leave(`interview_${interviewId}`);
        });

        // New: support higher-level interview flow events to match frontend
        try {
            const interviewHandlers = require('../websocket/interviewHandlers');

            socket.on('INITIALIZE_INTERVIEW', (data) => {
                // delegate to handler which expects (io, socket, data)
                interviewHandlers.INITIALIZE_INTERVIEW(io, socket, data).catch(err => {
                    console.error('INITIALIZE_INTERVIEW handler error:', err);
                    socket.emit('ERROR', { message: 'Failed to initialize interview' });
                });
            });

            socket.on('SUBMIT_ANSWER', (data) => {
                interviewHandlers.SUBMIT_ANSWER(io, socket, data).catch(err => {
                    console.error('SUBMIT_ANSWER handler error:', err);
                    socket.emit('ERROR', { message: 'Failed to submit answer' });
                });
            });

            socket.on('REQUEST_NEXT_QUESTION', (data) => {
                interviewHandlers.REQUEST_NEXT_QUESTION(io, socket, data).catch(err => {
                    console.error('REQUEST_NEXT_QUESTION handler error:', err);
                    socket.emit('ERROR', { message: 'Failed to get next question' });
                });
            });
        } catch (err) {
            // If interviewHandlers file is missing, log and continue
            console.warn('No interviewHandlers module wired:', err.message);
        }

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);
        });
    });

    return io;
}

module.exports = setupWebSocket;