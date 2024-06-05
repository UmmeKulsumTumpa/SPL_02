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

// Use routes
app.use('/api/problem', problemsRouter);
app.use('/api/solution', solutionRouter);
app.use('/api/contestants', contestantsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
