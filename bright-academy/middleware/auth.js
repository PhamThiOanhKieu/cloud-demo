exports.isAdmin = (req,res,next)=>{

    if(

        req.session.user &&

        req.session.user.role === 'admin'

    ){

        next();

    } else {

        res.send('KHÔNG CÓ QUYỀN TRUY CẬP');

    }

};