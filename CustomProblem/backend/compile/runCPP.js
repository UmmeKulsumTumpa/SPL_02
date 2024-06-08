const { exec, spawn } = require("child_process");
const fs = require('fs');
const Solution = require('../models/Solution'); // Import your Solution model
const { testOutput } = require("./testOutput");

async function runCPP(solutionId, problemId) {
    try {
        // Fetch the solution from the database based on the solutionId
        const solution = await Solution.findById(solutionId);

        if (!solution) {
            throw new Error(`Solution with ID ${solutionId} not found`);
        }

        // Assuming solution.code contains the C++ code
        const code = solution.code;

        // Write the solution code to a temporary file
        const filePath = `/tmp/solution_${solutionId}.cpp`;
        fs.writeFileSync(filePath, code);

        return new Promise((resolve, reject) => {
            const dir = filePath.replace('.cpp', '');

            // Compile the solution
            exec(`g++ ${filePath} -o ${dir}`, async (error, stdout, stderr) => {
                if (error) {
                    resolve({
                        type: 3,
                        result: false,
                        message: error.toString().replace(new RegExp(dir, 'g'), '***'),
                        verdict: 'ERROR',
                        execTime: 'N/A'
                    });
                }

                if (stderr) {
                    return;
                }

                // Run the compiled solution
                const child = spawn(`${dir}`);
                const output = await testOutput(child, problemId); // Test the output

                resolve(output);
            });
        });
    } catch (error) {
        return {
            type: 3,
            result: false,
            message: error.message,
            verdict: 'ERROR',
            execTime: 'N/A'
        };
    }
}

module.exports = { runCPP };
