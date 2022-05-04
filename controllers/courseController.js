const conexion = require('../database/db');

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