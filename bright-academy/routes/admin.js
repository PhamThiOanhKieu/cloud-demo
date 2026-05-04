const express = require('express');

const router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/dashboard', adminController.dashboard);

router.get('/courses', adminController.courses);

router.get('/create-course', adminController.showCreateCourse);

router.post('/create-course', adminController.createCourse);

router.get('/edit-course/:id', adminController.showEditCourse);

router.post('/edit-course/:id', adminController.updateCourse);

router.get('/delete-course/:id', adminController.deleteCourse);

router.get('/users', adminController.users);

router.get('/teachers', adminController.teachers);

router.get('/orders', adminController.orders);

router.get('/certificates', adminController.certificates);

router.get('/banners', adminController.banners);

router.get('/revenue', adminController.revenue);

router.get('/teacher-approval', adminController.teacherApproval);

router.get('/approve-teacher/:id', adminController.approveTeacher);

module.exports = router;

