const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');
const {promisify} = require('util');

// procedimiento para registrar usuarios
exports.register = async(req, res)=>{
    try{
        const email = req.body.email;
        const user = req.body.user;
        const pass = req.body.password;
        //let passHash = await bcryptjs.hash(pass,8);
        // console.log(passHash);

        if(!email || !user || !pass){
            res.render('register',{
                alert: true,
                alertTitle: 'Advertencia',
                alertMessage: 'Por favor rellena todos los campos',
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'register'
            });
        }else{
            conexion.query('SELECT * FROM usuario WHERE correo = ?',[email], async(error, results)=>{
                if(results.length != 0){
                    res.render('register',{
                        alert: true,
                        alertTitle: 'Error',
                        alertMessage: 'Usuario ya registrado',
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'register'
                    });
                }else{
                    let passHash = await bcryptjs.hash(pass,8);
                    // console.log(passHash);
                    conexion.query('INSERT INTO usuario SET ?', {nombre:user, correo:email, contrasena: passHash, rol: "usuario", foto:"https://cdn-icons-png.flaticon.com/512/456/456283.png"}, (err, results)=>{
                        if(err){
                            console.log(err);
                        }
                        //res.redirect('/');
                    });
                    conexion.query('SELECT * FROM usuario WHERE correo = ?',[email], async(err, resul)=>{
                        // registro OK
                        const id = resul[0].id_usuario;
                        const token = jwt.sign({id:id}, process.env.JWT_SECRETO,{
                            expiresIn: process.env.JWT_TIEMPO_EXPIRA
                        });
                        
                        const cookiesOptions = {
                            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                            httpOnly: true
                        };
                        res.cookie('jwt', token, cookiesOptions);
                        res.render('register',{
                            alert: true,
                            alertTitle: 'Bienvenido',
                            alertMessage: 'Inicio de sesión exitoso',
                            alertIcon: 'success',
                            showConfirmButton: true,
                            timer: 800,
                            ruta: ''
                        });
                    });
                }
            });        
        }
    }catch(error){
        console.log(error);
    }
};

exports.login = async(req, res)=>{
    try{
        const email = req.body.email;
        const pass = req.body.password;
        if(!email || !pass){
            res.render('login',{
                alert: true,
                alertTitle: 'Advertencia',
                alertMessage: 'Por favor ingrese un usuario y contraseña',
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            });
        }else{
            conexion.query('SELECT * FROM usuario WHERE correo = ?',[email], async(err, results)=>{
                if(results.length == 0 || ! (await bcryptjs.compare(pass, results[0].contrasena))){
                    res.render('login',{
                        alert: true,
                        alertTitle: 'Error',
                        alertMessage: 'Usuario o contraseña incorrectos',
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
                }else{
                    // inicio de sesión OK
                    const id = results[0].id_usuario;
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO,{
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    });
                    // console.log("TOKEN: "+token+" para el usuario "+ email);
                    
                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    };
                    res.cookie('jwt', token, cookiesOptions);
                    res.render('login',{
                        alert: true,
                        alertTitle: 'Bienvenido',
                        alertMessage: 'Inicio de sesión exitoso',
                        alertIcon: 'success',
                        showConfirmButton: true,
                        timer: 800,
                        ruta: ''
                    });
                }
            });
        }
    }catch(error) {
        console.log(error);
    }
};

exports.isAuthenticated = async(req, res, next)=>{
    if(req.cookies.jwt){
        try{
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            conexion.query('SELECT * FROM usuario WHERE id_usuario = ?',[decodificada.id], (err, results)=>{
                if(!results){return next();}
                conexion.query('SELECT * FROM curso', (err, availableCourses ) =>{
                    conexion.query('SELECT * FROM avance WHERE id_usuario = ?',[decodificada.id], (err, avances)=>{
                        conexion.query('SELECT * leccion WHERE num_leccion = 1',(err, lecciones)=>{
                            req.user = results[0];
                            req.courses = availableCourses;
                            console.log(avances);
                            req.avance = avances;
                            req.lecciones = lecciones;
                            return next();
                        });
                    });
                });
            });
        }catch(error){
            console.log(error);
            return next();
        }
    }else{
        res.redirect('/login');
    }    
};



exports.logout = (req, res)=>{
    res.clearCookie('jwt');
    return res.redirect('/');
};