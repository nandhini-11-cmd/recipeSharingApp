const express = require('express');

const router = express.Router();

const {registerUser,loginUser,updateUserProfile } = require('../controllers/authController');
const {addToFavorites, getFavoriteRecipes,followUser,unfollowUser,getFollowingUsers} = require("../controllers/userController");

const protect = require('../middleware/authMiddleware');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

router.put("/profile", protect, updateUserProfile);

router.post("/favorites/:recipeId", protect, addToFavorites);
router.get("/favorites", protect, getFavoriteRecipes);

router.post("/follow/:userId", protect, followUser);
router.post("/unfollow/:userId", protect, unfollowUser);

router.get("/following", protect, getFollowingUsers);
module.exports = router;