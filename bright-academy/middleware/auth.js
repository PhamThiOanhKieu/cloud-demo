exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.send('Không có quyền truy cập');
  }
};

exports.isTeacher = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'teacher') {
    next();
  } else {
    res.send('Chỉ giảng viên mới truy cập');
  }
};
