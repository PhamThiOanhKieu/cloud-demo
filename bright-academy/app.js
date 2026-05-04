const express = require('express');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/client');
const teacherRoutes = require('./routes/teacher');
const adminRoutes = require('./routes/admin');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ✅ SESSION PHẢI ĐẶT TRƯỚC
app.use(session({
  secret: 'brightacademy',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// ✅ GLOBAL USER (CỰC KỲ QUAN TRỌNG)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ✅ ROUTES (đặt SAU session)
app.use('/', authRoutes);
app.use('/', clientRoutes);
app.use('/teacher', teacherRoutes);
app.use('/admin', adminRoutes);

app.listen(3000, () => {
  console.log('Server chạy tại http://localhost:3000');
});
