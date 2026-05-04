const db = require('../config/db');

exports.dashboard = async(req,res)=>{

    const [courses] = await db.query(

        'SELECT * FROM courses'

    );

    const [users] = await db.query(

        "SELECT * FROM users WHERE role='student'"

    );

    const [teachers] = await db.query(

        "SELECT * FROM users WHERE role='teacher'"

    );

    res.render('admin/dashboard',{

        totalUsers:users.length,

        totalCourses:courses.length,

        totalOrders:18,

        totalRevenue:85000000,

        totalTeachers:teachers.length

    });

};

exports.courses = async(req,res)=>{

    const [courses] = await db.query(

        `SELECT courses.*,
        users.fullname AS teacher_name
        FROM courses
        LEFT JOIN users
        ON courses.teacher_id = users.id`

    );

    res.render('admin/courses',{

        courses

    });

};

exports.showCreateCourse = async(req,res)=>{

    const [teachers] = await db.query(

        "SELECT * FROM users WHERE role='teacher'"

    );

    res.render('admin/create-course',{

        teachers

    });

};

exports.createCourse = async(req,res)=>{

    try{

        const {

            title,

            description,

            price,

            teacher_id

        } = req.body;

        await db.query(

            `INSERT INTO courses
            (
                title,
                description,
                price,
                teacher_id
            )
            VALUES(?,?,?,?)`,

            [

                title,

                description,

                price,

                teacher_id

            ]

        );

        res.redirect('/admin/courses');

    }catch(error){

        console.log(error);

        res.send('Lỗi tạo khóa học');

    }

};

exports.showEditCourse = async(req,res)=>{

    const id = req.params.id;

    const [courses] = await db.query(

        'SELECT * FROM courses WHERE id=?',

        [id]

    );

    res.render('admin/editCourse',{

        course:courses[0]

    });

};

exports.updateCourse = async(req,res)=>{

    const id = req.params.id;

    const {

        title,

        description,

        price

    } = req.body;

    await db.query(

        `UPDATE courses
        SET
        title=?,
        description=?,
        price=?
        WHERE id=?`,

        [

            title,

            description,

            price,

            id

        ]

    );

    res.redirect('/admin/courses');

};

exports.deleteCourse = async(req,res)=>{

    const id = req.params.id;

    await db.query(

        'DELETE FROM courses WHERE id=?',

        [id]

    );

    res.redirect('/admin/courses');

};

exports.users = async(req,res)=>{

    const [users] = await db.query(

        "SELECT * FROM users WHERE role='student'"

    );

    res.render('admin/users',{

        users

    });

};

exports.teacherApproval = async (req, res) => {
  const db = require('../config/db');

  try {
    // lấy user đang xin làm giảng viên
    const [users] = await db.query(
      "SELECT * FROM users WHERE teacher_request = 1"
    );

    res.render('admin/teacher-approval', { users: requests});

  } catch (err) {
    console.log(err);
    res.send('Lỗi load danh sách giảng viên');
  }
};
exports.approveTeacher = async (req, res) => {
  const db = require('../config/db');

  const userId = req.params.id;

  await db.query(
    "UPDATE users SET role='teacher', teacher_request=0 WHERE id=?",
    [userId]
  );

  res.redirect('/admin/teacher-approval');
};
exports.orders = (req,res)=>{

    const orders = [

        {

            id:1,

            student:'Nguyễn Văn A',

            course:'AWS Cloud',

            total:1200000,

            status:'Đã thanh toán'

        },

        {

            id:2,

            student:'Trần Thị B',

            course:'Docker Master',

            total:950000,

            status:'Đã thanh toán'

        }

    ];

    res.render('admin/orders',{

        orders

    });

};

exports.certificates = (req,res)=>{

    const certificates = [

        {

            student:'Nguyễn Văn A',

            course:'AWS Cloud',

            date:'2026-05-01'

        },

        {

            student:'Trần Thị B',

            course:'Docker Master',

            date:'2026-05-02'

        }

    ];

    res.render('admin/certificates',{

        certificates

    });

};

exports.banners = (req,res)=>{

    const banners = [

        {

            title:'Khuyến mãi Cloud',

            image:'/images/banner1.jpg'

        },

        {

            title:'Giảm giá DevOps',

            image:'/images/banner2.jpg'

        }

    ];

    res.render('admin/banners',{

        banners

    });

};

exports.revenue = (req,res)=>{

    const revenues = [

        {

            month:'Tháng 1',

            total:15000000

        },

        {

            month:'Tháng 2',

            total:23000000

        },

        {

            month:'Tháng 3',

            total:47000000

        }

    ];

    res.render('admin/revenue',{

        revenues

    });

};

exports.teachers = async (req, res) => {
    try {
        const [teachers] = await db.query(
            "SELECT * FROM users WHERE role='teacher'"
        );

        res.render('admin/teachers', { teachers });

    } catch (err) {
        console.log(err);
        res.send('Lỗi load giảng viên');
    }
};

exports.teacherApproval = async (req, res) => {
    try {
        const [requests] = await db.query(
            `SELECT teacher_requests.*,
                    users.fullname,
                    users.email
             FROM teacher_requests
             LEFT JOIN users
             ON teacher_requests.user_id = users.id`
        );

        res.render('admin/teacher-approval', {
            requests
        });

    } catch (error) {
        console.log(error);
        res.send('Lỗi load danh sách giảng viên');
    }
};
exports.approveTeacher = async (req, res) => {
    try {
        const id = req.params.id;

        const [requests] = await db.query(
            'SELECT * FROM teacher_requests WHERE id=?',
            [id]
        );

        if (requests.length === 0) {
            return res.send('Không tìm thấy yêu cầu');
        }

        const userId = requests[0].user_id;

        await db.query(
            "UPDATE users SET role='teacher' WHERE id=?",
            [userId]
        );

        await db.query(
            "UPDATE teacher_requests SET status='approved' WHERE id=?",
            [id]
        );

        res.redirect('/admin/teacher-approval');

    } catch (error) {
        console.log(error);
        res.send('Lỗi duyệt giảng viên');
    }
};
