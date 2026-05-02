const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

const courses = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, '../data/courses.json')
    )
);

router.get('/', (req, res) => {

    res.render('client/home', {
        courses
    });
});

router.get('/course/:id', (req, res) => {

    const course = courses.find(
        c => c.id == req.params.id
    );

    res.render('client/course-detail', {
        course
    });
});

router.post('/cart/add/:id', (req, res) => {

    const courseId = req.params.id;

    const existing = req.session.cart.find(
        item => item.courseId == courseId
    );

    if(existing){
        existing.quantity += 1;
    } else {
        req.session.cart.push({
            courseId,
            quantity: 1
        });
    }

    res.redirect('/cart');
});

router.get('/cart', (req, res) => {

    const cartItems = req.session.cart.map(item => {

        const course = courses.find(
            c => c.id == item.courseId
        );

        return {
            ...course,
            quantity: item.quantity,
            subtotal: course.price * item.quantity
        };
    });

    const total = cartItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
    );

    res.render('client/cart', {
        cartItems,
        total
    });
});

module.exports = router;
