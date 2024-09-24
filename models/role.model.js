import { Schema } from "mongoose";
import mongoose from "mongoose";

const roleSchema = new Schema(
    {
        name: {
        type: String,
        required: true,
        },
        corporation: {
            type: Schema.Types.ObjectId,
            ref: "User",
            // required: true,
          },
          status: {
            type: Boolean,
            default: true,
          },
        
    },
    {
        timestamps: true,
    }
    
)

export const Role = mongoose.model("Role", roleSchema);