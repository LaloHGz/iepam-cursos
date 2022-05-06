const jwt = require('jsonwebtoken');
const conexion = require('../database/db');
const {promisify} = require('util');

exports.list = (req, res) => {
    conexion.query('SELECT * FROM curso', (err, curso) => {
     if (err) {
      res.json(err);
     }
     res.render('curso', {
        data: curso
     });
    });
};

exports.save = (req, res) => {
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const imagen = req.body.imagen;


    if(!nombre || !descripcion | !imagen){
        res.redirect('/');
    }else{
        conexion.query('INSERT INTO curso set ?',{ id_usuario:2, nombre:nombre, num_lecciones:0, imagen:imagen, descripcion:descripcion}, (err, result)=>{    
            res.redirect('/');
        });
    }
      
};

exports.edit = (req, res) => {
    const {nombre} = req.params;
    const {id_curso} = req.params;
    const {descripcion} = req.params;

    conexion.query('SELECT * FROM leccion WHERE id_curso = ? ORDER BY num_leccion ASC',[id_curso],(err, lecciones)=>{
        res.render('course-edit-admin',{
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

exports.delete = (req, res) => {
    const {id_curso} = req.params;

    conexion.query('DELETE FROM curso WHERE id_curso = ?',[id_curso], (err, result)=>{
        res.redirect('/');
    });
}

exports.comments = (req, res) =>{
    const {id_leccion} = req.params;
    const {nombre} = req.params;
    conexion.query('SELECT * FROM comentario WHERE id_leccion = ?', [id_leccion], (err, comentarios)=>{
        res.render('comments-admin',{
            leccion:id_leccion,
            title:nombre,
            comments:comentarios
        });
    });
};

exports.deleteComment = (req, res)=>{
    const {id_leccion} = req.params;
    const {nombre} = req.params;
    const {id_comentario} = req.params;
    conexion.query('DELETE FROM comentario WHERE id_comentario = ?',[id_comentario], (err, result)=>{
        conexion.query('SELECT * FROM comentario WHERE id_leccion = ?', [id_leccion], (err, comentarios)=>{
            res.render('comments-admin',{
                leccion:id_leccion,
                title:nombre,
                comments:comentarios
            });
        });
    });
};

exports.deleteLesson = (req, res)=>{
    const {id_curso} = req.params;
    const {nombre} = req.params;
    const {descripcion} = req.params;
    const {id_leccion} = req.params;
    conexion.query('DELETE FROM leccion WHERE id_leccion = ?',[id_leccion], (err, result)=>{
        conexion.query('SELECT * FROM curso WHERE id_curso = ?',[id_curso],(err, curso)=>{
            conexion.query('UPDATE curso SET num_lecciones = ? WHERE id_curso = ?',[(curso[0].num_lecciones)-1, id_curso], (err, resul)=>{
                conexion.query('SELECT * FROM leccion WHERE id_curso = ? ORDER BY num_leccion ASC',[id_curso],(err, lecciones)=>{
                    res.render('course-edit-admin',{
                        leccion:lecciones,
                        data: id_curso,
                        title: nombre, 
                        descripcion: descripcion
                    });  
                });
            });
        });
    });
};

exports.addLesson = (req, res)=>{
    // Datos del form
    const nombre = req.body.nombre;
    const {id_curso} = req.params;
    const {num_lecciones} = req.params;
    const minutos = req.body.tiempo_minutos;
    const url = req.body.archivo_url;
    console.log(nombre);
    console.log(num_lecciones);
    console.log(minutos);
    console.log(url);

    if(!nombre || !num_lecciones || !minutos || !url){
        res.redirect('/');
    }else{
        conexion.query('INSERT INTO leccion SET ?',{id_curso:id_curso,nombre:nombre,tiempo_minutos:minutos,num_leccion:num_lecciones,archivo_url:url},(err, resul)=>{
            res.redirect('/');
        });
    }
};

exports.editLesson = (req, res)=>{
    const {id_leccion} = req.params;
    conexion.query('SELECT * FROM leccion WHERE id_leccion = ?',[id_leccion],(err, leccion)=>{
        res.render('lessonEditAdmin',{
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