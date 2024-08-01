import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from "../utils/error.js";

export const signup =  async (req,res,next) => {


try {
  const { username, email, password } = req.body;

 

  const hashedPassword = bcryptjs.hashSync(password,10);
  const newUser = new User({username, email, password: hashedPassword});

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email is already in use" });
  }


  

 
  
  
  await newUser.save();

  res.status(201).json({message: "User created successfully"});

} catch (err) {
 // res.status(500).json(err.message);
 next(err);
}


};


export const signin = async (req,res,next) => {
  const { email,password } = req.body;
  try {
    
    const validUser = await User.findOne({ email });
    if(!validUser) return next(errorHandler(404, 'User not Found'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if(!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign({id: validUser._id }, process.env.JWT_SECRET);
    const {password: pass, ...rest} = validUser._doc;         // means jabh sign krenge toh response mein admin ko password nhi dikhna chaiyeh Validuser ka
    res.cookie('access_token', token, {httpOnly: true }).status(200).json(rest);


  } catch (error) {
    next(error);
  }
};



export const google = async (req,res,next) => {
  try {

    const user = await User.findOne({ email: req.body.email });
    if(user) {
      const token = jwt.sign({id: user._id }, process.env.JWT_SECRET);
      const {password: pass, ...rest} = user._doc;         // means jabh sign krenge toh response mein admin ko password nhi dikhna chaiyeh Validuser ka
      res.cookie('access_token', token, {httpOnly: true }).status(200).json(rest);
    } else {
      // means user exist nhi krta toh hum new user create krnege

      // Now since from frontend we are sign in with google but we are creating a new user so we have to create a password because we are not passing password in re.body

      const generatedPassword = Math.random().toString(36).slice(-8) +  Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      // Now here hum apne user ka username create kr rhe h uske name se by doing some modification
      const newUser = new User({ username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo, });

      await newUser.save() // saving new user to our database

      const token = jwt.sign({id: newUser._id }, process.env.JWT_SECRET);
      const {password: pass, ...rest} = newUser._doc;        
      res.cookie('access_token', token, {httpOnly: true }).status(200).json(rest);

    }
   
  } catch (error) {
    next(error);
  }
}



export const signOut = (req,res,next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }

}





