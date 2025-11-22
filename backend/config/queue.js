const Queue = require('bull');
const Redis = require('ioredis');

// Redis configuration - prioritize REDIS_URL for production compatibility
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Create Redis client using REDIS_URL
const redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});

// Queue configurations
const defaultJobOptions = {
    attempts: 3,
    backoff: {
        type: 'exponential',
        delay: 1000
    },
    removeOnComplete: 100,  // Keep last 100 completed jobs
    removeOnFail: 200      // Keep last 200 failed jobs
};

// Create queues using REDIS_URL
const queues = {
    questionGeneration: new Queue('question-generation', redisUrl, {
        defaultJobOptions
    }),
    answerEvaluation: new Queue('answer-evaluation', redisUrl, {
        defaultJobOptions
    }),
    interviewSummary: new Queue('interview-summary', redisUrl, {
        defaultJobOptions
    })
};

// Error handling for queues
Object.values(queues).forEach(queue => {
    queue.on('error', (error) => {
        console.error(`Queue error: ${error}`);
    });

    queue.on('failed', (job, error) => {
        console.error(`Job ${job.id} failed: ${error}`);
    });
});

module.exports = {
    queues,
    redisClient
};