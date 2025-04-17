import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import globalErrorHandler from "./app/middleware/globalErrorhandleing";
import router from "./app/routes";
import status from "http-status";

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Feni health care server..",
  });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use((req:Request,res:Response,next:NextFunction)=>{
  res.status(status.NOT_FOUND ).json({
    success:false,
    message:"Api Not Found!",
    error:{
      path:req.originalUrl,
      message:"Your requested path is not found!"
    }
  })

})
export default app;
