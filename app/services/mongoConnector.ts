import dotenv from "dotenv";
const mongoose = require("mongoose");
dotenv.config();

let connection;
export const connectDB = async () => {
  let mongoDbUrl: any = process.env.MONGO_URL;
  let updatedMongoDbUrl = "";
  try {
    // if (mongoDbUrl) {
    const currentEnv = process.env.NODE_ENV;
    const isTestMode = currentEnv === "test" ? true : false;

    if (isTestMode) {
      mongoDbUrl = process.env.MONGO_TEST_URL;
    }

    let password = mongoDbUrl.split(":")[2].split("@")[0];
    updatedMongoDbUrl = mongoDbUrl.replace(password, "**************");
    // }

    // console.log(`Connecting to MongoDB URL ${updatedMongoDbUrl}...`);
    connection = await mongoose.connect(mongoDbUrl, { maxPoolSize: 50 });
    console.warn(`Connected to MongoDB URL ${updatedMongoDbUrl}`);
    return connection;
  } catch (error) {
    //handle connect error
    console.log(
      `Cant connect to MongoDB URL ${updatedMongoDbUrl} - ERROR : ${error}`
    );
  }
};

// connectDB();

export default connection;
