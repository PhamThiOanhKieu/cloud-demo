const express = require('express');

const router = express.Router();

const adminController = require('../controllers/adminController');

const { isAdmin } = require('../middleware/auth');

router.get('/admin',isAdmin,adminController.dashboard);

router.get('/admin/courses',isAdmin,adminController.courses);

router.get('/admin/course/create',isAdmin,adminController.createCoursePage);

router.post('/admin/course/create',isAdmin,adminController.createCourse);

router.get('/admin/course/edit/:id',isAdmin,adminController.editCoursePage);

router.post('/admin/course/edit/:id',isAdmin,adminController.editCourse);

router.get('/admin/course/delete/:id',isAdmin,adminController.deleteCourse);

router.get('/admin/users',isAdmin,adminController.users);

router.get('/admin/teachers',isAdmin,adminController.teachers);

router.get('/admin/orders',isAdmin,adminController.orders);

router.get('/admin/certificates',isAdmin,adminController.certificates);

router.get('/admin/banners',isAdmin,adminController.banners);

router.get('/admin/revenue',isAdmin,adminController.revenue);

router.get('/admin/teacher-approval',isAdmin,adminController.teacherApproval);

module.exports = router;
