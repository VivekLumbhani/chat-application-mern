const express=require("express");
const { protect } = require("../middleware/authMiddleware");
const { model } = require("mongoose");
const { accessChat, fetchChats, createGroupChats, renameGroupChats, addToGroup, removeFromGroup } = require("../controllers/chatController");

const router=express.Router();

router.route("/").post(protect,accessChat);
router.route("/").get(protect,fetchChats);
router.route("/group").post(protect,createGroupChats);
router.route("/rename").put(protect,renameGroupChats);
router.route("/groupadd").put(protect,addToGroup);
router.route("/groupremove").put(protect,removeFromGroup);


module.exports=router