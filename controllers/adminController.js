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
    const {imagen} = req.params;
    res.render('course-edit-admin', {
        data: id_curso,
        title: nombre, 
        imagen: imagen,
    });  
};

exports.update = (req, res) => {
    const {id_curso} = req.params;
    const newCustomer = req.body;

    conexion.query('UPDATE curso set ? where id_curso = ?', [newCustomer, id_curso], (err, rows) => {
        res.redirect('/');
    });
};

exports.delete = (req, res) => {
    const {id_curso} = req.params;
    console.log("this is id -> " + id_curso);

    conexion.query('DELETE FROM curso WHERE id_curso = ?',[id_curso], (err, result)=>{
        res.redirect('/');
    });
}

exports.comments = (req, res) =>{
    const {id_curso} = req.params;
    
};