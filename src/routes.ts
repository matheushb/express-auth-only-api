import { Request, Response, Router } from "express";

const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.json({ message: "Hello World!" });
});

export default routes;
