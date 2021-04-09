import mongoose from "mongoose";

export const schema = {
    id: {
        exists: true,
        custom: {
            options: (value) => mongoose.Types.ObjectId.isValid(value),
            errorMessage: "Invalid ObjectId provided"
        }
    }
}