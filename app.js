const fs = require("fs");
const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");

const app = express();

// ================= CONFIG =================

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "brightacademy",
    resave: false,
    saveUninitialized: true
}));

// ✅ FIX TOÀN BỘ user + session cho EJS
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.session = req.session;
    next();
});

// ================= DATA =================

const DATA_FILE = "./data/courses.json";
const SKILL_FILE = "./data/skills.json";

function loadJSON(file) {
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
        return [];
    }
}

function saveJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

let courses = loadJSON(DATA_FILE);
let skills = loadJSON(SKILL_FILE);

// ================= DEFAULT DATA =================

if (skills.length === 0) {
    skills = [
        { _id: 1, title: "Cloud Practitioner", category: "Chứng chỉ AWS", content: "Giới thiệu AWS..." },
        { _id: 2, title: "ReactJS", category: "Phát triển web", content: "ReactJS là..." },
        { _id: 3, title: "Machine Learning", category: "Khoa học dữ liệu", content: "ML giúp..." }
    ];
    saveJSON(SKILL_FILE, skills);
}

if (courses.length === 0) {
    courses = [
        { _id: 1, title: "NodeJS Master", description: "Backend A-Z", image: "https://picsum.photos/500/300?1", price: 500000 },
        { _id: 2, title: "Python AI", description: "Machine Learning", image: "https://picsum.photos/500/300?2", price: 700000 },
        { _id: 3, title: "AWS Cloud", description: "Deploy DevOps", image: "https://picsum.photos/500/300?3", price: 900000 }
    ];
    saveJSON(DATA_FILE, courses);
}

// ================= UPLOAD =================

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/uploads"),
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// ================= AUTH =================

function checkAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === "admin") {
        next();
    } else {
        res.redirect("/admin/login");
    }
}

// ================= CART =================

// ✅ INIT CART
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
});

// ================= CLIENT =================

app.get("/", (req, res) => {
    res.render("client/index", { courses });
});

app.get("/account", (req, res) => {
    res.render("client/account");
});

app.get("/search", (req, res) => {
    const keyword = (req.query.keyword || "").toLowerCase();

    const results = courses.filter(c =>
        c.title.toLowerCase().includes(keyword)
    );

    res.render("client/search", { keyword, results });
});

app.get("/course/:id", (req, res) => {
    const course = courses.find(c => c._id == req.params.id);
    if (!course) return res.send("Không tìm thấy");

    res.render("client/course", { course });
});

app.get("/skill/:id", (req, res) => {
    const skill = skills.find(s => s._id == req.params.id);
    if (!skill) return res.send("Không tìm thấy");

    res.render("client/skill-detail", { skill });
});

// ================= CART =================

// ADD TO CART
app.get("/add-to-cart/:id", (req, res) => {
    const course = courses.find(c => c._id == req.params.id);
    if (!course) return res.redirect("/");

    req.session.cart.push(course);

    res.redirect("/cart");
});

// VIEW CART
app.get("/cart", (req, res) => {
    res.render("client/cart", {
        cart: req.session.cart
    });
});

// REMOVE ITEM
app.get("/remove-from-cart/:index", (req, res) => {
    req.session.cart.splice(req.params.index, 1);
    res.redirect("/cart");
});

// CHECKOUT
app.post("/checkout", (req, res) => {
    req.session.cart = [];

    res.send(`
        <div style="padding:50px;font-family:Arial">
            <h1>Thanh toán thành công 🎉</h1>
            <a href="/">Quay về trang chủ</a>
        </div>
    `);
});

// ================= REGISTER =================

app.get("/register", (req, res) => {
    res.render("client/register");
});

app.post("/register", (req, res) => {

    const { fullname, email } = req.body;

    req.session.user = {
        fullname,
        email,
        role: "user"
    };

    res.redirect("/account");
});

// ================= ADMIN =================

// LOGIN PAGE
app.get("/admin/login", (req, res) => {
    res.render("admin/login");
});

// LOGIN
app.post("/admin/login", (req, res) => {

    const { username, password } = req.body;

    if (username === "admin" && password === "123") {

        req.session.user = {
            fullname: "Admin Bright",
            email: "admin@bright.com",
            role: "admin"
        };

        res.redirect("/admin/dashboard");

    } else {
        res.send("Sai tài khoản");
    }
});

// DASHBOARD
app.get("/admin/dashboard", checkAdmin, (req, res) => {
    res.render("admin/dashboard", {
        courses,
        skills
    });
});

// ================= CRUD COURSE =================

app.get("/admin/new-course", checkAdmin, (req, res) => {
    res.render("admin/new-course");
});

app.post("/admin/new-course", checkAdmin, upload.single("image"), (req, res) => {

    const course = {
        _id: Date.now(),
        title: req.body.title,
        description: req.body.description,
        price: req.body.price || 0,
        image: req.file
            ? "/uploads/" + req.file.filename
            : "https://picsum.photos/500/300"
    };

    courses.push(course);
    saveJSON(DATA_FILE, courses);

    res.redirect("/admin/dashboard");
});

app.get("/admin/edit-course/:id", checkAdmin, (req, res) => {
    const course = courses.find(c => c._id == req.params.id);
    res.render("admin/edit-course", { course });
});

app.post("/admin/edit-course/:id", checkAdmin, upload.single("image"), (req, res) => {

    const course = courses.find(c => c._id == req.params.id);

    course.title = req.body.title;
    course.description = req.body.description;
    course.price = req.body.price || 0;

    if (req.file) {
        course.image = "/uploads/" + req.file.filename;
    }

    saveJSON(DATA_FILE, courses);

    res.redirect("/admin/dashboard");
});

app.get("/admin/delete-course/:id", checkAdmin, (req, res) => {
    courses = courses.filter(c => c._id != req.params.id);
    saveJSON(DATA_FILE, courses);
    res.redirect("/admin/dashboard");
});

// ================= LOGOUT =================

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

app.get("/admin/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

// ================= SERVER =================

app.listen(3000, "0.0.0.0", () => {
    console.log("🚀 Server running at http://localhost:3000");
});

