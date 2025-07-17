const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({

    title:{
        type: String,
        required:true,
    },
    ingredients:{
        type:[String],
        required:true
    },
    steps:
    {
        type:[String],
        required:true
    },
    cookingTime:{
        type:Number,
        required:true,
    },
    serving:{
        type:Number,
        default:1
    },
    photo:{
       type:String
    },
    video:{
        type:String
    },
    createdBy:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    
    },

    ratings:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true,
            },
            rating:{
                type:Number,
                required:true,
                min:1,
                max:5,    
            },

        }
    ],

    averageRating:{
        type:Number,
        default:0
    },

    comments: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
],cuisine: {
  type: String,
  required: true
},
diet: {
  type: String, 
  required: true
}

},{timestamps:true});

    module.exports = mongoose.model("Recipe", recipeSchema);
