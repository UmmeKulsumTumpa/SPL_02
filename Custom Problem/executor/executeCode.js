const { runCPP } = require("./runCPP");

async function executeCode(problemId, solutionId, submissionFileURL) {
    return runCPP(problemId, submissionFileURL);
}

module.exports = executeCode;
