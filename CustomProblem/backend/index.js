const express = require('express');
const cors = require('cors'); // Import CORS middleware
const mongoose = require('mongoose');
const addProblemRouter = require('./routes/addProblem');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://bsse1307:bsse1307@cluster0.nqcakei.mongodb.net/codesphere?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(cors()); // Use CORS middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/addProblem', addProblemRouter);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
