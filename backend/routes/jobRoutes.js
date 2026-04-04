const express = require('express');
const Job = require('../models/Job');
const { protect, recruiterOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// GET all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('recruiter', 'name email').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET recruiter's jobs
router.get('/myjobs', protect, recruiterOnly, async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new job
router.post('/', protect, recruiterOnly, async (req, res) => {
  try {
    const { title, company, location, description, salary, skills } = req.body;
    
    if (!title || !company || !location || !description) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Process skills if it's a comma-separated string
    let parsedSkills = [];
    if (skills) {
      parsedSkills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(s => s);
    }

    const job = await Job.create({
      title,
      company,
      location,
      description,
      salary,
      skills: parsedSkills,
      recruiter: req.user.id
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
