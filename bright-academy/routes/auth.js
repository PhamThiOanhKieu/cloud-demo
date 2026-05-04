const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const teacherController = require('../controllers/teacherController');

router.get('/login', authController.showLogin);
router.post('/login', authController.login);

// REGISTER
router.get('/register', authController.showRegister);
router.post('/register', authController.register);

// LOGOUT
router.get('/logout', authController.logout);

// ===== ĐĂNG KÝ GIẢNG VIÊN =====
router.get('/become-teacher', teacherController.showBecomeTeacher);
router.post('/become-teacher', teacherController.becomeTeacher);

// ===== DASHBOARD =====
router.get('/dashboard', teacherController.dashboard);

// ===== HỌC VIÊN =====
router.get('/students', teacherController.students);

// ===== DOANH THU =====
router.get('/revenue', teacherController.revenue);

// ===== KHÓA HỌC (nếu bạn đã làm) =====
router.get('/my-courses', teacherController.myCourses);
router.get('/create-course', teacherController.showCreateCourse);
router.post('/create-course', teacherController.createCourse);

module.exports = router;
