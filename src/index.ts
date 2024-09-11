import express from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
