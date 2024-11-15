import Student from "..models/Student.js";
import bcrypt from 'bcryptjs'
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";


//vamos a definir aquí la logica del login del usuario

//Logica para el registro de nuevos usuarios

const register = async(req,res) =>{
    
    //Accedemos a los datos pasados por el nuevo usuario que se quiere registrar
    const {nombre,password,curso,niveles} = req.body;

    try{
        
        //Buscamos si el usuario esta ya registrado
        const userFound = await Student.findOne({nombre});
        if(userFound)
            return res.status(400).json(['El nombre ya está en uso'])
        
        //La contraseña que ha introducido la hasheamos para encriptarla
        const passwordHash = await bcrypt.hash(password,10);

        //Creamos el nuevo estudiante con los datos pasados
        const newStudent = new Student({nombre,password:passwordHash,curso,niveles})
        
        //Guardamos el nuevo usuario
        const userSaved = await newUser.save();

        //Generamos un Token de sesion para el usuario guardado
        const token = await createAccessToken({id:userSaved._id});

        //Como respuesta a la peticion le enviamos el Token como cookie
        res.cookie('token',token);

        //Enviamos un json de respuesta con el id el nombre y datos de creacion
        res.json({
            id: userSaved._id,
            nombre: userSaved.nombre,
            createdAt: userSaved.createdAt,
            updateAt: userSaved.updatedAt,

        });
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

export const login = async(req,res) => {

    const {nombre,password} = req.body;

    const student = await Student.findOne({nombre});
    if(!student)
        return res.status(400).json({error : 'Credenciales inválidas'});

    //Comparamos las contraseñas
    const isPasswordValid = await bcrypt.compare(password,student.password);

    if(!isPasswordValid)
        return res.status(400).json({error: 'Credenciales inválidas'});

    const token = jwt.sign({nombre:user.nombre},process.env.JWT_SECRET,{expiresIn: '1h',});

    res.json({message: 'Login exitoso', token});


};

export const verifyToken = async(req,res)=>{
    const {token} = req.cookies;
    if (!token)
        return res.status(401).json({message: "Unauthorized"});

    jwt.verify(token, TOKEN_SECRET, async (err,student)=>{
        if(err)
            return res.status(401).json({message:'Unauthorized'});

        const studentFound = await Student.findById(student.nombre);

        if(!studentFound) 
            return res.status(401).json({message: "Unauthorized" });

        return res.json({
            nombre: userFound.nombre
        })
    })
}