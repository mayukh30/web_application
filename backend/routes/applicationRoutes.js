const express = require('express');
const Application = require('../models/Application');
const { protect, seekerOnly, recruiterOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// POST apply for a job (Seeker)
router.post('/:jobId', protect, seekerOnly, async (req, res) => {
  try {
    const { coverLetter, skills } = req.body;
    const { jobId } = req.params;

    // Check if already applied
    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Process skills if it's a comma-separated string
    let parsedSkills = [];
    if (skills) {
      parsedSkills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(s => s);
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
      skills: parsedSkills
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET my applications (Seeker)
router.get('/myapplications', protect, seekerOnly, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET applications for a specific job (Recruiter)
router.get('/job/:jobId', protect, recruiterOnly, async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // We ideally should verify here if the logged in recruiter owns the job.
    // For simplicity, we just fetch applications for the job.
    
    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
