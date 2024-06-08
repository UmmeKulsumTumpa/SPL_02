const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const addProblemRouter = require('./routes/addProblem');
const submitSolutionRouter = require('./routes/submitSolution');

const app = express();

mongoose.connect('mongodb+srv://bsse1307:bsse1307@cluster0.nqcakei.mongodb.net/codesphere?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/addProblem', addProblemRouter);
app.use('/submitSolution', submitSolutionRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
