import express from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import postRouter from "./routes/postRoutes";
import categoryRouter from "./routes/categoryRoutes";

import morgan from "morgan";

const app = express();

app.use(morgan("combined"));
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", postRouter);
app.use("/api", categoryRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
