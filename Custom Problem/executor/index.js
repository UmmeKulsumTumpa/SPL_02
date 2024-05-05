const executeCode = require("./executeCode");

const problemId = "problem1";
const solutionId = "solution1";
const submissionFileURL = "/code.cpp";

executeCode(problemId, solutionId, submissionFileURL)
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error(error);
    });
