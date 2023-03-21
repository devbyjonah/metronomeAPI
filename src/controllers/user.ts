import { Request, Response, NextFunction } from "express";
import { RequestWithUser } from "@interfaces/user.interface";
import User from "../models/User";

export default class UserController {
	public getProfile = async (
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) => {
		try {
			let user = await User.findById(req.user.id);
			if (user) {
				res.status(200).json({
					_id: user._id,
					image: user.image,
					displayName: user.displayName,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					createdAt: user.createdAt,
				});
			} else {
				res.status(404).json({ message: "User not found" });
			}
		} catch (error) {
			next(error);
		}
	};
}
