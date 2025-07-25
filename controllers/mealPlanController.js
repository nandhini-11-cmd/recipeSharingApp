const MealPlan = require("../models/MealPlan");
const Recipe = require("../models/Recipe");

exports.createMealPlan = async (req, res) => {
  try {
    const { date, recipes } = req.body;

    const newPlan = new MealPlan({
      user: req.user._id,
      date,
      recipes
    });

    const saved = await newPlan.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getMealPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({ user: req.user._id }).populate("recipes");
    res.json(plans);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateMealPlan = async (req, res) => {
  try {
    const { date, recipes } = req.body;
    
    const normalizedDate = new Date(new Date(date).setHours(0, 0, 0, 0));

    const plan = await MealPlan.findOneAndUpdate({ user: req.user._id, date: normalizedDate },
      { recipes },{ new: true });

    if (!plan) {
      return res.status(404).json({ msg: "Meal plan not found for the date" });
    }

    res.json(plan);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.deleteMealPlan = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ msg: "Date is required" });
    }

    const deleted = await MealPlan.findOneAndDelete({
      user: req.user._id,
      date: new Date(date),
    });

    if (!deleted) {
      return res.status(404).json({ msg: "Meal plan not found" });
    }

    res.json({ msg: "Meal plan deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.generateShoppingList = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.user._id }).populate("recipes");

    const ingredientSet = new Set();

    mealPlans.forEach(plan => {
      plan.recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
          ingredientSet.add(ingredient.toLowerCase()); // Normalize
        });
      });
    });

    const shoppingList = Array.from(ingredientSet);
    res.json({ shoppingList });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};