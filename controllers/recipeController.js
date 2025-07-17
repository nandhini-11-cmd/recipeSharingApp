const Recipe = require("../models/Recipe");

exports.createRecipe= async (req,res)=>
{
    try{

        const {title, ingredients,steps,cookingTime,servings,photo,video} = req.body;

        const newRecipe = new Recipe({ title,ingredients,steps,cookingTime,servings,photo,video,createdBy:req.user._id});

        const savedRecipe = await newRecipe.save();

        res.status(201).json(savedRecipe);

    }catch(err)
    {
   res.status(500).json({msg: err.message});
    }
}

exports.getAllRecipes = async (req, res) => {
  try {
    const { ingredient, cuisine, diet, minRating, search } = req.query;

    let filter = {};

    if (ingredient) {
      filter.ingredients = { $in: [new RegExp(ingredient, "i")] };
    }

    if (cuisine) {
      filter.cuisine = new RegExp(cuisine, "i"); // case-insensitive
    }

    if (diet) {
      filter.diet = new RegExp(diet, "i");
    }

    if (search) {
      filter.title = new RegExp(search, "i");
    }

    let recipes = await Recipe.find(filter)
      .populate("createdBy", "name email")
      .populate("comments.user", "name email")
      .populate("ratings.user", "name email");

    if (minRating) {
      recipes = recipes.filter(
        (r) => r.averageRating >= parseFloat(minRating)
      );
    }

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}
exports.getSingleRecipe = async (req,res) =>
{
    try{

        const recipe = await Recipe.findById(req.params.id).populate("createdBy","name email").populate("comments.user", "name email").populate("ratings.user","name email");

        if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
        }
        res.json(recipe);

    }catch(err){
        res.status(500).json({msg: err.message});
    }
}


exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });

    if (recipe.createdBy.toString() !== req.user._id.toString())
         {
      return res.status(403).json({ msg: "You can only update your own recipes" });
    }

    const updates = ["title", "ingredients", "steps", "cookingTime", "servings", "photo", "video"];

    updates.forEach(field => 
        {
          if (req.body[field] !== undefined) {
          recipe[field] = req.body[field];
      }
    });

    const updatedRecipe = await recipe.save();

    res.json(updatedRecipe);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });

    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "You can only delete your own recipes" });
    }

    await recipe.deleteOne();
    res.json({ msg: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.rateRecipe = async (req,res)=>{
try{
const {rating} = req.body;
if(!rating || rating<1 || rating>5)
{
  return res.status(400).json({msg: "Ratings must be between 1 and 5"});
}

const recipe = await Recipe.findById(req.params.id);
if(!recipe)
{
  return res.status(400).json({msg: "Recipe Not found"});
}

const existingRatings= recipe.ratings.find((r) => r.user.toString() === req.user._id.toString());
if(existingRatings)
{
  existingRatings.rating = rating;
}
else
{
  recipe.ratings.push({user: req.user._id, rating});
}

    const total = recipe.ratings.reduce((sum, r) => sum + r.rating, 0);

    recipe.averageRating = total / recipe.ratings.length;

    await recipe.save();

    res.json({ msg: "Rating submitted", averageRating: recipe.averageRating });

}catch(err)
{
res.status(500).json({ msg: err.message });

}

};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ msg: "Comment cannot be empty" });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });

    const comment = { user: req.user._id, text};

    recipe.comments.push(comment);

    await recipe.save();

    res.status(201).json({ msg: "Comment added successfully", comments: recipe.comments });

  } 
  catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

