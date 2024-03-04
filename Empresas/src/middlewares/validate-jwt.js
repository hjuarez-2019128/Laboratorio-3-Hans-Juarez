'use strict'

import jwt from 'jsonwebtoken'

import Admin from '../admin/admin.model.js'

export const validateJwt = async(req, res, next)=>{
    try{
        //Obtener la llave de acceso al token
        let secretKey = process.env.SECRET_KEY
        //obtener el token de los headers
        let { token } = req.headers
        //Verificar si viene el token
        if(!token) return res.status(401).send({message: 'Unauthorized'})
        //Obtener el uid del usuario que envió el token
        let { uid } = jwt.verify(token, secretKey)
        //Validar si aún existe en la BD
       let admin = await Admin.findOne({_id: uid})
        if(!admin) return res.status(404).send({message: 'User not found - Unauthorized'})
        req.admin = admin
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalid token'})
    }
}

export const isAdmin = async(req, res, next)=>{
    try{
        let { admin } = req
        if(!admin || admin.role !== 'ADMIN') return res.status(403).send({message: `You dont have access | username: ${admin.username}`})
        next()
    }catch(err){
        console.error(err)
        return res.status(403).send({message: 'Unauthorized role'})
    }
}

export const validateListCompanies = async (req, res, next) => {
    try {
        const { sortBy, sortOrder, filterByYears, filterByCategory } = req.query;

        // Construir el filtro de búsqueda
        req.filter = {};
        if (filterByYears) {
            req.filter.yearsOfExperience = { $gte: parseInt(filterByYears) };
        }
        if (filterByCategory) {
            req.filter.category = filterByCategory;
        }

        // Definir el orden de clasificación
        req.sort = {};
        if (sortBy) {
            if (sortBy === 'name' || sortBy === 'yearsOfExperience') {
                req.sort[sortBy] = sortOrder === 'desc' ? -1 : 1; // Ordenar por nombre o años de experiencia
            }
        }

        next();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error en la validación de listado de empresas', error: err });
    }
};
