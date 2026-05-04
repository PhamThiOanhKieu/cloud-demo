const db = require('../config/db');

// ===== 1. DASHBOARD (Tổng quan) =====
exports.dashboard = (req, res) => {
    const teacherId = req.session.user.id;

    // Truy vấn lấy tổng số khóa học và tổng doanh thu (giả định có bảng orders)
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM courses WHERE teacher_id = ?) AS totalCourses,
            (SELECT COUNT(*) FROM orders o JOIN courses c ON o.course_id = c.id WHERE c.teacher_id = ?) AS totalStudents,
            (SELECT SUM(price) FROM orders o JOIN courses c ON o.course_id = c.id WHERE c.teacher_id = ?) AS totalRevenue
    `;

    db.query(sql, [teacherId, teacherId, teacherId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Lỗi hệ thống');
        }
        res.render('teacher/dashboard', {
            stats: results[0],
            user: req.session.user
        });
    });
};

// ===== 2. KHÓA HỌC CỦA TÔI (Danh sách) =====
exports.myCourses = (req, res) => {
    const teacherId = req.session.user.id;
    const sql = "SELECT * FROM courses WHERE teacher_id = ?";

    db.query(sql, [teacherId], (err, results) => {
        if (err) throw err;
        res.render('teacher/my-courses', { courses: results });
    });
};

// ===== 3. TẠO KHÓA HỌC (Hiển thị Form) =====
exports.showCreateCourse = (req, res) => {
    res.render('teacher/create-course');
};

// ===== 4. TẠO KHÓA HỌC (Xử lý lưu vào DB) =====
exports.createCourse = (req, res) => {
    const { title, description, price, category } = req.body;
    const teacherId = req.session.user.id;

    const sql = "INSERT INTO courses (title, description, price, category, teacher_id) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [title, description, price, category, teacherId], (err, result) => {
        if (err) {
            console.error(err);
            return res.send('Không thể tạo khóa học');
        }
        res.redirect('/teacher/my-courses');
    });
};

// ===== 5. HỌC VIÊN (Danh sách học viên đã mua khóa học) =====
exports.students = (req, res) => {
    const teacherId = req.session.user.id;
    const sql = `
        SELECT u.fullname, u.email, c.title AS courseName, o.created_at
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN courses c ON o.course_id = c.id
        WHERE c.teacher_id = ?
    `;

    db.query(sql, [teacherId], (err, results) => {
        if (err) throw err;
        res.render('teacher/students', { students: results });
    });
};

// ===== 6. DOANH THU =====
exports.revenue = (req, res) => {
    const teacherId = req.session.user.id;
    const sql = `
        SELECT SUM(price) as dailyRevenue, DATE(created_at) as date
        FROM orders o
        JOIN courses c ON o.course_id = c.id
        WHERE c.teacher_id = ?
        GROUP BY DATE(created_at)
    `;

    db.query(sql, [teacherId], (err, results) => {
        if (err) throw err;
        res.render('teacher/revenue', { revenueData: results });
    });
};

// ===== 7. ĐĂNG KÝ GIẢNG VIÊN (Nếu cần) =====
exports.showBecomeTeacher = (req, res) => {
    res.render('teacher/become-teacher');
};

exports.becomeTeacher = (req, res) => {
    const userId = req.session.user.id;
    const sql = "UPDATE users SET role = 'teacher' WHERE id = ?";
    db.query(sql, [userId], (err, result) => {
        if (err) throw err;
        req.session.user.role = 'teacher'; // Cập nhật session ngay lập tức
        res.redirect('/teacher/dashboard');
    });
};
