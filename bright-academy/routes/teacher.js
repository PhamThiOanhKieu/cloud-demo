const express = require('express');
const router = express.Router();

const isTeacher = require('../middleware/teacher');

router.get('/dashboard', isTeacher, (req, res) => {

    res.render('teacher/dashboard');
});

module.exports = router;
