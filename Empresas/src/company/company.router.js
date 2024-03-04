import express from 'express'
import {registerCompany, updateCompany, listCompanies, generarExcelEmpresas} from './company.controller.js'
import { validateJwt, isAdmin} from '../middlewares/validate-jwt.js'



const api = express.Router()

api.post('/save', registerCompany)
api.put('/update/:id', [validateJwt, isAdmin],updateCompany)


api.get('/companies', [validateJwt, isAdmin], listCompanies);

api.get('/generate-report', generarExcelEmpresas);
export default api
