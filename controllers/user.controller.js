import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import  bcrypt  from "bcryptjs";
import  generateToken  from "../utils/generateToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { fname, lname, email, password, role, phone, location } = req.body;

  if (!fname || !lname || !email || !password || !role || !phone || !location) {
    return res.status(400).json({ message: "required field are missing" });
  }

  const isExists = await User.findOne({ email: email });

  if (isExists) {
    return res.status(400).json({ message: "user already exists" });
  }

  const fullname = `${fname} ${lname}`;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newuser = await User.create({
    fname,
    lname,
    fullname,
    email,
    password: hashedPassword,
    role,
    phone,
    location,
  });

  if (newuser) {
    return res
      .status(200)
      .json({ message: "user created succesfully ", data: newuser });
  } else {
    return res.status(400).json({ message: "fail to create user " });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status({ message: "required field missing " });
  }

  const user = await User.findOne({ email: email }).populate("role");

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    return res.status(200).json({
      message: "user logged in succesfully",
      user,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({ message: "invalid email or password" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.status = false;
    await user.save();
    res.status(200).json({ message: "user deleted succesfully" ,data:user});
  } else {
    return res.status(404).json({ message: "user not found " });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { fname, lname, email, role, phone, location } = req.body;

  const existingUser = await User.findById(req.params.id);

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // If fname or lname are not provided in the request, use the existing values
  const updatedFname = fname || existingUser.fname;
  const updatedLname = lname || existingUser.lname;

  // Update the fullname based on updated fname and lname
  const fullname = `${updatedFname} ${updatedLname}`;
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      fname: updatedFname,
      lname: updatedLname,
      fullname,
      email,
      role,
      phone,
      location,
    },
    { new: true }
  );

  if (user) {
    return res
      .status(200)
      .json({ message: "user updated succesfully", data: user });
  } else {
    return res.status(400).json({ message: "Error updating user" });
  }
});

const getUser = asyncHandler(async(req,res)=>{
  const user = await User.find({status:true})

  if (user.length>0) {
    return res.status(200).json({message:"user featch succesfully",data :user})
  } else {
    return res.status(400).json({message:'user not found'})
  }
})

export { createUser, loginUser, deleteUser,getUser,updateUser };
