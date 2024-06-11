const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFile, spawn } = require('child_process');
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

const submitSolution = async (problemId, solutionFile, contestId, username) => {
    const problem = await CustomProblem.findOne({ problemId: problemId });
    if (!problem) {
        console.error(`Problem with problemId ${problemId} not found`);
        throw new Error('Problem not found');
    }

    const solutionCode = fs.readFileSync(solutionFile.path, 'utf8');

    const newSolution = new Solution({
        problem: problem._id,
        solutionCode,
        contestId, // Save contestId
        problemId, // Save problemId
        username // Save username
    });

    await newSolution.save();

    const solutionId = newSolution._id;
    const sourceFilePath = path.join(solutionsDir, `${solutionId}.cpp`);
    const inputFilePath = path.join(solutionsDir, `${solutionId}_input.txt`);
    const outputFilePath = path.join(solutionsDir, `${solutionId}_output.txt`);
    fs.writeFileSync(sourceFilePath, solutionCode);
    fs.writeFileSync(inputFilePath, problem.inputFile);

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
            sid: newSolution.sid // Return sid on error
        };
    }

    const startTime = Date.now();
    let execTime = 0;
    const hardTimeLimit = 3; // Hard limit in seconds
    const softTimeLimit = parseLimit(problem.timeLimit); // Time limit from database

    const runPromise = new Promise((resolve, reject) => {
        const child = spawn(`${sourceFilePath}.out`, [], {
            stdio: ['pipe', 'pipe', 'pipe'],
        });

        // Track memory usage
        let maxMemoryUsageMB = 0;
        let stdoutData = '';
        let stderrData = '';

        child.stdout.on('data', (data) => {
            stdoutData += data.toString();
            const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // Convert to MB
            if (memoryUsage > maxMemoryUsageMB) {
                maxMemoryUsageMB = memoryUsage;
            }
        });

        child.stderr.on('data', (data) => {
            stderrData += data.toString();
        });

        // Write input to the child process
        const input = fs.readFileSync(inputFilePath);
        child.stdin.write(input);
        child.stdin.end();

        // Listen for process completion
        child.on('close', (code) => {
            execTime = (Date.now() - startTime) / 1000;
            if (code === 0) {
                // Execution successful
                resolve({ output: stdoutData, maxMemoryUsageMB });
            } else {
                // Execution failed
                reject({ message: 'Runtime Error', maxMemoryUsageMB, stderr: stderrData });
            }
        });

        // Explicit timeout handling
        const timeoutId = setTimeout(() => {
            child.kill('SIGTERM');
            reject({ message: 'Time Limit Exceeded', maxMemoryUsageMB });
        }, hardTimeLimit * 1000);

        // Clear timeout if process finishes early
        child.on('exit', () => {
            clearTimeout(timeoutId);
        });

        // Terminate the process if memory limit is exceeded
        const memoryLimitMB = parseLimit(problem.memoryLimit);
        const memoryCheckInterval = setInterval(() => {
            const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // Convert to MB
            if (memoryUsage > memoryLimitMB) {
                child.kill('SIGTERM');
                clearInterval(memoryCheckInterval);
                reject({ message: 'Memory Limit Exceeded', maxMemoryUsageMB });
            }
        }, 1000); // Check every second
    });

    try {
        const { output: runOutput, maxMemoryUsageMB } = await runPromise;
        const output = runOutput.trim().split('\n');
        const expectedOutput = problem.outputFile.toString('utf-8').trim().split('\n');

        if (execTime > softTimeLimit) {
            newSolution.verdict = 'Time Limit Exceeded';
        } else if (maxMemoryUsageMB > parseLimit(problem.memoryLimit)) {
            newSolution.verdict = 'Memory Limit Exceeded';
        } else if (output.length !== expectedOutput.length || !output.every((val, index) => val === expectedOutput[index])) {
            newSolution.verdict = 'Wrong Answer';
        } else {
            newSolution.verdict = 'Accepted';
        }

        newSolution.execTime = execTime;
        newSolution.maxMemoryUsageMB = maxMemoryUsageMB;
        newSolution.output = output;
    } catch (runError) {
        if (runError.message === 'Memory Limit Exceeded') {
            console.error(`Execution memory limit exceeded: ${runError.message}`);
            newSolution.verdict = 'Memory Limit Exceeded';
        } else if (runError.message === 'Runtime Error') {
            console.error(`Runtime error: ${runError.message}`);
            newSolution.verdict = 'Runtime Error';
        } else if (runError.message === 'Time Limit Exceeded') {
            console.error(`Time limit exceeded: ${runError.message}`);
            newSolution.verdict = 'Time Limit Exceeded';
        } else {
            console.error(`Unknown error: ${runError.message}`);
            newSolution.verdict = 'Unknown Error';
        }
        newSolution.maxMemoryUsageMB = runError.maxMemoryUsageMB;
        newSolution.output = runError.stderr ? runError.stderr.split('\n') : [];
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

    return {
        verdict: newSolution.verdict,
        sid: newSolution.sid // Return sid on success
    };
};

module.exports = { submitSolution };
