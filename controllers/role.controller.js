import { Role } from "../models/role.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createRole = asyncHandler(async (req, res) => {
  const { roleName } = req.body;
  const roleExists = await Role.findOne({ roleName });

  if (roleExists) {
    return res.status(400).json({ message: "Role already exists" });
  }
  const corporationId=  req?.user?._id
  const role = await Role.create({ name: roleName,corporation:corporationId });

  if (role) {
    return res
      .status(200)
      .json({ message: "Role created successfully", data: role });
  } else {
    return res.status(400).json({ message: "Role creation failed" });
  }
});

const getRole = asyncHandler(async (req, res) => {
  const corporationId=  req?.user?._id
  const roles = await Role.find({corporation:corporationId, status: true });

  if (roles.length > 0) {
    return res.status(200).json({
      message: "Roles featch succesfully",
      data: roles,
    });
  } else {
    return res.status(404).json({
      message: "No roles found",
    });
  }
});

const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (role) {
    role.status = false;
    await role.save();
    res.json({ message: "Role Removed" });
  } else {
    res.status(404);
    throw new Error(" Role not found");
  }
});

export { createRole, getRole, deleteRole };
