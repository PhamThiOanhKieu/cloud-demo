const fs = require('fs');
const path = require('path');

// đọc file JSON
const getCourses = () => {
  const filePath = path.join(__dirname, '../data/courses.json');

  if (!fs.existsSync(filePath)) return [];

  const data = fs.readFileSync(filePath, 'utf-8');
  return data ? JSON.parse(data) : [];
};

// =====================
// TRANG CHỦ
// =====================
exports.home = (req, res) => {
  const courses = getCourses();

  res.render('client/home', { courses });
};

// =====================
// CHI TIẾT KHÓA HỌC
// =====================
exports.courseDetail = (req, res) => {
  const courses = getCourses();
  const course = courses.find(c => c.id == req.params.id);

  if (!course) {
    return res.send('Không tìm thấy khóa học');
  }

  res.render('client/course-detail', { course });
};

// =====================
// THÊM GIỎ HÀNG
// =====================
exports.addToCart = (req, res) => {
  const courseId = req.params.id;

  if (!req.session.cart) req.session.cart = [];

  const existing = req.session.cart.find(item => item.courseId == courseId);

  if (existing) {
    existing.quantity += 1;
  } else {
    req.session.cart.push({ courseId, quantity: 1 });
  }

  res.redirect('/cart');
};

// =====================
// XEM GIỎ HÀNG
// =====================
exports.viewCart = (req, res) => {
  const courses = getCourses();

  if (!req.session.cart) req.session.cart = [];

  const cartItems = req.session.cart.map(item => {
    const course = courses.find(c => c.id == item.courseId);

    return {
      ...course,
      quantity: item.quantity,
      subtotal: course.price * item.quantity
    };
  });

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  res.render('client/cart', { cartItems, total });
};
