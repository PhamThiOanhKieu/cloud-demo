const express = require('express');

const session = require('express-session');

const path = require('path');

const authRoutes = require('./routes/auth');

const adminRoutes = require('./routes/admin');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended:true }));

app.use(express.static('public'));

app.use(session({

    secret:'brightacademy',

    resave:false,

    saveUninitialized:false

}));

app.use((req,res,next)=>{

    res.locals.user = req.session.user || null;

    next();

});

app.use('/',authRoutes);

app.use('/',adminRoutes);

app.get('/',(req,res)=>{

    res.render('client/home');

});

app.listen(3000,()=>{

    console.log('Server running');

});
