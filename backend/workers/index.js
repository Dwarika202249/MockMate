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
        return await processQuestionGeneration(job);
    });

    // Answer evaluation worker
    queues.answerEvaluation.process(async (job) => {
        return await processAnswerEvaluation(job);
    });

    // Interview summary worker
    queues.interviewSummary.process(async (job) => {
        return await processInterviewSummary(job);
    });

    // Set up completion handlers
    Object.entries(queues).forEach(([queueName, queue]) => {
        queue.on('completed', (job, result) => {
            // Job completed silently
        });

        queue.on('failed', (job, error) => {
            console.error(`Job ${job.id} in ${queueName} failed:`, error);
        });
    });

    console.log('All workers are set up and running');
}

module.exports = setupWorkers;