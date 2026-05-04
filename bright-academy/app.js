const express = require('express');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teacher');
const clientRoutes = require('./routes/client');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'brightacademy',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// dùng cho header (login/logout)
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// ROUTES
app.use('/', authRoutes);
app.use('/', clientRoutes);
app.use('/teacher', teacherRoutes);

app.listen(3000, () => {
    console.log('Server chạy tại http://localhost:3000');
});
