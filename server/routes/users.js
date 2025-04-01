const express = require('express');
const Task = require('../models/Task');
const taskSign = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth')

const router = express.Router();

router.post('/postTask', authenticateToken, async (req, res) => {
    try {
        // console.log(req.body);

        const tasks = new Task({
            title: req.body.title,
            description: req.body.description,
            priorityLevel: req.body.priorityLevel,
            dueDate: req.body.dueDate,
            completed: req.body.completed,
            user: req.user.userId
        });

        await tasks.save()

        res.status(200).json({ message: "TASK successfully ADDED!" })
    } catch (error) {
        console.log(error, "postTask ERROR");
    }
});

router.get('/getTasks', authenticateToken, async (req, res) => {
    try {
        // let tasks = await Task.find();
        const tasks = await Task.find({ user: req.user.userId });
        res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
    }
});

router.delete('/deleteTask', async (req, res) => {
    try {
        const UID = req.query.id;
        const detail = await Task.findByIdAndDelete(UID);
        res.status(200).json({ message: "Delete TASK" });
    } catch (error) {
        console.log(error, "deleteTask ERROR");
    }
});

router.post('/signUpDetail', async (req, res) => {
    // console.log("**************");

    try {
        let { email, password } = req.body
        // console.log(req.body);

        if (!email || !password) {
            return res.status(400).json({ message: "Enter Details!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters!" });
        }

        const allUsers = await taskSign.findOne({ email })
        // console.log(allUsers.email);

        if (allUsers) {
            return res.status(400).json({ message: "USER already EXISTS!" })
        }
        // console.log("************");

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new taskSign({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword
        })

        await newUser.save()

        res.status(200).json({ message: "USER CREATED!" })

    } catch (error) {
        console.log(error, "signUpDetail ERROR");
    }
});

router.post('/loginDetail', async (req, res) => {
    try {
        let { email, password } = req.body;
        // console.log(email, password);

        if (!email || !password) {
            return res.status(400).json({ message: "Enter Details!" });
        };

        const user = await taskSign.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "USER not FOUND!" });
        };

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        };

        const token = jwt.sign({ userId: user._id }, 'athulsecretKey');
        // console.log(token);

        res.status(200).json({ message: "LOGIN SUCCESSFUL!", token });

        //console.log("User password in DB:", user.password);
        // console.log("Entered password:", password);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.put('/statusUpdation', async (req, res) => {
    const status = req.body.newStatus;
    const UID = req.query.id;

    // console.log(status, UID);

    const updatedStatus = await Task.findByIdAndUpdate(
        UID,
        { $set: { completed: status } },
        { new: true }
    );
    // console.log(updatedStatus, "UPDATEDSTATUS");

    res.status(203).json({ message: "STATUS UPDATED!" });
});

router.put('/editTaskDes', async (req, res) => {
    try {
        const taskID = req.body.id;
        const newDescription = req.body.newText;
        // console.log(taskID, newDescription);

        const updatedDes = await Task.findByIdAndUpdate(
            taskID,
            { description: newDescription },
            { new: true }
        );
        if (!updatedDes) {
            return res.status(404).json({ message: 'TASK not FOUND!' });
        }
        res.status(200).json({ message: 'Description updated successfully!' });
    } catch (error) {
        console.log(error);
    }
});

router.put('/bulkStatusUpdate', async (req, res) => {
    const { ids, newStatus } = req.body;
    try {
        await Task.updateMany(
            { _id: { $in: ids } },
            { $set: { completed: newStatus } }
        );
        res.status(200).json({ message: "Status updated for selected tasks" });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
});

router.post('/bulkDelete', async (req, res) => {
    const { ids } = req.body;
    try {
        await Task.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: "Selected tasks deleted" });
    } catch (error) {
        res.status(500).json({ message: "Deletion failed" });
    }
});

router.get('/user-profile', authenticateToken, async (req, res) => {
    try {
        // console.log("Token payload:", req.user);

        const userId = req.user.userId;
        // console.log("Looking for user ID:", userId);

        const user = await taskSign.findById(req.user.userId).select('name email phone');

        if (!user) {
            console.log("User not found in DB");
            return res.status(404).json({ message: 'User not found' });
        }

        // console.log("User found:", user);
        res.json(user);
    } catch (err) {
        console.error("ERROR retrieving profile:", err.message);
        res.status(500).json({ message: "Error retrieving user profile" });
    }
});

router.put('/user-profile', authenticateToken, async (req, res) => {
    try {
        const { name, phone } = req.body;
        const updatedUser = await taskSign.findByIdAndUpdate(
            req.user.userId,
            { name, phone },
            { new: true, runValidators: true }
        ).select('name email phone');

        res.json(updatedUser);
    } catch (err) {
        console.error("Error updating profile:", err.message);
        res.status(500).json({ message: "Error updating profile" });
    }
});

router.get('/task-stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const totalTasks = await Task.countDocuments({ user: userId });
        const completedTasks = await Task.countDocuments({ user: userId, completed: true });
        const overdueTasks = await Task.countDocuments({
            user: userId,
            dueDate: { $lt: new Date() },
            completed: false
        });

        res.json({
            total: totalTasks,
            completed: completedTasks,
            overdue: overdueTasks
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching task statistics' });
    }
});

// Endpoint to change the user's password
router.put('/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    // console.log('Received request to change password:', req.body);

    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "Please fill in all fields." });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    if (newPassword.length < 6 || confirmPassword.length < 6) {
        return res.status(400).json({ message: "New password and confirm password must be at least 6 characters." });
    }

    try {
        const user = await taskSign.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        //   console.log('Decoded User:', req.user.userId);
        //   console.log('Stored Password:', user.password);
        //   console.log('Stored hashed password:', user.password);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password incorrect." });
        }

        // Hash the new password and update
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;
