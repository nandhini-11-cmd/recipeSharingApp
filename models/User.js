const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

     name:{
       type: String,
       required : true,
       trim : true
     },
     email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
     },
     password:{
        type:String,
        required:true,
        minlength:6
     },
     bio:String,
     profilePic: String,  
      favorites: [
                {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Recipe"
            }],
            followers: [{
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
            }],
         following: [{
            type: mongoose.Schema.Types.ObjectId,
             ref: "User"
          }]
    },   
    {timestamps:true });

    module.exports = mongoose.model("User", userSchema);
