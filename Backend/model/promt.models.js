import mongoose from "mongoose";

const promtSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
    role:{
        type:String,
        enum:["user","assistant"],
        require:true,
    },
    content:{
        type:String,
        require:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,

    },
})

const Promt = mongoose.model("Promt", promtSchema)

export default Promt;