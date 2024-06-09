const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8000; // Update the port number if needed


app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://bsse1307:bsse1307@cluster0.nqcakei.mongodb.net/codesphere?retryWrites=true&w=majority&appName=Cluster0', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(express.json());

// Import routes
const problemsRouter = require('./routes/problem');
const solutionRouter = require('./routes/solution');
const contestantsRouter = require('./routes/contestants');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const requestedContestRouter = require('./routes/requested_contest');
const approvedContestRouter = require('./routes/approved_contest');
const addCustomProblemRouter = require('./routes/custom_problem');
const submitCustomSolutionRouter = require('./routes/custom_solution');

// Use routes
app.use('/api/problem', problemsRouter);
app.use('/api/solution', solutionRouter);
app.use('/api/contestants', contestantsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);
app.use('/api/requested_contest', requestedContestRouter);
app.use('/api/approved_contest', approvedContestRouter);
app.use('/api/add_custom_problem', addCustomProblemRouter);
app.use('/api/custom_solution_submit', submitCustomSolutionRouter);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
