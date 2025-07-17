const express = require("express");
const router = express.Router();

const {createRecipe,getAllRecipes,getSingleRecipe,updateRecipe,deleteRecipe,rateRecipe,addComment  } = require("../controllers/recipeController");

const protect = require("../middleware/authMiddleware");


router.get("/", getAllRecipes);             
router.get("/:id", getSingleRecipe);        


router.post("/", protect, createRecipe);         
router.put("/:id", protect, updateRecipe);       
router.delete("/:id", protect, deleteRecipe);  


router.post("/:id/rate", protect, rateRecipe);
router.post("/:id/comment", protect, addComment);

module.exports = router;