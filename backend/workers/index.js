const { queues } = require('../config/queue');
const {
    processQuestionGeneration,
    processAnswerEvaluation,
    processInterviewSummary
} = require('./processors');

// Set up workers for each queue
function setupWorkers() {
    // Question generation worker
    queues.questionGeneration.process(async (job) => {
        console.log(`Processing question generation job ${job.id}`);
        return await processQuestionGeneration(job);
    });

    // Answer evaluation worker
    queues.answerEvaluation.process(async (job) => {
        console.log(`Processing answer evaluation job ${job.id}`);
        return await processAnswerEvaluation(job);
    });

    // Interview summary worker
    queues.interviewSummary.process(async (job) => {
        console.log(`Processing interview summary job ${job.id}`);
        return await processInterviewSummary(job);
    });

    // Set up completion handlers
    Object.entries(queues).forEach(([queueName, queue]) => {
        queue.on('completed', (job, result) => {
            console.log(`Job ${job.id} in ${queueName} completed successfully`);
        });

        queue.on('failed', (job, error) => {
            console.error(`Job ${job.id} in ${queueName} failed:`, error);
        });
    });

    console.log('All workers are set up and running');
}

module.exports = setupWorkers;