const jwt = require('jsonwebtoken');
const conexion = require('../database/db');
const {promisify} = require('util');

exports.lessons = (req, res) => {
    const {id_curso} = req.params;
    const {num_leccion} = req.params;
    conexion.query('SELECT * FROM leccion WHERE id_curso = ? ORDER BY num_leccion ASC', [id_curso], (err, lecciones) =>{
        conexion.query('SELECT * FROM curso WHERE id_curso = ?', [id_curso], (err, curso)=>{
            res.render('course',{
                curso:curso,
                leccionavance:num_leccion,
                lecciones: lecciones 
            });
        });
    });
};


exports.comment = async(req, res)=>{
    try{
        const comment = req.body.comment;
        // Los parametros que recibe son de la ruta de /comment/id_curso/num_leccion
        const {id_curso} = req.params;
        const {num_leccion} = req.params;
        if(comment){
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            conexion.query('SELECT * FROM leccion WHERE id_curso = ? AND num_leccion = ?',[id_curso, num_leccion], (err, leccion) =>{
                conexion.query('INSERT INTO comentario SET ?', {id_usuario:decodificada.id,id_leccion:leccion[0].id_leccion,comentario:comment}, (err, comment) =>{                     
                    res.redirect('/course/'+id_curso+'/'+num_leccion);
                });
            });
        }else{
            res.redirect('/course/'+id_curso+'/'+num_leccion);
        }
    }catch(error){
        console.log(error);
    }
};

exports.avance = async(req, res)=>{
    try{
        // Los parametros que recibe son de la ruta de /comment/id_curso/num_leccion
        const {id_curso} = req.params;
        let {num_leccion} = req.params;

        const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
        conexion.query('SELECT * FROM avance WHERE id_usuario = ? AND id_curso = ?',[decodificada.id, id_curso], (err, avance) =>{
            if(avance.length != 0 ){
                // Verificar si la leccion actual es mayor a la de donde esta
                conexion.query('SELECT * FROM curso WHERE id_curso = ?',[id_curso],(err,curso)=>{
                    // Si el avance es mayor a la leccion que marcó como completada
                    if(avance[0].num_leccion > num_leccion){
                        num_leccion++;
                        res.redirect('/course/'+id_curso+'/'+num_leccion);
                    }else if(avance[0].num_leccion == num_leccion){
                        if(num_leccion < curso[0].num_lecciones){
                            num_leccion++;
                            res.redirect('/course/'+id_curso+'/'+num_leccion);
                        }else{
                            res.redirect('/');
                        }                        
                    }else{
                        conexion.query('UPDATE avance SET num_leccion = ? WHERE id_usuario = ? AND id_curso = ?', [num_leccion,decodificada.id,id_curso], (err, avance) =>{
                            if(num_leccion < curso[0].num_lecciones){
                                num_leccion++;
                                res.redirect('/course/'+id_curso+'/'+num_leccion);
                            }else{
                                res.redirect('/');
                            } 
                        });
                    }
                });
            }else{
                // Poner como avance el num_leccion actual
                conexion.query('INSERT INTO avance SET ?', {id_usuario:decodificada.id,id_curso:id_curso,num_leccion:num_leccion}, (err, avance) =>{                     
                    // Verificar que la leccion sea la ultima o no del curso, si es la ultima se manda al menu, si no se manda a la siguiente leccion del curso
                    conexion.query('SELECT * FROM curso WHERE id_curso = ?',[id_curso],(err,curso)=>{
                        if(num_leccion < curso[0].num_lecciones){
                            num_leccion++;
                            res.redirect('/course/'+id_curso+'/'+num_leccion);
                        }else{
                            // el curso solo tiene una leccion y es la que ha completado, por lo que se redirecciona al menu
                            res.redirect('/');
                        }
                    });
                });
            }
        });
    }catch(error){
        console.log(error);
    }
};


// controller.save = (req, res) => {
//     req.getConnection((err, conn) => {
//         const data = req.body;
//         conn.query('INSERT INTO customer set ?',[data], (err, customer) =>{
//             res.redirect('/');
//         });
//     });  
// };


// controller.update = (req, res) => {
//     const {id} = req.params;
//     const newCustomer = req.body;
//     req.getConnection((err, conn) => {
//         conn.query('UPDATE customer set ? WHERE id = ?', [newCustomer, id], (err, rows) => {
//             res.redirect('/');
//         });
//     });
// };


// controller.delete = (req, res) => {
//     req.getConnection((err,conn) =>{
//         const {id} = req.params;
//         conn.query('DELETE FROM customer WHERE id = ?', [id], (err, rows) =>{
//             res.redirect('/');
//         });
//     });
// };