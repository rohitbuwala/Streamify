import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({

    fullName: {
        type : String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    Bio : {
        type : String,
        default: ""
    },
    profilePic: {
        type: String,
        default: "",
    },
    nativelanguage: {
        type: String,
        default:   ""
    },
    learninglanguage: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: "",
    },
    isOnboarded: {
        type: String,
        default: false,
    },
    friend: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"

        },
    ],

},
{timestamps: true});


//pre Hooks

    userSchema.pre("save", async function (next) {
        if (!this.isModified("password")) return next();
        
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (error) {
            next(error);
        }
    });

    userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
    
const User = mongoose.model("User", userSchema);


export default  User;