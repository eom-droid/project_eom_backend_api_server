import { InferSchemaType, Schema, model } from "mongoose";

const EmailVerifySchema = new Schema(
  {
    email: { type: String, required: true },
    verificationCode: { type: String, required: true },
  },
  { timestamps: true }
);

export type EmailVerify = InferSchemaType<typeof EmailVerifySchema>;

export const EmailVerifyModel = model("EmailVerify", EmailVerifySchema);
