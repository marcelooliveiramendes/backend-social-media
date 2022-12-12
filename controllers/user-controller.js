import User from "../model/User"
import bcrypt from "bcryptjs"

export const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        return console.log(err);
    }
    if(!users){
        return res.status(404).json({
                    message: "No users found"
                });
    }
    
    return res.status(200).json({users});
    
}

export const signup = async(req, res) => {
    const {name, email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email});
    } catch (error) {
        return console.log(error);
    }
    if(existingUser){
            return res.status(400).json({message: "User already exists! Login Instead!"})
    }
    
    const hashedPassword = bcrypt.hashSync(password)

    const user = new User({
        name,
        email,
        password: hashedPassword,
        blogs: [],
    })
    

    try {
        await user.save()
    } catch (error) {
        return console.log(error);
    }

    return res.status(201).json({message: "User created!"})
}

export const login = async (req, res) => {
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email});
    } catch (error) {
        return console.log(error);
    }
    if(!existingUser){
            return res.status(404).json({message: "Couldnt Find User By Email!"})
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Password doesnt match!"})
    }
    return res.status(200).json({message: "Login Successfully"})
}