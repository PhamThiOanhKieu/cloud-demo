const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isTeacher } = require('../middleware/auth');

// dashboard teacher
router.get('/teacher', isTeacher, async (req, res) => {
  const [courses] = await db.query(
    "SELECT * FROM courses WHERE teacher_id=?",
    [req.session.user.id]
  );

  res.render('teacher/dashboard', { courses });
});

module.exports = router;
