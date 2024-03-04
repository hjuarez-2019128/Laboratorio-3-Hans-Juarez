import mongoose from "mongoose";

//Definición del esquema del usuario
const adminSchema = mongoose.Schema({
    name : {
        type: String,
        required: true,
        unique: true
    }, 
    email : {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },  
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'Password must be 8 characters'],
        unique: true
      },
    position:{
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        uppercase: true,
        enum: ['ADMIN'],
        required: true
    }
},
{
    versionKey: false
}
)
export default mongoose.model('Admin', adminSchema  )