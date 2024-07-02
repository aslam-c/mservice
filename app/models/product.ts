import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: Object },
    is_active: { type: Boolean, required: false, default: true },
    price: Number
  },
  { collection: "products", autoCreate: true }
);

const product_model = mongoose.model("Product", schema);

export { product_model };
