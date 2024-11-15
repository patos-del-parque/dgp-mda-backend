import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from "../config.js";

//Función para creacion del Token
export function createAccessToken(payload){
    return new Promise((resolve,reject)=>{
        jwt.sign(
            payload,
            TOKEN_SECRET,
            {
                expiresIn:"1d",
            },
            (err,token)=>{
                if(err)
                    reject(err);
                else 
                    resolve(token);
            }
            );
    })
}

//la funcion jwt.sing funciona de la siguiente forma
//En primer lugar va a devolver una Promesa
//un objeto en js que representa el resultado de una operacion
//asincrona, sirve para manejar tareas que toman tiempo

//Los parametros que le tienes que dar
//payload-> objeto JSON que contiene los datos a incluir en el token, puede ser el id del user o un rol
//TokenSecret secreto para el HMAC algoritmo (FR)
//expiresIn-> tiempo que el token va a ser valido 1 dia
//finalmente se devuelve un callback donde se rechaza la promesa si da error
//o se resuelve si va todo bien
//lo de decir que devuelva una promesa y que luego dentro sea un callback
//parece ser una practica usual en JS para poder trabjar con async await comodamente
//Esta pensado para algoritmo de claves asincrono si fuese sincrono solo devuelves promesa sin tratamiento de fallos
