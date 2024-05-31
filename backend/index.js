import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { server } from "./app.js";

// config environment variables
dotenv.config();

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`⚙️ Server is running at port : ${PORT}`);
  connectDB();
});
