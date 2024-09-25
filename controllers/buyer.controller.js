import { Buyers } from "../models/buyers.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBuyer = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const buyerExist = await Buyers.findOne({ name });

  if (buyerExist) {
    return res.status(400).json({ message: "buyer already exist" });
  }
  const corporationId = req?.user?._id;
  const buyer = await Buyers.create({ name: name, corporation: corporationId });
  console.log(corporationId);
  if (buyer) {
    return res
      .status(200)
      .json({ message: " Buyers created succesfully", data: buyer });
  } else {
    return res.status(400).json({ message: "buyers creation falied" });
  }
});

const getBuyers = asyncHandler(async (req, res) => {
  const corporationId = req?.user?._id;
  const buyer = await Buyers.find({ status: true, corporation: corporationId });

  if (buyer.length === 0) {
    return res.status(404).json({ message: "buyers not found" });
  } else {
    return res
      .status(200)
      .json({ message: "byuers featch succesfully ", data: buyer });
  }
});

const deleteBuyers = asyncHandler(async (req, res) => {
  const buyer = await Buyers.findById(req.params.id);

  if (buyer) {
    buyer.status = false;
    await buyer.save();
    return res.json({ message: "Buyers removed " });
  } else {
    res.status(404);
    throw new Error("buyers not found ");
  }
});
export { createBuyer, getBuyers, deleteBuyers };
