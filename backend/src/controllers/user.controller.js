
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';
import generateToken from '../lib/utils.js';

const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        //check if all fields are filled
        if(!fullname || !email || !password) return res.status(400).json({message: 'Please fill all fields'});
        
        if(password.length < 6) return res.status(400).json({message: 'Password is too short'}); //check password length
        //check if user already exists
        const existingUser = await User.findOne({email});

        if(existingUser) return res.status(400).json({message: 'User already exists'});

        //hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        //create new user
        const newUser = new User({
            fullname,
            email,
            password: passwordHash
        });

        //check if has been created
        if(!newUser) return res.status(400).json({message: 'User not created'});

        //generate token
        const token = generateToken(newUser._id,res);

        //save user and respond
        await newUser.save();

        res.status(201).json({message: 'User created successfully',token, user: {...newUser,profilePic:newUser.profilePic}});
        
    } catch (error) {
        res.status(500);
        throw new Error(error);
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        //check if all fields are filled
        if(!email || !password) return res.status(400).json({message: 'Please fill all fields'});

        //check if user exists
        const existingUser = await User.findOne({email});

        if(!existingUser) return res.status(400).json({message: 'Invalid credentials'});

        //compare password
        const isMatch = await bcrypt.compare(password, existingUser.password);

        if(!isMatch) return res.status(400).json({message: 'Invalid credentials'});

        //generate token
        const token = generateToken(existingUser._id,res);

        res.status(200).json({message: 'Logged in successfully',token, user: {...existingUser,profilePic:existingUser.profilePic}});
        
    } catch (error) {
        console.log("error in the server:",error);
        res.status(500).json({message: 'Server error'});
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({message: 'Logged out successfully'});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}

const updateProfile = async (req, res) => {
      
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic) return res.status(400).json({message: 'Please select a profile picture'});

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
        
        res.status(200).json({message: 'Profile updated successfully', user: {...updatedUser,profilePic:updatedUser.profilePic}});

    } catch (error) {
        console.log("error in the server:",error);
        res.status(500).json({message: 'Server error'});
    }
}

const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

export  { signup, login, logout, updateProfile,checkAuth };