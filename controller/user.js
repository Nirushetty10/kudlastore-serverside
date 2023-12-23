import User from "../model/User.js";

export const updateUser = async(req,res)=> {
    const id = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(id,{$set : req.body}, {new : true})
        res.status(200).json(updatedUser);
    } catch(err) {
        res.status(500).json("User not found");
    }
}

export const deleteUser = async(req,res)=> {
    const id = req.params.id;
    try {
        await User.findByIdAndDelete(id)
        res.status(200).json("User deleted successfully");
    } catch(err) {
        res.status(500).json("User not found");
    }
}

export const getUser = async(req,res)=> {
    const id = req.params.id;
    try {
        let user = await User.findById(id)
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json("User not found");
    }
}

export const getAllUsers = async(req,res)=> {
    try {
        let users = await User.find();
        res.status(200).json(users);
    } catch(err) {
        res.status(500).json("User not found");
    }
}

export const getUsersStats = async (req,res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
   try {
     const data = await User.aggregate([
        { $match : {createdAt : {$gte : lastYear}}},
        {
            $project : {
                month : {$month : "$createdAt"}
            },
        },
        {
            $group : {
                _id : "$month",
                total : { $sum : 1}
            }
        }
     ])
     res.status(200).json(data);
   } catch (error) {
     
   }
}