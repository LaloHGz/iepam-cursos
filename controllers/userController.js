const jwt = require('jsonwebtoken');
const conexion = require('../database/db');
const {promisify} = require('util');

exports.profile = async(req, res)=>{
    try{
        const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
        conexion.query('SELECT * FROM usuario WHERE id_usuario = ?',[decodificada.id], (err, usuario)=>{
            conexion.query('SELECT * FROM curso ORDER BY id_curso ASC', (err, cursos)=>{
                conexion.query('SELECT * FROM avance WHERE id_usuario = ? ORDER BY id_curso ASC', [decodificada.id], (err, avances)=>{
                    res.render('profile-user',{
                        user:usuario[0],
                        curso:cursos,
                        avance: avances,
                        active: "perfil" 
                    });
                });
            });
        });
    }catch(error){
        console.log(error);
    }
};

exports.uploadCourses = (req, res)=>{
    const {id_usuario} = req.params;
    conexion.query('SELECT * FROM curso WHERE id_usuario = ?',[id_usuario], (err, cursos) => {
        if (err) {
         res.json(err);
        }
        res.render('uploadCoursesUser', {
           curso: cursos,
           usuario: id_usuario
        });
    });
};

exports.addCourseUser = (req, res)=>{
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const imagen = req.body.imagen;
    const {id_usuario} = req.params;

    if(!nombre || !descripcion | !imagen){
        conexion.query('SELECT * FROM curso WHERE id_usuario = ?',[id_usuario], (err, cursos) => {
            if (err) {
             res.json(err);
            }
            res.render('uploadCoursesUser', {
               curso: cursos,
               usuario: id_usuario
            });
        });
    }else{
        conexion.query('INSERT INTO curso set ?',{ id_usuario:id_usuario, nombre:nombre, num_lecciones:0, imagen:imagen, descripcion:descripcion}, (err, result)=>{    
            conexion.query('SELECT * FROM curso WHERE id_usuario = ?',[id_usuario], (err, cursos) => {
                if (err) {
                 res.json(err);
                }
                res.render('uploadCoursesUser', {
                   curso: cursos,
                   usuario: id_usuario
                });
            });
        });
    }
};

exports.edit = (req, res) => {
    const {nombre} = req.params;
    const {id_curso} = req.params;
    const {descripcion} = req.params;

    conexion.query('SELECT * FROM leccion WHERE id_curso = ? ORDER BY num_leccion ASC',[id_curso],(err, lecciones)=>{
        res.render('course-edit-user',{
            leccion:lecciones,
            data: id_curso,
            title: nombre, 
            descripcion: descripcion
        });  
    });

};