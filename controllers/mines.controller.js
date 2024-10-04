import { Mines } from "../models/mines.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createMines = asyncHandler(async (req, res) => {
  const {
    registrationNumber,
    corporation,
    mineCode,
    mineralsName,
    village,
    taluka,
    postOffice,
    district,
    state,
    pincode,
    faxNo,
    phoneNo,
    email,
    mobileNo,
  } = req.body;

  const mineExists = await Mines.findOne({ mineCode });
  if (mineExists) {
    res.status(400).json({ message: "Mine already exists" });
    throw new Error("Mine already exists");
  }

  const mine = await Mines.create({
    registrationNumber,
    corporation,
    mineCode,
    mineralsName,
    village,
    taluka,
    postOffice,
    district,
    state,
    pincode,
    faxNo,
    phoneNo,
    email,
    mobileNo,
  });

  if (mine) {
    res.status(200).json({
      message: "Mine created Successfully",
      data: mine,
    });
  }
});

const getMines = asyncHandler(async (req, res) => {
  const mines = await Mines.find({ corporation: req?.user?._id, status: true });
  console.log(mines.length);
  if (mines.length > 0) {
    return res
      .status(200)
      .json({ data: mines, message: "Mines fetched successfully" });
  } else {
    return res.status(404).json({ message: "No mines found" });
  }
});

const deleteMine = asyncHandler(async (req, res) => {
  const mine = await Mines.findById(req.params.mineId);

  if (mine) {
    // await Mines.findByIdAndDelete(req.params.mineId);
    mine.status = false;
    await mine.save();
    res.json({ message: "Mine removed" });
  } else {
    res.status(404);
    throw new Error("Mine not found");
  }
});

const updateMine = asyncHandler(async (req, res) => {
  const {
    registrationNumber,
    mineCode,
    mineralsName,
    village,
    taluka,
    postOffice,
    district,
    state,
    pincode,
    faxNo,
    phoneNo,
    email,
    mobileNo,
    
  } = req.body;

  const mine = await Mines.findByIdAndUpdate(
    req.params.mineId,
    {
      registrationNumber,
      mineCode,
      mineralsName,
      village,
      taluka,
      postOffice,
      district,
      state,
      pincode,
      faxNo,
      phoneNo,
      email,
      mobileNo,
     
    },
    { new: true }
  );

  if (mine) {
    
    return res
      .status(201)
      .json({ data: mine, message: "mine updated successfully" });
  } else {
    res.status(404);
    throw new Error("Mine not found");
  }
});

export { createMines, getMines, deleteMine, updateMine };
