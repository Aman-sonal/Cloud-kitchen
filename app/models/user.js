const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        unique:true,
        type:String,
        required:true,
    },
    password:{
        type:String ,
        required:true,
    },
    role:{
        type:String,
        default:'customer'
    }
},{
    timestamps:true
});

const User= mongoose.model('user', userSchema);

module.exports= User;