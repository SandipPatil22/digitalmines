import { Schema } from "mongoose";
import mongoose from "mongoose";

const plantSchema = new Schema(
{
    plantName :{
        type:String,
        require:true
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
);

export const Plant = mongoose.model("Plant", plantSchema);
