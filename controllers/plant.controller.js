import { asyncHandler } from "../utils/asyncHandler.js";
import { Plant } from "../models/Plant.model.js";

const CreatePlant = asyncHandler(async (req, res) => {
  const { plantName } = req.body;
  const plantExist = await Plant.findOne({ plantName });

  if (plantExist) {
    return res.status(404).json({ message: "Plant is already exist" });
  }
  const corporationId=  req?.user?._id
  const plant = await Plant.create({ plantName,corporation:corporationId });
  if (plant) {
    return res.status(200).json({
      message: " Plant create succesfully",
      data: plant,
    });
  } else {
    return res.status(400).json({ message: " Fail to create Plant" });
  }
});

const getPlant = asyncHandler(async (req, res) => {
  const corporationId=  req?.user?._id
  const plant = await Plant.find({corporation:corporationId, status: true });

  if (plant) {
    return res.status(200).json({
      message: "plants featch succesfully",
      data: plant,
    });
  } else {
    return res.status(404).json({
      message: "No plant found",
    });
  }
});

const deletePlant= asyncHandler(async(req,res)=>{
  const plant = await Plant.findById(req.params.id)
  if (plant) {
    plant.status=false
    await plant.save()
    res.json({message:"Plant Removed"})
  } else {
    res.status(404)
    throw new Error("plant not found")
  }
})

export { CreatePlant , getPlant, deletePlant};
