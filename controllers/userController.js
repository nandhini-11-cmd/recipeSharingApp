const User = require("../models/User");
const Recipe = require("../models/Recipe");

exports.addToFavorites = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;

    const user = await User.findById(req.user._id);

    if (user.favorites.includes(recipeId)) {
      return res.status(400).json({ msg: "Recipe already in favorites" });
    }

    user.favorites.push(recipeId);
    await user.save();

    res.json({ msg: "Recipe added to favorites" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getFavoriteRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) return res.status(404).json({ msg: "User not found" });

    if (userToFollow._id.equals(currentUser._id))
      return res.status(400).json({ msg: "You can't follow yourself" });

       const alreadyFollowing = currentUser.following.some((id) =>
      id.equals(userToFollow._id)
    );

    if (!alreadyFollowing) {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);

      await currentUser.save();
      await userToFollow.save();

      return res.json({ msg: "Followed user successfully" });
    }

    return res.status(400).json({ msg: "Already following this user" });
  } catch (err) {
    console.error(" Follow user error:", err.message);
    res.status(500).json({ msg: err.message });
  }
};


exports.unfollowUser = async (req, res) => {
  try {
  const userToUnfollow = await User.findById(req.params.userId);
  const currentUser = await User.findById(req.user._id);

  if (!userToUnfollow) return res.status(404).json({ msg: "User not found" });

  currentUser.following = currentUser.following.filter(
    id => !id.equals(userToUnfollow._id)  
  );
  userToUnfollow.followers = userToUnfollow.followers.filter(
    id => !id.equals(currentUser._id)   
  );

  await currentUser.save();
  await userToUnfollow.save();

  res.json({ msg: "Unfollowed user successfully" });
} catch (err) {
  res.status(500).json({ msg: err.message });
}};

exports.getFollowingUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("following", "name email profilePic bio");
    res.json(user.following);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};