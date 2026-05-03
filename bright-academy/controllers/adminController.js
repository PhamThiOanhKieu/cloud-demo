const db = require('../db');

exports.dashboard = async (req,res)=>{

    const [users] = await db.query(
        'SELECT COUNT(*) AS totalUsers FROM users'
    );

    const [courses] = await db.query(
        'SELECT COUNT(*) AS totalCourses FROM courses'
    );

    let totalOrders = 0;

    try{

        const [orders] = await db.query(
            'SELECT COUNT(*) AS totalOrders FROM orders'
        );

        totalOrders = orders[0].totalOrders;

    }catch(error){

        totalOrders = 0;

    }

    res.render('admin/dashboard',{

        totalUsers: users[0].totalUsers,

        totalCourses: courses[0].totalCourses,

        totalOrders

    });

};

exports.courses = async (req,res)=>{

    const [courses] = await db.query(

        `SELECT
        courses.*,
        users.fullname AS teacher_name
        FROM courses
        LEFT JOIN users
        ON courses.teacher_id = users.id`

    );

    res.render('admin/courses',{
        courses
    });

};

// =====================
// TRANG TẠO KHÓA HỌC
// =====================
exports.createCourse = async (req, res) => {
  const title = req.body?.title;
  const price = req.body?.price;
  const description = req.body?.description;

  const thumbnail = req.file ? req.file.filename : null;

  // 🔥 LẤY GIẢNG VIÊN TỪ SESSION
  const teacher_id = req.session.user.id;
  const teacher_name = req.session.user.fullname;

  try {
    await db.query(
      `INSERT INTO courses 
      (title, price, description, thumbnail, teacher_id, teacher_name) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [title, price, description, thumbnail, teacher_id, teacher_name]
    );

    res.redirect('/admin/courses');

  } catch (err) {
    console.log(err);
    res.send('Lỗi tạo khóa học');
  }
};
exports.editCoursePage = async (req,res)=>{

    const id = req.params.id;

    const [courses] = await db.query(
        'SELECT * FROM courses WHERE id=?',
        [id]
    );

    const [teachers] = await db.query(
        "SELECT * FROM users WHERE role='teacher'"
    );

    res.render('admin/editCourse',{
        course: courses[0],
        teachers
    });

};

exports.editCourse = async (req,res)=>{

    const id = req.params.id;

    const {
        title,
        description,
        thumbnail,
        price,
        category,
        teacher_id
    } = req.body;

    await db.query(

        `UPDATE courses
        SET
        title=?,
        description=?,
        thumbnail=?,
        price=?,
        category=?,
        teacher_id=?
        WHERE id=?`,

        [
            title,
            description,
            thumbnail,
            price,
            category,
            teacher_id,
            id
        ]

    );

    res.redirect('/admin/courses');

};

exports.deleteCourse = async (req,res)=>{

    const id = req.params.id;

    await db.query(
        'DELETE FROM courses WHERE id=?',
        [id]
    );

    res.redirect('/admin/courses');

};

exports.users = async (req,res)=>{

    const [users] = await db.query(
        'SELECT * FROM users'
    );

    res.render('admin/users',{
        users
    });

};

exports.teachers = async (req,res)=>{

    const [teachers] = await db.query(

        "SELECT * FROM users WHERE role='teacher'"

    );

    res.render('admin/teachers',{

        teachers

    });

};

exports.orders = async (req,res)=>{

    const [orders] = await db.query(

        'SELECT * FROM orders'

    );

    res.render('admin/orders',{

        orders

    });

};

exports.certificates = async (req,res)=>{

    const [certificates] = await db.query(

        'SELECT * FROM certificates'

    );

    res.render('admin/certificates',{

        certificates

    });

};

exports.banners = async (req,res)=>{

    const [banners] = await db.query(

        'SELECT * FROM banners'

    );

    res.render('admin/banners',{

        banners

    });

};

exports.revenue = async (req,res)=>{

    const [revenue] = await db.query(

        'SELECT SUM(total_price) AS totalRevenue FROM orders'

    );

    res.render('admin/revenue',{

        totalRevenue: revenue[0].totalRevenue || 0

    });

};

exports.teacherApproval = async (req,res)=>{

    const [teachers] = await db.query(

        "SELECT * FROM users WHERE role='teacher'"

    );

    res.render('admin/teacherApproval',{

        teachers

    });

};

exports.deleteUser = async (req,res)=>{

    const id = req.params.id;

    await db.query(
        'DELETE FROM users WHERE id=?',
        [id]
    );

    res.redirect('/admin/users');

};

exports.blockUser = async (req,res)=>{

    const id = req.params.id;

    await db.query(
        "UPDATE users SET status='blocked' WHERE id=?",
        [id]
    );

    res.redirect('/admin/users');

};

exports.unblockUser = async (req,res)=>{

    const id = req.params.id;

    await db.query(
        "UPDATE users SET status='active' WHERE id=?",
        [id]
    );

    res.redirect('/admin/users');

};

exports.makeTeacher = async (req,res)=>{

    const id = req.params.id;

    await db.query(
        "UPDATE users SET role='teacher' WHERE id=?",
        [id]
    );

    res.redirect('/admin/users');

};
exports.teachers = async (req,res)=>{

    const [teachers] = await db.query(

        "SELECT * FROM users WHERE role='teacher'"

    );

    res.render('admin/teachers',{

        teachers

    });

};

exports.orders = async (req,res)=>{

    const [orders] = await db.query(

        'SELECT * FROM orders'

    );

    res.render('admin/orders',{

        orders

    });

};

exports.certificates = async (req,res)=>{

    const [certificates] = await db.query(

        'SELECT * FROM certificates'

    );

    res.render('admin/certificates',{

        certificates

    });

};

exports.banners = async (req,res)=>{

    const [banners] = await db.query(

        'SELECT * FROM banners'

    );

    res.render('admin/banners',{

        banners

    });

};

exports.revenue = async (req,res)=>{

    const [revenue] = await db.query(

        'SELECT SUM(total_price) AS totalRevenue FROM orders'

    );

    res.render('admin/revenue',{

        totalRevenue: revenue[0].totalRevenue || 0

    });

};

exports.teacherApproval = async (req,res)=>{

    const [teachers] = await db.query(

        "SELECT * FROM users WHERE role='teacher'"

    );

    res.render('admin/teacherApproval',{

        teachers

    });

};
// =====================
// DASHBOARD
// =====================
exports.dashboard = (req, res) => {
  res.send('Admin Dashboard');
};

// =====================
// DANH SÁCH KHÓA HỌC
// =====================
exports.courses = async (req, res) => {
  try {
    const [courses] = await db.query("SELECT * FROM courses");
    res.render('admin/courses', { courses });
  } catch (err) {
    console.log(err);
    res.send('Lỗi load khóa học');
  }
};

// =====================
// PAGE TẠO KHÓA HỌC
// =====================
exports.createCoursePage = (req, res) => {
  res.render('admin/create-course');
};

// khóa học chờ duyệt
exports.pendingCourses = async (req, res) => {
  const [courses] = await db.query(
    "SELECT * FROM courses WHERE status='pending'"
  );

  res.render('admin/pending-courses', { courses });
};

// duyệt khóa học
exports.approveCourse = async (req, res) => {
  await db.query(
    "UPDATE courses SET status='approved' WHERE id=?",
    [req.params.id]
  );

  res.redirect('/admin/pending-courses');
};

// duyệt giảng viên
exports.teacherApproval = async (req, res) => {
  const [users] = await db.query(
    "SELECT * FROM users WHERE teacher_request=1"
  );

  res.render('admin/teacher-approval', { users });
};

// duyệt giảng viên
exports.approveTeacher = async (req, res) => {
  await db.query(
    "UPDATE users SET role='teacher', teacher_request=0 WHERE id=?",
    [req.params.id]
  );

  res.redirect('/admin/teacher-approval');
};
