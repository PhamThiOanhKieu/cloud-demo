const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { isTeacher } = require('../middleware/auth');

// ===== ĐĂNG KÝ GIẢNG VIÊN =====
router.get('/become-teacher', teacherController.showBecomeTeacher);

router.post('/become-teacher', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}, teacherController.becomeTeacher);

// ===== DASHBOARD =====
router.get('/dashboard', isTeacher, teacherController.dashboard);

// ===== KHÓA HỌC =====
router.get('/my-courses', isTeacher, teacherController.myCourses);
router.get('/create-course', isTeacher, teacherController.showCreateCourse);
router.post('/create-course', isTeacher, teacherController.createCourse);

module.exports = router;
