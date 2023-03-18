const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

export default function (passport) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: "/auth/callback",
			},
			async (accessToken, refreshToken, profile, done) => {
				const newUser = {
					googleId: profile.id,
					displayName: profile.displayName,
					firstName: profile.name.givenName,
					lastName: profile.name.familyName,
					image: profile.photos[0].value,
					email: profile.emails[0].value,
				};

				try {
					let user = await User.findOne({ googleId: profile.id });
					if (user) {
						done(null, user);
					} else {
						user = await User.create(newUser);
						done(null, user);
					}
				} catch (err) {
					console.error(err);
				}
			}
		)
	);

	passport.serializeUser((user, cb) => {
		process.nextTick(() => {
			return cb(null, {
				id: user.id,
				username: user.username,
				picture: user.picture,
			});
		});
	});

	passport.deserializeUser((user, cb) => {
		process.nextTick(async () => {
			try {
				let profile = await User.findById(user.id);
				return cb(null, profile);
			} catch (err) {
				console.error(err);
			}
		});
	});
}
