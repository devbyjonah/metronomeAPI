import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import morgan from "morgan";
import hpp from "hpp";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { Routes } from "./interfaces/routes.interface";
import { config } from "dotenv";

class App {
	public app: Application;
	public env: string;
	public port: string | number;

	constructor(routes: Routes[]) {
		this.app = express();
		this.env = process.env.NODE_ENV || "development";
		this.port = process.env.PORT || 3000;

		config({ path: __dirname + "/.env" });

		this.connectToDatabase();
		this.initializeMiddlewares();
		this.initializeRoutes(routes);
	}
	public listen() {
		this.app.listen(this.port, () => {
			console.info(`=================================`);
			console.info(`======= ENV: ${this.env} =======`);
			console.info(`🚀 App listening on the port ${this.port}`);
			console.info(`=================================`);
		});
	}

	public getServer() {
		return this.app;
	}

	private connectToDatabase() {
		if (this.env !== "production") {
			mongoose.set("debug", true);
		}

		mongoose.connect(`${process.env.MONGO_URI}`);
		console.log("connected to DB");
	}

	private initializeMiddlewares() {
		this.app.use(morgan("dev"));
		this.app.use(cors());
		this.app.use(hpp());
		this.app.use(helmet());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cookieParser());
	}

	private initializeRoutes(routes: Routes[]) {
		routes.forEach((route) => {
			this.app.use("/", route.router);
		});
	}
}

export default App;
