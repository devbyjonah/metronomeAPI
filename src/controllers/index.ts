import { Request, Response, NextFunction } from "express";

export default class IndexController {
	public index = (req: Request, res: Response, next: NextFunction) => {
		console.log(req.session);
		res.sendFile("/index.html", { root: "build" });
	};
}
