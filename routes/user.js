import express from "express";
import { deleteUser, getAllUsers, getUser, getUsersStats, updateUser } from "../controller/user.js";
import { verifyAdmin, verifyUser } from "../uitls/verifyToken.js";

const router = express.Router();

// UPDATE

router.put("/:id" , verifyUser, updateUser);

// DELETE

router.delete("/:id" , verifyUser, deleteUser);

// GET

router.get("/:id" ,verifyUser, getUser);

// GET ALL

router.get("/" , verifyAdmin, getAllUsers);

// GET USER STATS

router.get("/admn/stats", verifyAdmin, getUsersStats)

export default router;