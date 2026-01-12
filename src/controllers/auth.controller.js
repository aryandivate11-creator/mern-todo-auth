import bcrypt from "bcrypt";
import User from "../models/User.model.js"
import { generateToken } from "../utils/jwt.js";

export const signup = async (req , res) =>{
    const { email , password  , phone } = req.body
    const phoneRegex = /^[6-9]\d{9}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    console.log(req.body);

   try{
    
    if(!email || !password || !phone){
        return res.status(400).json({
            error:"All fields are required ! please fill up all the fields"
        });
    };
   
    if(!phoneRegex.test(phone)){
        return res.status(400).json({
            error:"Phone no. must start from 6,7,8,9 and must be 10 digits"
        });
    };

    if(!passwordRegex.test(password)){
        return res.status(400).json({
            error:"Password must be atleast 8 characters long and must contain one upper case letter and one number "
        });
    };

    if(!email.includes("@")){
        return res.status(400).json({
            error:"Invalid email address"
        });
    };
   
   const existingUser = await User.findOne({email});

   if(existingUser){
    return res.status(400).json({
        error:"User already exists !"
    })
   };

   const saltRounds = 10;
   const hashedPassword = await bcrypt.hash(password,saltRounds);

   const user = await User.create({
    phone,
    email,
    password: hashedPassword,
   });

    res.status(201).json({
        message:"User registered sucessfully !"
    })
   

}catch(error){
    console.error(error)
    return res.status(500).json({
        message:"Internal Server error"
    });
};
};

export const Login = async (req , res) =>{
   
    try {
        const {email , password} = req.body;
        console.log(req.body);

        const user = await User.findOne({email})
        console.log(user);

        if(!user){
            return res.status(400).json({
                error:"Invalid credentials ! (check kar le firse ek baar)"
            });
        };

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if(!isPasswordCorrect){
            return res.status(400).json({
                error:" Invalid Credentials !"
            });
        };

        const token = generateToken({
            id: user.id,
            email: user.email,
            phone : user.phone
        });

        res.status(200).json({
            message:"Login successfull !",
            token,
            user:{
                 id: user.id,
                 email: user.email,
                 phone : user.phone
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error:"Internal Server error"
        });
    };
};