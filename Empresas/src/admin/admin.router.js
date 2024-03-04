import express from 'express'

import { testing, login, registerAdmin, update, deleteAdmin} from './admin.controller.js'

import {validateJwt, isAdmin} from '../middlewares/validate-jwt.js'

const api = express.Router()

// Registrar un administrador
api.post('/save',registerAdmin )
api.post('/login', login)

api.get('/test', [validateJwt, isAdmin], testing)
api.put('/update/:id', [validateJwt],update)
api.delete('/delete/:id',[validateJwt], deleteAdmin)

export default api