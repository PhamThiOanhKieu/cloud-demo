function isTeacher(req, res, next){

    if(
        req.session.user &&
        req.session.user.role === 'teacher'
    ){
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = isTeacher;
