import express from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import postRouter from "./routes/postRoutes";

const app = express();

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", postRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
