const express = require('express');
const router = new express.Router();
const User = require('../models/User'); // adjust path to your models

// POST route to apply for a job
router.post('/users/:username/jobs/:id', async (req, res, next) => {
  try {
    const { username, id: jobId } = req.params;
    
    // Call the applyForJob method
    const appliedJob = await User.applyForJob(username, jobId);
    
    return res.json({ applied: appliedJob.job_id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
