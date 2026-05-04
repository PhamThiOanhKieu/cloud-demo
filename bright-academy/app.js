const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teacher');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ✅ SESSION (CHUẨN)
app.use(session({
    secret: 'brightacademy',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// ✅ DEBUG SESSION
app.use((req, res, next) => {
    console.log("SESSION USER:", req.session.user);
    res.locals.user = req.session.user || null;
    next();
});

// ROUTES
app.use('/', authRoutes);
app.use('/teacher', teacherRoutes);

// HOME
app.get('/', (req, res) => {
    res.render('client/home');
});

app.listen(3000, () => {
    console.log('Server chạy tại http://localhost:3000');
});
