import jwt from "jsonwebtoken";

const authmiddleware = (req,res,next) =>{
   const authHeader = req.headers.authorization;

    if(!authHeader || authHeader.startsWith("Bearer")){
        return res.status(401).json({
            message:"Not authorized !"
        });
    };
    
    const token = authHeader.split(" ")[1]
  
    try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);

       req.user = decoded;
       next();
   } catch(error){
        res.status(500).json({
            error:"Invalid or expired token"
        })
   };

}