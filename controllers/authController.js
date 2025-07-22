const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


exports.registerUser = async (req,res) =>{

    try{

        const {name, email, password} = req.body;

        const userExist = await User.findOne({email});
        if(userExist)
        return res.status(400).json({message:"User already exist"});
        

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password,salt);

        const user = await User.create({name, email, password:hashed});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d", });

        res.status(201).json({token, user:{id: user._id,name:user.name, email:user.email},});


    }catch(err)
    {
        res.status(500).json({ msg: err.message });
    }

}


exports.loginUser = async (req,res)=>{
    try{

        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user)
            return res.status(500).json({Message:"User not found"});

        const passMatch = await bcrypt.compare(password, user.password);

        if(!passMatch) return res.status(500).json({message:"Invalid credientials"});

        const token = await jwt.sign({id: user._id,name: user.name, email: user.email}, process.env.JWT_SECRET, {expiresIn:"7d"});
;
        res.status(200).json({token, user:{id:user._id, name: user.name, email:user.email}});



    }catch(err)
    {
 res.status(500).json({ msg: err.message });
    }

};


exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;
    user.profilePic = req.body.profilePic || user.profilePic;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      profilePic: updatedUser.profilePic,
      createdAt: updatedUser.createdAt,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
