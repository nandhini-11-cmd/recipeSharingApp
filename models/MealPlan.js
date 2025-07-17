const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  recipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe"
  }]
}, { timestamps: true });

module.exports = mongoose.model("MealPlan", mealPlanSchema);