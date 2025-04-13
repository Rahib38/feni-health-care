import cors from "cors";
import express, { Application, Request, Response } from "express";
import { userRoutes } from "./app/modules/User/user.route";


const app: Application = express();
app.use(cors());
app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Feni health care server..",
  });
});

app.use("/api/v1/user", userRoutes);
export default app;
