import { Schema } from "mongoose";
import mongoose from "mongoose";

const stockpileSchema = new Schema(
{
    StockpileName :{
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

export const Stockpile = mongoose.model("Stockpile", stockpileSchema);
