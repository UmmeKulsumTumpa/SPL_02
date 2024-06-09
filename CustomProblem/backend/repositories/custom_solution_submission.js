const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const { promisify } = require('util');
const Solution = require('../models/Solution');
const CustomProblem = require('../models/CustomProblem');

const execPromise = promisify(exec);

// Ensure the solutions directory exists
const solutionsDir = path.join(os.tmpdir(), 'solutions');
if (!fs.existsSync(solutionsDir)) {
    fs.mkdirSync(solutionsDir, { recursive: true });
}

// Helper function to convert time and memory limits to appropriate units
function parseLimit(limit) {
    const value = parseFloat(limit);
    if (limit.toLowerCase().includes('ms')) {
        return value / 1000;
    }
    if (limit.toLowerCase().includes('kb')) {
        return value / 1024;
    }
    return value;
}

const submitSolution = async (problemId, solutionFile) => {
    console.log(`Received problemId: ${problemId}`);

    const problem = await CustomProblem.findOne({ problemId: problemId });
    if (!problem) {
        console.error(`Problem with problemId ${problemId} not found`);
        throw new Error('Problem not found');
    }

    const solutionCode = solutionFile.buffer.toString('utf-8');

    const newSolution = new Solution({
        problem: problem._id,
        solutionCode
    });

    await newSolution.save();

    const solutionId = newSolution._id;
    const sourceFilePath = path.join(solutionsDir, `${solutionId}.cpp`);
    const inputFilePath = path.join(solutionsDir, `${solutionId}_input.txt`);
    const outputFilePath = path.join(solutionsDir, `${solutionId}_output.txt`);
    fs.writeFileSync(sourceFilePath, solutionCode);
    fs.writeFileSync(inputFilePath, problem.inputFile);

    const compileCommand = `g++ ${sourceFilePath} -o ${sourceFilePath}.out`;
    const runCommand = `${sourceFilePath}.out < ${inputFilePath} > ${outputFilePath}`;

    try {
        await execPromise(compileCommand);
    } catch (compileError) {
        console.error(`Compile error: ${compileError.stderr}`);
        newSolution.verdict = 'Compilation Error';
        await newSolution.save();
        fs.unlinkSync(sourceFilePath);
        fs.unlinkSync(inputFilePath);
        return newSolution;
    }

    const startTime = Date.now();
    try {
        await execPromise(runCommand, { timeout: parseLimit(problem.timeLimit) * 1000 });
        const execTime = (Date.now() - startTime) / 1000;

        const output = fs.readFileSync(outputFilePath, 'utf-8').trim();
        const expectedOutput = problem.outputFile.toString('utf-8').trim();

        if (execTime > parseLimit(problem.timeLimit)) {
            newSolution.verdict = 'Time Limit Exceeded';
        } else if (output !== expectedOutput) {
            newSolution.verdict = 'Wrong Answer';
        } else {
            newSolution.verdict = 'Accepted';
        }

        newSolution.execTime = execTime;
    } catch (runError) {
        console.error(`Runtime error: ${runError.stderr}`);
        newSolution.verdict = 'Runtime Error';
    }

    await newSolution.save();

    fs.unlinkSync(sourceFilePath);
    fs.unlinkSync(inputFilePath);
    fs.unlinkSync(outputFilePath);

    return newSolution;
};

module.exports = { submitSolution };
