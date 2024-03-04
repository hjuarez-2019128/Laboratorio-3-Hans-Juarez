// Importa Mongoose para la definición del esquema
import { Schema, model } from 'mongoose';

// Define el esquema de la empresa
const companySchema = Schema({
    name: {
        type: String,
        required: true
    },
    impactLevel: {
        type: String,
        required: true
    },
    yearsOfExperience: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        require: true   
    },
    email: {
        type: String,
        required: true 
    },

    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    }, 
   
},
{
    versionKey: false
}
)
// Crea y exporta el modelo de la empresa basado en el esquema definido
export default model('company', companySchema);

