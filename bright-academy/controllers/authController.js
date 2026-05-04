const db = require('../config/db');
const bcrypt = require('bcrypt');

// LOGIN PAGE
exports.showLogin = (req, res) => {
    res.render('auth/login');
};

// LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query(
            "SELECT * FROM users WHERE email=?",
            [email]
        );

        if (users.length === 0) {
            return res.send('Sai email hoặc mật khẩu');
        }

        const user = users[0];

        // ⚠️ nếu bạn CHƯA dùng bcrypt thì dùng tạm dòng dưới
        // const isMatch = password === user.password;

        // ✅ nếu có bcrypt thì dùng cái này
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send('Sai email hoặc mật khẩu');
        }

        // 🔥 QUAN TRỌNG: LƯU SESSION
        req.session.user = user;

        req.session.save(() => {

            // redirect theo role
            if (user.role === 'teacher') {
                return res.redirect('/dashboard'); // ❗ đã fix path
            }

            if (user.role === 'admin') {
                return res.redirect('/admin/dashboard');
            }

            return res.redirect('/');
        });

    } catch (err) {
        console.log(err);
        res.send('Lỗi server');
    }
};

// REGISTER PAGE
exports.showRegister = (req, res) => {
    res.render('auth/register');
};

// REGISTER

exports.register = async (req, res) => {
    try {
        console.log("REGISTER HIT");

        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.send('Thiếu dữ liệu');
        }

        // check email tồn tại
        const [results] = await db.query(
            "SELECT * FROM users WHERE email=?",
            [email]
        );

        if (results.length > 0) {
            return res.send('Email đã tồn tại');
        }

        // insert user
        await db.query(
            "INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, 'student')",
            [fullname, email, password]
        );

        // render thành công
        return res.render('auth/result', {
            message: 'Đăng ký thành công!',
            type: 'success',
            redirectUrl: '/login',
            buttonText: 'Đăng nhập'
        });

    } catch (err) {
        console.log("REGISTER ERROR:", err);
        return res.send('Lỗi server');
    }
};

// LOGOUT
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};
