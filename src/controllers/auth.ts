import { Request, Response, NextFunction } from "express";
import passport from "passport";

export default class AuthController {
	// passport authentication
	public google = passport.authenticate("google", {
		scope: ["profile", "email"],
	});
	public googleCallback = passport.authenticate("google", {
		failureRedirect: "/google",
	});

	public loginSuccess = (req: Request, res: Response) => {
		// redirect to metronome application w/ JWT
		res.redirect("http://localhost:3000");
	};
	public logOut = (req: Request, res: Response) => {
		// remove token from server memory and redirect to login page
	};
}
