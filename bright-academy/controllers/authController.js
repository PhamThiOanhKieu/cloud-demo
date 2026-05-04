const db = require('../config/db');

// ===== LOGIN =====
exports.showLogin = (req, res) => {
    res.render('auth/login');
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=? AND password=?",
        [email, password],
        (err, results) => {

            if (err) return res.send('Lỗi DB');

            if (results.length === 0) {
                return res.send('Sai tài khoản hoặc mật khẩu');
            }

            const user = results[0];

            req.session.user = user;

            console.log("LOGIN OK:", user);

            if (user.role === 'admin') return res.redirect('/admin');
            if (user.role === 'teacher') return res.redirect('/teacher/dashboard');

            return res.redirect('/');
        }
    );
};

// ===== REGISTER =====
exports.showRegister = (req, res) => {
    res.render('auth/register');
};

exports.register = (req, res) => {

    const { fullname, email, password } = req.body;

    db.query(
        "INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, 'student')",
        [fullname, email, password],
        (err) => {

            if (err) {
                console.log(err);
                return res.send('Email đã tồn tại');
            }

            res.redirect('/login');
        }
    );
};

// ===== LOGOUT =====
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};
// ===== REGISTER =====
exports.showRegister = (req, res) => {
    res.render('auth/register');
};

exports.register = (req, res) => {

    const { fullname, email, password } = req.body;

    db.query(
        "INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, 'student')",
        [fullname, email, password],
        (err) => {

            if (err) {
                console.log(err);
                return res.send('Email đã tồn tại');
            }

            res.redirect('/login');
        }
    );
};
