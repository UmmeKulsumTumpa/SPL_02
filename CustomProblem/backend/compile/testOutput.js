const { executeInput } = require("./executeInput");
const TempProblem = require("../models/TempProblem");

async function testOutput(processChild, problemId) {
    try {
        const tempProblem = await TempProblem.findOne({ problemId });

        if (!tempProblem) {
            throw new Error(`Problem with ID ${problemId} not found`);
        }

        const testInputs = tempProblem.inputFile.toString(); // Assuming inputFile is a Buffer
        const expectedOutputs = tempProblem.outputFile.toString(); // Assuming outputFile is a Buffer

        const output = await executeInput(processChild, testInputs);

        if (!output.result) {
            return output;
        }

        const actualOutput = output.data.join("").trim();
        const expectedOutput = expectedOutputs.trim();

        if (actualOutput !== expectedOutput) {
            return {
                result: false,
                type: 2,
                verdict: 'WA',
                execTime: 'N/A'
            };
        }

        return {
            result: true,
            type: 1,
            verdict: 'AC',
            execTime: output.execTime
        };
    } catch (error) {
        return {
            result: false,
            type: 3,
            verdict: 'ERROR',
            execTime: 'N/A',
            message: error.message
        };
    }
}

module.exports = { testOutput };
