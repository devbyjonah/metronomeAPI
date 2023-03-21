import { Router } from "express";
import UserController from "../controllers/user";
import { Routes } from "@interfaces/routes.interface";

let { ensureAuth } = require("../middleware/auth");

class UserRoute implements Routes {
  public path = "/user";
  public router = Router();
  public indexController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/profile", ensureAuth, this.indexController.getProfile);
  }
}

export default UserRoute;
