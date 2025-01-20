import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODBURI);
    connection && console.log(`Database is connected successfully.`);
  } catch (error) {
    console.error(`Error connecting to the database`);
  }
};
