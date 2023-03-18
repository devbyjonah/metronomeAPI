import { Router } from "express";
import AuthController from "../controllers/auth";
import { Routes } from "@interfaces/routes.interface";

class AuthRoute implements Routes {
  public path = "/auth";
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/login", this.authController.google);
    this.router.get(
      "/callback",
      this.authController.googleCallback,
      this.authController.loginSuccess
    );
    this.router.get("/logout", this.authController.logOut);
  }
}

export default AuthRoute;
