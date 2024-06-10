const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://bsse1307:bsse1307@cluster0.nqcakei.mongodb.net/codesphere?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

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
const customProblemsRouter = require('./routes/custom_problems');

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
app.use('/api/custom_problems', customProblemsRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
