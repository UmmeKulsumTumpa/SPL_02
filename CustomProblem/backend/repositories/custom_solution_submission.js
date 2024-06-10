const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFile } = require('child_process');
const { promisify } = require('util');
const Solution = require('../models/Solution');
const CustomProblem = require('../models/CustomProblem');

const execFilePromise = promisify(execFile);

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

    try {
        await execFilePromise('g++', [sourceFilePath, '-o', `${sourceFilePath}.out`]);
    } catch (compileError) {
        console.error(`Compile error: ${compileError.stderr}`);
        newSolution.verdict = 'Compilation Error';
        await newSolution.save();
        fs.unlinkSync(sourceFilePath);
        fs.unlinkSync(inputFilePath);
        return {
            verdict: newSolution.verdict,
            output: compileError.stderr
        };
    }

    const startTime = Date.now();
    let execTime = 0;
    let output = '';
    const hardTimeLimit = 5; // Hard limit in seconds

    const runPromise = new Promise((resolve, reject) => {
        const child = execFile(`${sourceFilePath}.out`, {
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: hardTimeLimit * 1000
        }, (error, stdout, stderr) => {
            execTime = (Date.now() - startTime) / 1000;
            if (error) {
                if (error.killed || error.signal === 'SIGKILL') {
                    reject(new Error('Time Limit Exceeded'));
                } else {
                    reject(new Error(stderr || 'Runtime Error'));
                }
            } else {
                resolve(stdout);
            }
        });

        // Write input to the child process
        child.stdin.write(fs.readFileSync(inputFilePath));
        child.stdin.end();
    });

    try {
        output = await runPromise;
        output = output.trim().split('\n');
        const expectedOutput = problem.outputFile.toString('utf-8').trim().split('\n');

        const problemTimeLimit = parseLimit(problem.timeLimit);
        if (execTime > problemTimeLimit) {
            newSolution.verdict = 'Time Limit Exceeded';
        } else if (output.length !== expectedOutput.length || !output.every((val, index) => val === expectedOutput[index])) {
            newSolution.verdict = 'Wrong Answer';
        } else {
            newSolution.verdict = 'Accepted';
        }

        newSolution.execTime = execTime;
    } catch (runError) {
        if (runError.message === 'Time Limit Exceeded') {
            console.error(`Execution timed out: ${runError.message}`);
            newSolution.verdict = 'Time Limit Exceeded';
        } else {
            console.error(`Runtime error: ${runError.message}`);
            newSolution.verdict = 'Runtime Error';
            output = runError.message;
        }
    }

    await newSolution.save();

    // Ensure that files are unlinked properly
    try {
        fs.unlinkSync(sourceFilePath);
        fs.unlinkSync(inputFilePath);
        fs.unlinkSync(outputFilePath);
    } catch (err) {
        console.error(`Error cleaning up files: ${err.message}`);
    }

    if (newSolution.verdict === 'Accepted' || newSolution.verdict === 'Wrong Answer') {
        return {
            verdict: newSolution.verdict,
            output
        };
    } else {
        return {
            verdict: newSolution.verdict
        };
    }
};

module.exports = { submitSolution };
