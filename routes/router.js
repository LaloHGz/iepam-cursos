const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

const authController = require('../controllers/authControllers');
const courseController = require('../controllers/courseController');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');

// router para las vistas

router.get('/', authController.isAuthenticated, (req, res)=>{
    if(req.user.rol == "admin"){
        res.render('home-admin', {user:req.user, curso: req.courses});
    }else if(req.user.rol == "usuario"){
        res.render('home-user', {user:req.user, curso:req.courses, avance:req.avance, leccion:req.lecciones, active:"menu"});
    }
});

router.get('/login', (req, res)=>{
    res.render('login', {alert:false});
});

router.get('/register', (req, res)=>{
    res.render('register',{alert:false});
});

router.get('/juego', (req,res)=>{
    res.render('juego');
});

//Ambiente de Usuario

// router para los métodos del controller
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/course/:id_curso/:num_leccion', courseController.lessons);
router.post('/comment/:id_curso/:num_leccion', courseController.comment);
router.post('/avance/:id_curso/:num_leccion', courseController.avance);
router.get('/profile-user/:id_usuario', userController.profile);



// Ambiente de Admin
// Cursos
router.post('/add', adminController.save);
router.get('/update/:id_curso/:nombre/:descripcion', adminController.edit);
router.post('/update/:id_curso', adminController.update);
router.get('/delete/:id_curso', adminController.delete);
// Comentarios
router.get('/comments/:id_leccion/:nombre', adminController.comments);
router.get('/delete/:id_leccion/:nombre/:id_comentario', adminController.deleteComment);
// Lecciones
router.get('/delete/:id_curso/:nombre/:descripcion/:id_leccion', adminController.deleteLesson);
router.post('/addLesson/:id_curso/:num_lecciones', adminController.addLesson);
router.get('/update/:id_leccion', adminController.editLesson);

module.exports = router;