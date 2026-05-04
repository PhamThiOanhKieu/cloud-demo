const db = require('../config/db');

// FORM đăng ký giảng viên
exports.showBecomeTeacher = (req, res) => {
  res.render('client/become-teacher');
};

// xử lý đăng ký
exports.becomeTeacher = async (req, res) => {
  const { teaching_exp, video_exp, audience } = req.body;

  await db.query(
    `UPDATE users 
     SET teacher_request=1, teaching_exp=?, video_exp=?, audience=? 
     WHERE id=?`,
    [teaching_exp, video_exp, audience, req.session.user.id]
  );

  res.send('Đã gửi yêu cầu! Chờ admin duyệt.');
};

// DASHBOARD
exports.dashboard = async (req, res) => {
  const [courses] = await db.query(
    "SELECT * FROM courses WHERE teacher_id=?",
    [req.session.user.id]
  );

  res.render('teacher/dashboard', { courses });
};

// KHÓA HỌC CỦA TÔI
exports.myCourses = async (req, res) => {
  const [courses] = await db.query(
    "SELECT * FROM courses WHERE teacher_id=?",
    [req.session.user.id]
  );

  res.render('teacher/dashboard', { courses });
};

// FORM TẠO KHÓA HỌC
exports.showCreateCourse = (req, res) => {
  res.render('teacher/create-course');
};

// TẠO KHÓA HỌC
exports.createCourse = async (req, res) => {
  const { title, price, description, thumbnail } = req.body;

  await db.query(
    `INSERT INTO courses 
    (title, price, description, thumbnail, teacher_id, teacher_name, status) 
    VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
    [
      title,
      price,
      description,
      thumbnail,
      req.session.user.id,
      req.session.user.fullname
    ]
  );

  res.redirect('/dashboard');
};
