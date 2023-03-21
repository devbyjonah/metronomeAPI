import { Request, Response, NextFunction } from "express";
import { RequestWithUser } from "@interfaces/user.interface";

export default class IndexController {
	public index = (
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		res.sendFile("/index.html", { root: "build" });
	};
}
