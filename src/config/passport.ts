//import GoogleStrategy from "passport-google-oauth20";
import User from "../models/User";

const GoogleStrategy = require("passport-google-oauth20").Strategy;
export default function passportConfig(passport) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: "http://localhost:4000/auth/callback",
			},
			async (accessToken, refreshToken, profile, done) => {
				console.log(refreshToken);
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

	passport.serializeUser(function (user, cb) {
		process.nextTick(function () {
			cb(null, { id: user.id, username: user.username, name: user.name });
		});
	});

	passport.deserializeUser(function (user, cb) {
		process.nextTick(function () {
			return cb(null, user);
		});
	});
}
