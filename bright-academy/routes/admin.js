const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

const upload = require('../middleware/upload');

// tạo khóa học (POST)
router.post(
  '/admin/course/create',
  isAdmin,
  upload.single('thumbnail'), // 🔥 QUAN TRỌNG
  adminController.createCourse
);
// Dashboard
router.get('/', isAdmin, adminController.dashboard);

// Courses
router.get('/courses', isAdmin, adminController.courses);
router.get('/course/create', isAdmin, adminController.createCoursePage);
router.post('/course/create', isAdmin, adminController.createCourse);

router.get('/course/edit/:id', isAdmin, adminController.editCoursePage);
router.post('/course/edit/:id', isAdmin, adminController.editCourse);

router.get('/course/delete/:id', isAdmin, adminController.deleteCourse);

// duyệt khóa học
router.get('/admin/pending-courses', isAdmin, adminController.pendingCourses);
router.get('/admin/course/approve/:id', isAdmin, adminController.approveCourse);

// duyệt giảng viên
router.get('/admin/teacher-approval', isAdmin, adminController.teacherApproval);
router.get('/admin/approve-teacher/:id', isAdmin, adminController.approveTeacher);

// Others
router.get('/users', isAdmin, adminController.users);
router.get('/teachers', isAdmin, adminController.teachers);
router.get('/orders', isAdmin, adminController.orders);
router.get('/certificates', isAdmin, adminController.certificates);
router.get('/banners', isAdmin, adminController.banners);
router.get('/revenue', isAdmin, adminController.revenue);
router.get('/teacher-approval', isAdmin, adminController.teacherApproval);

module.exports = router;
