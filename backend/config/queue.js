const Queue = require('bull');
const Redis = require('ioredis');

// Redis configuration
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
};

// Create Redis client
const redisClient = new Redis(redisConfig);

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

// Create queues
const queues = {
    questionGeneration: new Queue('question-generation', { 
        redis: redisConfig,
        defaultJobOptions
    }),
    answerEvaluation: new Queue('answer-evaluation', {
        redis: redisConfig,
        defaultJobOptions
    }),
    interviewSummary: new Queue('interview-summary', {
        redis: redisConfig,
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