import { Router } from "express";
import IndexController from "../controllers/index";
import { Routes } from "@interfaces/routes.interface";

let { ensureAuth } = require("../middleware/auth");

class IndexRoute implements Routes {
  public path = "/";
  public router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", ensureAuth, this.indexController.index);
  }
}

export default IndexRoute;
