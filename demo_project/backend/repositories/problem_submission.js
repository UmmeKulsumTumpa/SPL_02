const axios = require("axios");
const scraper = require("./scraper");
const puppeteer = require("puppeteer");
const https = require('https');

// Hard-coded handle and password
const handle = "Tumpa-1307";
const password = "tumpa";

// Function to submit a problem
async function submitProblem(type, pid, solutionFile) {
	try {
		if (type !== "CF") {
			throw new Error("Invalid problem type");
		}
		const match = pid.match(/([0-9]+)([A-Z][A-Z0-9]*)$/);
		if (!match) throw new Error('Invalid Codeforces problem ID');
		const contest = match[1];
		const problem = match[2];

		// Get problem details
		const problemDetails = {
			submitLink: `https://codeforces.com/contest/${contest}/submit`,
			problemIndex: problem,
			language: '54'
		};

		// Simulate login to Codeforces
		const { isLoggedIn, page } = await loginToCodeforces(handle, password);
		if (!isLoggedIn) {
			throw new Error("Login failed. Please check your handle and password.");
		}

		// Submit problem
		const submissionResult = await submitToCodeforces(
			problemDetails,
			solutionFile,
			page
		);

		return submissionResult;
	} catch (err) {
		throw err;
	}
}

// Function to simulate login to Codeforces
async function loginToCodeforces(handle, password) {
	try {
		const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();

		// Navigate to the Codeforces login page
		await page.goto("https://codeforces.com/enter", {
			waitUntil: "networkidle2",
		});

		// Wait for the login form to appear
		await page.waitForSelector("#enterForm");

		// Fill in the login form
		await page.type("#handleOrEmail", handle);
		await page.type("#password", password);

		// Submit the login form
		await page.click(".submit");

		// Wait for navigation after login
		await page.waitForNavigation();

		// Check if login was successful
		const isLoggedIn = page.url().includes("https://codeforces.com/");

		// Close the browser
		//await browser.close();

		return { isLoggedIn, page };
	} catch (error) {
		throw new Error(`Failed to login to Codeforces: ${error.message}`);
	}
}

async function submitToCodeforces(problemDetails, solutionFile, page) {
	try {
		// const browser = await puppeteer.launch({ headless: true });
		// const page = await browser.newPage();

	await page.goto(problemDetails.submitLink, { waitUntil: 'networkidle2' });
    //console.log("Submission page loaded");

    // Wait for the problem index selector to appear
    await page.waitForSelector('select[name="submittedProblemIndex"]');

    // Select the problem index
    await page.select('select[name="submittedProblemIndex"]', problemDetails.problemIndex);

    // Wait for the language selection dropdown to appear
    await page.waitForSelector('select[name="programTypeId"]');

    // Select the language from the dropdown
    await page.select('select[name="programTypeId"]', problemDetails.language);

    // Upload the solution file
    const inputUploadHandle = await page.$('input[name="sourceFile"]');
    await inputUploadHandle.uploadFile(solutionFile);

    // Submit the form
    await Promise.all([
      page.waitForNavigation(), // Wait for navigation to complete
      page.click('.submit'), // Click the submit button
    ]);

	const validVerdicts = new Set([
		'FAILED', 'OK', 'PARTIAL', 'COMPILATION_ERROR', 'RUNTIME_ERROR', 
		'WRONG_ANSWER', 'PRESENTATION_ERROR', 'TIME_LIMIT_EXCEEDED', 
		'MEMORY_LIMIT_EXCEEDED', 'IDLENESS_LIMIT_EXCEEDED', 'SECURITY_VIOLATED', 
		'CRASHED', 'INPUT_PREPARATION_CRASHED', 'CHALLENGED', 'SKIPPED', 
		'REJECTED'
	]);
	
	let submissionResult;
	do {
		submissionResult = await getVerdict(1, 1); // Assuming we want to check only the latest submission
		
		if (validVerdicts.has(submissionResult[0].verdict)) {
			break; // Break the loop if the verdict is present and valid
		}
		
		await wait(2000);
	
	} while (true); // Infinite loop, will break when conditions are met
	
	console.log(submissionResult[0].verdict);
	return submissionResult;
	


	} catch (err) {
		throw new Error(`Failed to submit problem to Codeforces: ${err.message}`);
	}
}

async function wait(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }

async function getVerdict(from, count) {
	try {
		const url = `https://codeforces.com/api/user.status?handle=${handle}&from=${from}&count=${count}`;

		return new Promise((resolve, reject) => {
			https
				.get(url, (response) => {
					let data = "";

					// A chunk of data has been received.
					response.on("data", (chunk) => {
						data += chunk;
					});

					// The whole response has been received.
					response.on("end", () => {
						const jsonData = JSON.parse(data);
						if (jsonData.status === "OK") {
							const submissions = jsonData.result;
							resolve(submissions);
						} else {
							reject(
								`Failed to retrieve submissions. Reason: ${jsonData.comment}`
							);
						}
					});
				})
				.on("error", (error) => {
					reject(`Error retrieving data: ${error.message}`);
				});
		});
	} catch (error) {
		throw new Error(`Failed to get verdict: ${error.message}`);
	}
}

module.exports = {
	submitProblem,
};
