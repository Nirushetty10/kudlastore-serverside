import User from "../model/User.js"
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";

export const registerUser = async (req,res,next)=> {
    try {

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(req.body.password , salt);

        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword
        })

        await newUser.save();
        res.status(200).json("User registered successfully");
    } catch (error) {
        res.status(500).json("Username / email is already taken");
    }
}

export const loginUser = async (req,res,next)=> {
    try {

        const user = await User.findOne({email : req.body.email});

        if(!user) return  res.status(500).json("user not found!. Please signup");

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(isPasswordCorrect) {
            const token = jwt.sign({id:user._id , userName : user.username , isAdmin:user.isAdmin} , process.env.JWT_SECRETE)
            const {password, isAdmin , ...other} = user._doc;
           res.cookie("access_token", token , {httpOnly : true}).status(200).json({...other});
        } else {
            res.status(500).json("Wrong email / password!");
        }
    } catch (error) {
        res.status(500).json("Something went wrong!");
    }
}

export const logout = async (req, res) => {
    res.cookie('access_token', 'none', {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({ success: true, message: 'User logged out successfully' })
}
