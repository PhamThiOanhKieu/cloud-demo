const db = require('../db');

const bcrypt = require('bcrypt');

exports.loginPage = (req,res)=>{

    res.render('auth/login');

};

exports.login = async (req,res)=>{

    const { email,password } = req.body;

    const [users] = await db.query(

        'SELECT * FROM users WHERE email=?',

        [email]

    );

    if(users.length === 0){

        return res.send('Sai email');

    }

    const user = users[0];

    const match = await bcrypt.compare(

        password,

        user.password

    );

    if(!match){

        return res.send('Sai mật khẩu');

    }

    req.session.user = {

        id: user.id,

        fullname: user.fullname,

        email: user.email,

        role: user.role

    };

    req.session.save(()=>{

        if(user.role === 'admin'){

            return res.redirect('/admin');

        }

        res.redirect('/');

    });

};

exports.logout = (req,res)=>{

    req.session.destroy(()=>{

        res.redirect('/login');

    });

};