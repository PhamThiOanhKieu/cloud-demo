const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

console.log("ADMIN ROUTES LOADED");
console.log("adminControllers:", adminController);
console.log("teachers:", adminController.teachers);
console.log("users:", adminController.users);
console.log("orders:", adminController.orders);

// ===== TEST =====
router.get('/test', (req, res) => {
  res.send('Admin OK');
});

// ===== DASHBOARD =====
router.get('/dashboard', adminController.dashboard);

// ===== COURSES =====
router.get('/courses', adminController.courses);
router.get('/create-course', adminController.showCreateCourse);
router.post('/create-course', adminController.createCourse);
router.get('/edit-course/:id', adminController.showEditCourse);
router.post('/edit-course/:id', adminController.updateCourse);
router.get('/delete-course/:id', adminController.deleteCourse);

// ===== USERS =====
router.get('/users', adminController.users);

// ===== TEACHERS =====
router.get('/teachers', adminController.teachers);

// ===== ORDERS =====
router.get('/orders', adminController.orders);

// ===== CERTIFICATES =====
router.get('/certificates', adminController.certificates);

// ===== REVENUE =====
router.get('/revenue', adminController.revenue);

// ===== TEACHER APPROVAL =====
router.get('/teacher-approval', adminController.teacherApproval);
router.get('/approve-teacher/:id', adminController.approveTeacher);

module.exports = router;
