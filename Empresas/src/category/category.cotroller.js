import Category from './category.model.js'
import {checkUpdate} from '../utils/validator.js'

export const test = (req, res) =>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const aggregate = async(req, res)=>{
    try{
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send({message: `The category was added successfully ${category.name}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'error the category was not added'})
    }
}

export const updateCompany = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;

        let update = checkUpdate(data, id); // Asumiendo que checkUpdate es una función que valida los datos de actualización
        if (!update) {
            return res.status(400).send({ message: 'Data has been sent that cannot be updated or data is missing' });
        }

        // Agregar categoría si está presente en la solicitud
        if (req.body.category) {
            data.category = req.body.category;
        }

        let updatedCategory = await Category.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).send({ message: 'company not found and not updated' });
        }
        return res.send({ message: 'Company updated successfully', updatedCategory });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error updating company' });
    }
}
