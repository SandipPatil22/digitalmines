import { Employee } from "../models/employee.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import  generateToken  from "../utils/generateToken.js";

const createSupervisor = asyncHandler(async (req, res) => {
  const { fname, lname, email, role, phone, address, mine } = req.body;

  const corporationId = req?.user?._id;
  const isExists = await Employee.findOne({ email });

  if (isExists) {
    return res.status(400).json({ message: "Supervisor is already exist " });
  }

  const fullname = `${fname} ${lname}`;

  const randomNum = Math.floor(1000 + Math.random() * 9000);

  const supervisorId = `SUP-${randomNum}`;

  const char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234456789";

  let password = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * char.length);
    password += char[randomIndex];
  }

  const profilePic = req?.files?.profilePic
    ? `uploads/${req.files.profilePic[0].filename}`
    : undefined; // Leave undefined to use the default value from the model

  const supervisorData = {
    fname,
    lname,
    fullname,
    email,
    role,
    profilePic,
    password,
    phone,
    address,
    mine,
    supervisorId,
    corporation: corporationId,
  };

  const supervisor = await Employee.create(supervisorData);

  if (supervisor) {
    return res.status(200).json({
      message: "Supervisor created succesfully",
      data: supervisor,
      password: password,
    });
  } else {
    return res.status(400).json({ message: "Invalid supervisor data " });
  }
});

const getSupervisor = asyncHandler(async (req, res) => {
  const supervisor = await Employee.find({
    corporation: req?.user?._id,
    status: true,
  })
    .populate("mine")
    .populate("role");

  if (supervisor) {
    return res
      .status(200)
      .json({ message: "supervisor featch succesfully", data: supervisor });
  } else {
    return res.status(400).json({ message: "supervisor not found" });
  }
});

const updateSupervisor = asyncHandler(async (req, res) => {
  const { fname, lname, email, role, phone } = req.body;

  const existingSupervisor = await Employee.findById(req.params.id);

  if (!existingSupervisor) {
    return res.status(404).json({ message: "Supervisor not found" });
  }

  const updatedFname = fname || existingSupervisor.fname;
  const updatedLname = lname || existingSupervisor.lname;

  // Update the fullname based on updated fname and lname
  const fullname = `${updatedFname} ${updatedLname}`;

  const update = await Employee.findByIdAndUpdate(
    req.params.id,
    {
      fname: updatedFname,
      lname: updatedLname,
      fullname,
      email,
      role,
      phone,
    },
    { new: true }
  );

  if (update) {
    return res
      .status(200)
      .json({ message: "Supervisor updated succesfully", data: update });
  } else {
    return res.status(400).json({ message: "Error updating Supervisor" });
  }
});

const deleteSupervisor = asyncHandler(async (req, res) => {
  const supervisor = await Employee.findById(req.params.supervisorId);

  if (supervisor) {
    supervisor.status = false;
    await supervisor.save();
    res.json({ message: "remove supervisor" });
  } else {
    res.status(404);
    throw new Error("supervisor not found");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const user = await Employee.findOne({ _id: id, status: true })
    .populate("password fname lname")
    .populate("mine")
    .populate("role");

  if (user) {
    return res
      .status(200)
      .json({ message: "user featch succesfully", data: user });
  } else {
    return res.status(404).json({ message: "user not found" });
  }
});

const loginSupervisor = asyncHandler(async (req, res) => {
  const { supervisorId, password } = req.body;

  const supervisor = await Employee.findOne({ supervisorId });

  if (!supervisor) {
    return res
      .status(401)
      .json({ message: "Invalid Supervisor ID or password" });
  }

  if (supervisor.password === password) {
    res.status(200).json({
      _id: supervisor._id,
      supervisorId: supervisor.supervisorId,
      email: supervisor.email,
      phone: supervisor.phone,
      location: supervisor.address,
      mineId: supervisor.mine,
      token: generateToken(supervisor._id),
    });
  } else {
    res.status(401).json({ message: "Invalid Supervisor ID or password" });
  }
});

export {
  createSupervisor,
  getSupervisor,
  updateSupervisor,
  deleteSupervisor,
  getUserProfile,
  loginSupervisor
};
