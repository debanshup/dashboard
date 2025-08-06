import mongoose from "mongoose";
// import { loadEnvFile } from "node:process";
// loadEnvFile(".env")
export const connectDB = async () => {
  const dbURI = process.env.MONGO_URL!;
  console.log(dbURI);
  await mongoose.connect(dbURI, {});
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("Connected to database");
  });
  db.on("disconnected", () => {
    console.log("Database disconnected");
  });
};
