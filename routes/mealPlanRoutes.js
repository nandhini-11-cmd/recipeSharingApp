const express = require("express");
const router = express.Router();

const { createMealPlan, getMealPlans, updateMealPlan, deleteMealPlan,generateShoppingList } = require("../controllers/mealPlanController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createMealPlan);
router.get("/", protect, getMealPlans);
router.put("/", protect, updateMealPlan);
router.delete("/:id", protect, deleteMealPlan);
router.get("/shopping-list",protect,generateShoppingList);

module.exports = router;