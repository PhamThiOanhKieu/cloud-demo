const db = require('../config/db');
const bcrypt = require('bcrypt');

// =====================
// LOGIN PAGE
// =====================
exports.loginPage = (req, res) => {
  res.render('auth/login');
};

// =====================
// LOGIN
// =====================
exports.login = async (req, res) => {
  console.log("LOGIN CONTROLLER HIT");

  const { email, password } = req.body;

  try {
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.render('auth/result', {
        message: 'Sai email hoặc mật khẩu!',
        type: 'error',
        redirectUrl: '/login',
        buttonText: 'Thử lại'
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render('auth/result', {
        message: 'Sai email hoặc mật khẩu!',
        type: 'error',
        redirectUrl: '/login',
        buttonText: 'Thử lại'
      });
    }

    // ✅ LƯU SESSION CHUẨN
req.session.user = {
  id: user.id,
  email: user.email,
  role: user.role,
  fullname: user.fullname
};
    // ✅ BẮT BUỘC save trước khi redirect
    req.session.save((err) => {
      if (err) {
        console.log(err);
        return res.send('Lỗi lưu session');
      }

      console.log("SESSION SAU LOGIN:", req.session.user);

      res.redirect('/');
    });

  } catch (err) {
    console.log(err);
    res.send('Lỗi server');
  }
};

// =====================
// REGISTER PAGE
// =====================
exports.registerPage = (req, res) => {
  res.render('auth/register');
};

// =====================
// REGISTER
// =====================
exports.register = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const [existing] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.render('auth/result', {
        message: 'Email đã tồn tại! Vui lòng đăng nhập.',
        type: 'error',
        redirectUrl: '/login',
        buttonText: 'Đăng nhập'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)',
      [fullname, email, hashedPassword, 'user']
    );

    return res.render('auth/result', {
      message: 'Đăng ký thành công!',
      type: 'success',
      redirectUrl: '/login',
      buttonText: 'Đăng nhập'
    });

  } catch (err) {
    console.log(err);
    res.send('Lỗi server');
  }
};

// =====================
// LOGOUT
// =====================
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
