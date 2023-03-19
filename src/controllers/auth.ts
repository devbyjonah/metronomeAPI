import { Request, Response, NextFunction } from "express";
import passport from "passport";

export default class AuthController {
	// passport authentication
	public google = passport.authenticate("google", {
		scope: ["profile", "email"],
	});
	public googleCallback = passport.authenticate("google", {
		failureRedirect: "/auth/login",
	});

	public loginSuccess = (req: Request, res: Response) => {
		res.redirect("/");
	};
	public logOut = (req: Request, res: Response, next: NextFunction) => {
		req.logOut((error) => {
			if (error) {
				return next(error);
			}
			res.redirect("/");
		});
	};
}
