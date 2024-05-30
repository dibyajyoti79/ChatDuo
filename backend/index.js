import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";
// import { server } from "./socket/socket.js";

// config environment variables
dotenv.config();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`⚙️ Server is running at port : ${PORT}`);
  connectDB();
});
