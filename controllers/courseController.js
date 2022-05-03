const controller = {};
const conexion = require('../database/db');


controller.list = (req, res) => {
        conexion.query('SELECT * FROM curso', (err, availableCourses ) =>{
            if(err){
                res.json(err);
            }
            res.render('home-usuario',{
                data: availableCourses
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

// controller.edit = (req, res) => {
//     const {id} = req.params;
//     req.getConnection((err,conn) =>{
//         conn.query('SELECT * FROM customer WHERE id = ?', [id], (err, customer) =>{
//             res.render('customer_edit',{
//                 data: customer[0]
//             });
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

module.exports = controller;