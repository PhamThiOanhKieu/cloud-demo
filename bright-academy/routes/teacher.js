const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// 👇 QUAN TRỌNG (bị mất lúc nãy)
router.get('/become-teacher', teacherController.showBecomeTeacher);
router.post('/become-teacher', teacherController.becomeTeacher);

// các route khác
router.get('/dashboard', teacherController.dashboard);
router.get('/students', teacherController.students);
router.get('/revenue', teacherController.revenue);

module.exports = router;
