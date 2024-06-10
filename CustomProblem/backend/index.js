const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const customProblemRoutes = require('./routes/custom_problem');
const customSolutionRoutes = require('./routes/custom_solution');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
const dbURI = 'mongodb+srv://bsse1307:bsse1307@cluster0.nqcakei.mongodb.net/codesphere?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

// Routes
app.use('/api/custom-problems', customProblemRoutes);
app.use('/api/custom-solutions', customSolutionRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Custom Problem Solver API');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
