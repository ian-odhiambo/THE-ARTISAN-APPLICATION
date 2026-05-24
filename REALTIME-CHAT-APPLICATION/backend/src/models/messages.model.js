import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true
    },
    message:{
        type:String,
        required: true
    }
},
//timestamps introduce by default- craeted at and updated at fields for the messages 
{
    timestamps: true
}
);

const Message = mongoose.model("Message", messageSchema);

export default Message;