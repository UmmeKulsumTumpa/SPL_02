const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFile, exec } = require('child_process');
const { promisify } = require('util');
const pidusage = require('pidusage');
const Solution = require('../models/Solution');
const CustomProblem = require('../models/CustomProblem');

const execFilePromise = promisify(execFile);
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
    const memoryLimit = parseFloat(problem.memoryLimit); // Memory limit in MB

    const runPromise = new Promise((resolve, reject) => {
        const command = process.platform === 'win32'
            ? `${sourceFilePath}.out < ${inputFilePath}`
            : `ulimit -v ${memoryLimit * 1024}; /usr/bin/time -v ${sourceFilePath}.out < ${inputFilePath}`;
        
        const child = exec(command, { timeout: hardTimeLimit * 1000 }, (error, stdout, stderr) => {
            execTime = (Date.now() - startTime) / 1000;
            pidusage(child.pid, (err, stats) => {
                if (err || !stats) {
                    reject(new Error('Memory Usage Monitoring Error'));
                }
                const memoryUsage = stats.memory ? stats.memory / 1024 / 1024 : 0; // Convert from bytes to MB
                if (memoryUsage > memoryLimit) {
                    reject(new Error('Memory Limit Exceeded'));
                } else if (error) {
                    if (error.killed || error.signal === 'SIGKILL') {
                        reject(new Error('Time Limit Exceeded'));
                    } else {
                        reject(new Error(stderr || 'Runtime Error'));
                    }
                } else {
                    resolve({ stdout, memoryUsage });
                }
            });
        });

        // Write input to the child process
        child.stdin.write(fs.readFileSync(inputFilePath));
        child.stdin.end();
    });

    let memoryUsage = 0;

    try {
        const result = await runPromise;
        output = result.stdout.trim().split('\n');
        memoryUsage = result.memoryUsage;

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
        newSolution.memoryUsage = memoryUsage;
    } catch (runError) {
        if (runError.message === 'Time Limit Exceeded') {
            console.error(`Execution timed out: ${runError.message}`);
            newSolution.verdict = 'Time Limit Exceeded';
        } else if (runError.message === 'Memory Limit Exceeded') {
            console.error(`Memory limit exceeded: ${runError.message}`);
            newSolution.verdict = 'Memory Limit Exceeded';
        } else {
            console.error(`Runtime error: ${runError.message}`);
            newSolution.verdict = 'Runtime Error';
            output = runError.message;
        }

        newSolution.memoryUsage = memoryUsage;
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
        execTime: newSolution.execTime,
        memoryUsage: newSolution.memoryUsage,
        output: newSolution.verdict === 'Accepted' || newSolution.verdict === 'Wrong Answer' ? output : undefined
    };
};

module.exports = { submitSolution };
