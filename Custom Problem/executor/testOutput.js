const fs = require('fs');
const { executeInput } = require("./executeInput");
const { getFiles } = require("./getFiles");

/**
* 
* @param {ChildProcessWithoutNullStreams} processChild 
* @param {String} problemId 
*/
async function testOutput(processChild, problemId) {
    let testInputs = "";
    let expectedOutputs = "";
    try {
        testInputs = await getFiles(`./testcases/${problemId}/in.txt`);
        expectedOutputs = await getFiles(`./testcases/${problemId}/out.txt`);
    } catch (error) {
        return {
            result: false,
            type: 3,
            verdict: 'ERROR',
            execTime: 'N/A',
            message: error.message
        };
    }

    return new Promise((resolve, reject) => {
        executeInput(processChild, testInputs)
            .then(output => {
                if (!output.result) {
                    resolve(output);
                }

                const actualOutput = output.data.join("").trim();
                const expectedOutput = expectedOutputs.trim();
                if (actualOutput !== expectedOutput) {
                    resolve({
                        result: false,
                        type: 2,
                        verdict: 'WA',
                        execTime: 'N/A'
                    });
                }
                resolve({
                    result: true,
                    type: 1,
                    verdict: 'AC',
                    execTime: output.execTime
                });
            })
            .catch(err => {
                reject(err);
            });
    });
}

module.exports = { testOutput };
