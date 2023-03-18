import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import passportConfig from "./config/passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import hpp from "hpp";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { Routes } from "./interfaces/routes.interface";
import { config } from "dotenv";
import { ConnectMongoOptions } from "connect-mongo/build/main/lib/MongoStore";

class App {
	public app: Application;
	public env: string;
	public port: string | number;

	constructor(routes: Routes[]) {
		this.app = express();
		this.env = process.env.NODE_ENV || "development";
		this.port = process.env.PORT || 4000;

		config({ path: __dirname + "/.env" });
		passportConfig(passport);
		console.info(`Server running at ${__dirname}, better go and catch it!`);

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
	}

	private initializeMiddlewares() {
		this.app.use(
			session({
				secret: process.env.SECRET,
				resave: false,
				saveUninitialized: false,
				store: new MongoStore({
					mongoUrl: process.env.MONGO_URI,
				}),
			})
		);
		this.app.use(passport.initialize());
		this.app.use(passport.session());
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
			this.app.use(route.path, route.router);
		});
	}
}

export default App;
