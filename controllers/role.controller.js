import { Role } from "../models/role.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createRole = asyncHandler(async (req, res) => {
  const { roleName } = req.body;

  const isExists = await Role.findOne({name:roleName});
  if (isExists) {
    return res.status(400).json({ message: "Role already exist" });
  }

  const newrole = await Role.create({ name:roleName, corporation: req?.user?._id });
  if (newrole) {
    return res.status(200).json({ message: "role created succesfully" ,data:newrole});
  } else {
    return res.status(400).json({ message: "fail to crearte role" });
  }
});

const getRole = asyncHandler(async (req, res) => {
  const corporationId = req?.user?._id;

  const role = await Role.find({ corporation: corporationId, status: true });
  if (role.length > 0) {
    return res
      .status(200)
      .json({ message: "role featch succesfully", data: role });
  } else {
    return res.status(400).json({ message: "fail to featch data " });
  }
});


const deleteRole = asyncHandler(async(req,res)=>{

    const role = await Role.findById(req.params.id)

    if (role) {
        role.status=false
        await role.save()

        res.status(200).json({message:"role deleted succesfully"})
    } else {
        return res.status(400).json({message:"role not found"})
    }
})
export {createRole,getRole,deleteRole};
