const mongoose=require('mongoose');

const UserSchema =new mongoose.Schema(
    {
        username:{type:String, required:true,unique:true },
        fullname:{type:String,require:true},
        email : {type:String, required:true,unique:true},
        password: {type:String,required:true},
        isAdmin:{
              type: Boolean,
              default:false,
        },
        phone:{type:String,required:true},
        Address:{type:String,default:"India"},
        img:{type:String,default:"https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"},
        gender:{type:String,default:"NA"}
    },
    {timestamps:true}
);

module.exports = mongoose.model('User',UserSchema);