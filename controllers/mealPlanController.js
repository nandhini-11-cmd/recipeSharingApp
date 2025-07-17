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

    const plan = await MealPlan.findOneAndUpdate(
      { user: req.user._id, date },
      { recipes },
      { new: true }
    );

    res.json(plan);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteMealPlan = async (req, res) => {
  try {
    await MealPlan.findByIdAndDelete(req.params.id);
    res.json({ msg: "Meal plan deleted" });
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