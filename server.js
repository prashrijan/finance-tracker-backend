import express from "express";
import cors from "cors";
import { userRouter } from "./src/routes/userRoutes.js";
import { transactionRouter } from "./src/routes/transactionRoutes.js";
import { dbConnection } from "./src/config/dbConnection.js";

// connection to database
const PORT = process.env.PORT || 5000;
try {
  dbConnection().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  });
} catch (error) {
  console.error(`There was an error connecting to the database: ${error}`);
}

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/transactions", transactionRouter);
