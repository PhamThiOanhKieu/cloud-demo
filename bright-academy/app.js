const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');
const clientRoutes = require('./routes/client');

const app = express();

// TRUST PROXY (quan trọng nếu chạy server)
app.set('trust proxy', 1);

// VIEW ENGINE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// STATIC + BODY
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// ✅ SESSION (QUAN TRỌNG NHẤT)
app.use(session({
  secret: 'brightacademy',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,      // phải false nếu dùng http
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// DEBUG SESSION
app.use((req, res, next) => {
  console.log("SESSION USER:", req.session.user);
  next();
});

// USER GLOBAL
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ROUTES (GIỮ NGUYÊN)
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/teacher', teacherRoutes);
app.use('/', clientRoutes);

// START SERVER
app.listen(3000, () => {
  console.log('Server chạy tại http://localhost:3000');
});
