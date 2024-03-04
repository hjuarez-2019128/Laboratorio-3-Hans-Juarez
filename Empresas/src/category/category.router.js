import express  from "express";

import {aggregate, updateCompany}from './category.cotroller.js'

const api = express.Router()

api.post('/register',aggregate)
api.put('/updates/:id',updateCompany)

export default api