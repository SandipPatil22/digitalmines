import { Mines } from "../models/mines.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createMine = asyncHandler(async (req, res) => {
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

  const isExists = await Mines.findOne({ mineCode });

  if (isExists) {
    return res.status(400).json({ message: "mine is already exist" });
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
    res.status(200).json({ message: "mine created succesfully", data: mine });
  } else {
    return res.status(400).json({ message: "fail to create mine" });
  }
});

const getMines = asyncHandler(async (req, res) => {
  const mines = await Mines.find({ corporation: req?.user?._id, status: true });

  if (mines.length > 0) {
    return res
      .status(200)
      .json({ message: "mine data featch succesfully ", data: mines });
  } else {
    return res.status(400).json({ message: "no data found" });
  }
});

const deleteMine = asyncHandler(async (req, res) => {
  const mine = await Mines.findById(req.params.mineId);

  if (mine) {
    mine.status = false;
    await mine.save();
    res.status(200).json({ message: "mine removed succesfully" });
  } else {
    return res.status(400).json({ message: "mine not found" });
  }
});

const updateMine = asyncHandler(async (req, res) => {
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

  const mine = await Mines.findById(req.params.mineId);

  if (!mine) {
    return res.status(404).json({ message: "mine not found" });
  }

  const mineupdate = await Mines.findByIdAndUpdate(
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

  if (mineupdate) {
    return res
      .status(200)
      .json({ message: "mine update succesfully", data: mineupdate });
  } else {
    return res.status(400).json({ message: "mine not found" });
  }
});

export { createMine, getMines, deleteMine,updateMine };
