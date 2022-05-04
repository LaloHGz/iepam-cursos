const express = require('express');
const router = express.Router();

const authController = require('../controllers/authControllers');
const courseController = require('../controllers/courseController');

// router para las vistas

router.get('/', authController.isAuthenticated, (req, res)=>{
    if(req.user.rol == "admin"){
        res.render('index', {user:req.user, data: req.courses});
    }else if(req.user.rol == "usuario"){
        res.render('home-usuario', {user:req.user, course:req.courses, avance:req.avance, leccion:req.lecciones});
    }
});

router.get('/login', (req, res)=>{
    res.render('login', {alert:false});
});

router.get('/register', (req, res)=>{
    res.render('register',{alert:false});
});



// router para los métodos del controller
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/course/:id_curso/:num_leccion', courseController.lessons);

module.exports = router;