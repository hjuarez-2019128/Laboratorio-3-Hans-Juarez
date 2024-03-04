import { writeFile } from 'fs/promises';
import * as xlsx from 'xlsx';

import Company from './company.model.js'
import {checkUpdate} from '../utils/validator.js'
import Category from '../category/category.model.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}




export const registerCompany = async (req, res) => {
    try {
        // Capturar la data
        let data = req.body;
        // Validar que el Usuario Exista
        let category = await Category.findOne({ _id: data.category });
        if (!category) return res.status(404).send({ message: 'category not found' });
        // Crear la instancia de la 'company'
        let company = new Company(data);
        // Guardar la company
        await company.save();
        // Responder si todo sale bien
        return res.send({ message: 'Company saved successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error saving company' });
    }
};

export const updateCompany = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;

        let update = checkUpdate(data, id); // Asumiendo que checkUpdate es una función que valida los datos de actualización
        if (!update) {
            return res.status(400).send({ message: 'Data has been sent that cannot be updated or data is missing' });
        }

        let updatedCompany = await Company.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        );

        if (!updatedCompany) {
            return res.status(404).send({ message: 'Company not found and not updated' });
        }
        return res.send({ message: 'Company updated successfully', updatedCompany });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error updating company' });
    }
}


export const listCompanies = async (req, res) => {
    try {
        // Obtiene los parámetros de filtrado y ordenamiento de la consulta
        const { yearsOfExperience, category, sort } = req.query;

        // Construye la consulta base para todas las empresas
        let query = Company.find();

        // Aplica los filtros si existen
        if (yearsOfExperience) {
            query = query.where('yearsOfExperience').gte(parseInt(yearsOfExperience));
        }
        if (category) {
            query = query.where('category').equals(category);
        }

        // Aplica el ordenamiento
        let sortOption = {};
        if (sort === 'A-Z') {
            sortOption = { name: 1 }; // Ordena de forma ascendente por nombre
        } else if (sort === 'Z-A') {
            sortOption = { name: -1 }; // Ordena de forma descendente por nombre
        }
        query = query.sort(sortOption);

        // Ejecuta la consulta
        const companies = await query.exec();

        // Envía la respuesta
        return res.send(companies);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting companies', error: err });
    }
}
export const generarExcelEmpresas= async (req, res) =>  {
    try {
        // Obtener todas las empresas desde la base de datos, incluyendo la información de la categoría asociada
        const companies = await Company.find().populate('category');
        const data = [['name', 'impactLevel', 'yearsOfExperience', 'category', 'email', 'phone']];
        const empresasPromises = companies.map(async company => {
            // Obtener la información de la categoría asociada
            const category = await Category.findById(company.category);

            // Agregar los datos de la empresa a la matriz de datos
            data.push([
                company.name,
                company.impactLevel,
                company.yearsOfExperience,
                category ? category.name : '', 
                company.email,
                company.phone
            ]);
        });

        // Esperar a que todas las promesas se resuelvan
        await Promise.all(empresasPromises);

        // Crear un libro de Excel y agregar la hoja con los datos
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.aoa_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Empresas');

        // Escribir el libro de Excel en un archivo
        const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        await writeFile('reporte_empresas.xlsx', excelBuffer);

        console.log('Business report generated correctly.');
    } catch (error) {
        console.error('Error generating the report:', error);
    }
}