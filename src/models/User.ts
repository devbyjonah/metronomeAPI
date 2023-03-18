import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema({
	googleId: {
		type: String,
		required: true,
	},
	displayName: {
		type: String,
		required: true,
	},
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	image: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	email: {
		type: String,
	},
});

module.exports = model("User", UserSchema);
