const express = require('express');
const Task = require('../models/Task');
const taskSign = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/postTask', async (req, res) => {
    try {
        console.log(req.body);

        const tasks = new Task({
            title: req.body.title,
            description: req.body.description,
            priorityLevel: req.body.priorityLevel,
            dueDate: req.body.dueDate,
            completed: req.body.completed
        });

        await tasks.save()

        res.status(200).json({ message: "TASK successfully ADDED!" })
    } catch (error) {
        console.log(error, "postTask ERROR");
    }
});

router.get('/getTasks', async (req, res) => {
    try {
        let tasks = await Task.find();
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
            email,
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

        const token = jwt.sign({ userId: user._id }, "secretKey");
        // console.log(token);

        res.status(200).json({ message: "LOGIN SUCCESSFUL!", token });

        //         console.log("User password in DB:", user.password);
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


module.exports = router;
