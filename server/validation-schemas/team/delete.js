import mongoose from "mongoose";

export const schema = {
    id: {
        custom: {
            options: (value) => mongoose.Types.ObjectId.isValid(value),
            errorMessage: "Invalid ObjectId provided"
        }
    }
}