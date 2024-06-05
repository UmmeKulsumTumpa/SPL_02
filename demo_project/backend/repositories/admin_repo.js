const Admin = require('../models/Admin');

// Function to get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to add a new admin
const addNewAdmin = async (req, res) => {
    const { username, password, email, pinCode } = req.body;

    try {
        // Check if the username or email already exists
        const existingAdmin = await Admin.findOne({
            $or: [{ username }, { email }],
        });

        if (existingAdmin) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Create a new admin
        const newAdmin = new Admin({
            username,
            password,
            email,
            pinCode,
        });

        // Save the new admin
        const savedAdmin = await newAdmin.save();
        res.json(savedAdmin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to remove an admin by username
const removeAdmin = async (req, res) => {
    const { username } = req.params;

    try {
        const removedAdmin = await Admin.findOneAndDelete({ username });
        if (!removedAdmin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.json({ message: 'Admin removed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to update admin's password
const updateAdminPassword = async (req, res) => {
    const { username } = req.params;
    const { password } = req.body;

    try {
        const updatedAdmin = await Admin.findOneAndUpdate(
            { username },
            { password },
            { new: true }
        );
        if (!updatedAdmin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.json(updatedAdmin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to update admin's email
const updateAdminEmail = async (req, res) => {
    const { username } = req.params;
    const { email } = req.body;

    try {
        const updatedAdmin = await Admin.findOneAndUpdate(
            { username },
            { email },
            { new: true }
        );
        if (!updatedAdmin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.json(updatedAdmin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to update admin's pinCode
const updateAdminPinCode = async (req, res) => {
    const { username } = req.params;
    const { pinCode } = req.body;

    try {
        const updatedAdmin = await Admin.findOneAndUpdate(
            { username },
            { pinCode },
            { new: true }
        );
        if (!updatedAdmin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.json(updatedAdmin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to retrieve a single admin by username
const getAdminByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.json(admin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    getAllAdmins,
    addNewAdmin,
    removeAdmin,
    updateAdminPassword,
    updateAdminEmail,
    updateAdminPinCode,
    getAdminByUsername,
};
