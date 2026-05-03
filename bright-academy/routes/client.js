const express = require('express');
const router = express.Router();
const db = require('../config/db');

// =====================
// TRANG CHỦ - HIỂN THỊ KHÓA HỌC
// =====================
router.get('/', async (req, res) => {
  try {
    const [courses] = await db.query("SELECT * FROM courses");

    res.render('client/home', { courses });

  } catch (err) {
    console.log(err);
    res.send('Lỗi load khóa học');
  }
});

router.get('/', async (req, res) => {
  const [courses] = await db.query(`
    SELECT courses.*, users.fullname AS teacher_name
    FROM courses
    LEFT JOIN users ON courses.teacher_id = users.id
    WHERE courses.status = 'approved'
  `);

  res.render('client/home', { courses });
});

// Đăng ký làm giảng viên

router.post('/become-teacher', async (req, res) => {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { teaching_exp, video_exp, audience } = req.body;

  await db.query(
    `UPDATE users 
     SET teacher_request=1, teaching_exp=?, video_exp=?, audience=? 
     WHERE id=?`,
    [teaching_exp, video_exp, audience, req.session.user.id]
  );

  res.send('Đã gửi yêu cầu! Chờ admin duyệt.');
});
// =====================
// CHI TIẾT KHÓA HỌC
// =====================
router.get('/course/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await db.query(
      "SELECT * FROM courses WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.send('Không tìm thấy khóa học');
    }

    res.render('client/course-detail', {
      course: rows[0]
    });

  } catch (err) {
    console.log(err);
    res.send('Lỗi');
  }
});

module.exports = router;
