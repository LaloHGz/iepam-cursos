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

exports.update = (req, res) => {
    const {id_curso} = req.params;
    const updateCourse = req.body;

    conexion.query('UPDATE curso set ? where id_curso = ?', [updateCourse, id_curso], (err, rows) => {
        res.redirect('/');
    });
};


exports.addLesson = (req, res)=>{
    // Datos del form
    const nombre = req.body.nombre;
    const {id_curso} = req.params;
    const {num_lecciones} = req.params;
    const minutos = req.body.tiempo_minutos;
    const url = req.body.archivo_url;

    if(!nombre || !num_lecciones || !minutos || !url){
        res.redirect('/');
    }else{
        conexion.query('INSERT INTO leccion SET ?',{id_curso:id_curso,nombre:nombre,tiempo_minutos:minutos,num_leccion:num_lecciones,archivo_url:url},(err, resul)=>{
            conexion.query('UPDATE curso SET num_lecciones = ? WHERE id_curso = ?',[num_lecciones, id_curso], (err, result)=>{
                res.redirect('/');
            });
        });
    }
};

exports.editLesson = (req, res)=>{
    const {id_leccion} = req.params;
    conexion.query('SELECT * FROM leccion WHERE id_leccion = ?',[id_leccion],(err, leccion)=>{
        res.render('lessonEditUser',{
            leccion:leccion
        });
    });
};

exports.updateLesson = (req, res)=>{
    const {id_leccion} = req.params;
    conexion.query('UPDATE leccion SET ? WHERE id_leccion = ?',[req.body, id_leccion], (err, result)=>{
        res.redirect('/');
    });
};

exports.comments = (req, res) =>{
    const {id_leccion} = req.params;
    const {nombre} = req.params;
    conexion.query('SELECT * FROM comentario WHERE id_leccion = ?', [id_leccion], (err, comentarios)=>{
        res.render('comments-user',{
            leccion:id_leccion,
            title:nombre,
            comments:comentarios
        });
    });
};