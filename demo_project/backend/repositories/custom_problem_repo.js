const CustomProblem = require('../models/CustomProblem');

// Generate problem ID
const generateProblemId = async () => {
	const count = await CustomProblem.countDocuments();
	return `CS/${count + 1}T`;
};

// Logic for creating a custom problem
const createCustomProblem = async (req, res) => {
	try {
		const { problemTitle, timeLimit, memoryLimit, problemDescription, testCases } = req.body;
		const inputFile = req.files['inputFile'][0];
		const outputFile = req.files['outputFile'][0];

		if (!problemTitle || !timeLimit || !memoryLimit || !problemDescription || !testCases) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		const problemId = await generateProblemId();

		const customProblem = new CustomProblem({
			problemId,
			problemTitle,
			timeLimit,
			memoryLimit,
			problemDescription,
			testCases: JSON.parse(testCases), // Assuming test cases are sent as a JSON string
			inputFile: inputFile.buffer,
			inputFileContentType: inputFile.mimetype,
			outputFile: outputFile.buffer,
			outputFileContentType: outputFile.mimetype,
		});

		await customProblem.save();
		res.json({ problemId });
	} catch (error) {
		console.error('Error saving problem:', error);
		res.status(500).json({ error: 'Server error', details: error.message });
	}
};

// Logic for getting a custom problem by ID
const getCustomProblemById = async (req, res) => {
	try {
		const { problemId } = req.params;
		console.log(problemId);
		const customProblem = await CustomProblem.findOne({ problemId: problemId });
		console.log(customProblem);

		if (!customProblem) {
			return res.status(404).json({ error: 'Problem not found' });
		}

		res.json(customProblem);
	} catch (error) {
		console.error('Error retrieving problem:', error);
		res.status(500).json({ error: 'Server error', details: error.message });
	}
};

// Logic for updating a custom problem by ID
const updateCustomProblemById = async (req, res) => {
	try {
		const { problemId } = req.params;
		const { problemTitle, timeLimit, memoryLimit, problemDescription, testCases } = req.body;
		const inputFile = req.files['inputFile'] ? req.files['inputFile'][0] : null;
		const outputFile = req.files['outputFile'] ? req.files['outputFile'][0] : null;

		const updateData = {
			problemTitle,
			timeLimit,
			memoryLimit,
			problemDescription,
			testCases: JSON.parse(testCases), // Assuming test cases are sent as a JSON string
		};

		if (inputFile) {
			updateData.inputFile = inputFile.buffer;
			updateData.inputFileContentType = inputFile.mimetype;
		}

		if (outputFile) {
			updateData.outputFile = outputFile.buffer;
			updateData.outputFileContentType = outputFile.mimetype;
		}

		const customProblem = await CustomProblem.findOneAndUpdate({ problemId }, updateData, { new: true });

		if (!customProblem) {
			return res.status(404).json({ error: 'Problem not found' });
		}

		res.json(customProblem);
	} catch (error) {
		console.error('Error updating problem:', error);
		res.status(500).json({ error: 'Server error', details: error.message });
	}
};

module.exports = { createCustomProblem, getCustomProblemById, updateCustomProblemById };
