import { Request } from "express";

export interface User {
	id: string;
}

export interface RequestWithUser extends Request {
	user: User;
}
