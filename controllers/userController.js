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
    conexion.query('SELECT * FROM curso WHERE id_curso = ?',[id_usuario], (err, cursos) => {
        if (err) {
         res.json(err);
        }
        res.render('uploadCoursesUser', {
           curso: cursos
        });
    });
};