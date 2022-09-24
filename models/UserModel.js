import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        }
    }
);



// we need to has the password before saving it in database
// we cannot use arrow function here as we cannot use a lexical function inside an standard function.
UserSchema.pre("save", function(next){
    // if the password field is already hashed we simply return the control to the save method of singup controller
    console.log(this);
    if(!this.isModified("password")){
        return next();
    }

    // else we do hashing
    const hashedPassword = bcrypt.hashSync(this.password, 10);
    this.password = hashedPassword;
    return next();
});

// At the login time we need to check incoming password with hashed password
UserSchema.methods.checkPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

const User =  mongoose.model('user', UserSchema);
export default User;