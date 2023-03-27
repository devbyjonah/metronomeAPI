import express, { Application } from "express";
import Path from "path";
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

class App {
	public app: Application;
	public env: string;
	public port: string | number;
	public db: mongoose.Connection;

	constructor(routes: Routes[]) {
		this.app = express();
		this.env = process.env.NODE_ENV || "development";
		this.port = process.env.PORT || 4000;

		this.app.use(morgan("dev"));
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
		// init mongo store and session info
		const sessionOptions = {
			secret: process.env.SECRET,
			resave: false,
			saveUninitialized: false,
			store: MongoStore.create({
				mongoUrl: process.env.MONGO_URI,
			}),
		};
		// identify sources of script and image files to be loaded
		const contentSecurityPolicy = {
			directives: {
				"script-src": ["'self'", "https://cdn.jsdelivr.net"],
				"img-src": [
					"'self'",
					"data:",
					"https://lh3.googleusercontent.com/",
				],
			},
		};

		// set index option to non-existent file to disable
		// automatic serving of index.html
		this.app.use(
			express.static(Path.join(__dirname, "../build"), { index: "_" })
		);
		this.app.use(cookieParser());
		this.app.use(session(sessionOptions));
		this.app.use(passport.initialize());
		this.app.use(passport.authenticate("session"));
		this.app.use(cors());
		// hpp and helmet defend against HTTP Parameter Pollution and other security issues
		this.app.use(hpp());
		this.app.use(helmet());
		this.app.use(helmet.contentSecurityPolicy(contentSecurityPolicy));
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private initializeRoutes(routes: Routes[]) {
		routes.forEach((route) => {
			this.app.use(route.path, route.router);
		});
	}
}

export default App;
