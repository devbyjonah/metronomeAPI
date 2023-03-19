export const ensureAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/auth/login");
	}
};

export const ensureGuest = (req, res, next) => {
	if (req.isAuthenticated()) {
		res.redirect("/");
	} else {
		return next();
	}
};
