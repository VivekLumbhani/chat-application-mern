const asyncHandler=require("express-async-handler");
const Chat=require("../models/chatModel");
const User = require("../models/userModel");

// create chatsrooms 
const accessChat=asyncHandler(async(req,res)=>{
    const {userId}=req.body;

    // if(!userId){
    //     console.log("user param not found");
    //     return res.sendStatus(400);
    // }
    var isChat= await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    }).populate("users","-password").populate("latestMessage");

    isChat=await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name email"
    })

    if(isChat.length>0){
        res.send(isChat[0]);
    }else{
        var chatData={
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId]
        };

        try {
            const createdChat=await Chat.create(chatData);
            const FullChat=await Chat.findOne({_id: createdChat._id}).populate("users","-password").populate("latestMessage")
            res.status(200).send(FullChat)
        } catch (error) {
            res.status(400);
            throw new Error(error);
            
        }
    }

})


// fetching chats of user 
const fetchChats=asyncHandler(async(req,res)=>{
    try {
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updateAt:-1})
        .then(async(results) => {
            results=await User.populate(results,{
                path:"latestMessage.sender",
                select:"name email"
            });

            res.status(200).send(results);
        }).catch((err) => {
            
        });

    } catch (error) {
        
    }
})


// create Group Chats

const createGroupChats=asyncHandler(async(req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"please fill all fields"});
    }
    
    var users=JSON.parse(req.body.users);
    if(users.length<1){
        return res.status(400).send("group must be of more than 2 users");
    }

    users.push(req.user);
    try {
        const groupChat=await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user
        });

        const fullGroupChat=await Chat.findOne({_id:groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password");
        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
        
    }
})

// rename of the group

const renameGroupChats=asyncHandler(async(req,res)=>{
    const {chatId,chatName}=req.body;
    const updatedChats=await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },
        {new:true}
    ) 
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!updatedChats){
        res.status(404);
        throw new Error("chat not found");

    }else{
        res.json(updatedChats);
    }
})

// add member to group
const addToGroup=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body;
    const added=await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId},
        

    },{new:true})
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!added){
        res.status(404);
        throw new Error("chat not found");
    }else{
        res.json(added);
    }
})

// removing from group 

const removeFromGroup=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body;
    const removed=await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId},
        

    },{new:true})
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!removed){
        res.status(404);
        throw new Error("chat not found");
    }else{
        res.json(removed);
    }
})


module.exports={accessChat,fetchChats,createGroupChats,renameGroupChats,addToGroup,removeFromGroup}