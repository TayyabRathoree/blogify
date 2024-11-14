const { validateToken } = require("../service/authentication");

/**
 * Middleware to check for authentication cookie and set user if valid
 * @param {string} cookieName - Name of the cookie to check
 * @returns {function} - Middleware function
 */
function checkForAuthCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        
        // Proceed if no token cookie is found
        if (!tokenCookieValue) {
            return next();
        }

        try {
            // Validate token and set req.user
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
            console.error("Token validation error:", error);
        }

        return next();
    };
}

/**
 * Middleware to check for authentication and redirect to sign-in if not authenticated
 * @param {string} cookieName - Name of the cookie to check
 * @returns {function} - Middleware function
 */
function checkForIsUserSignin(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        // Redirect to sign-in if no token cookie is found
        if (!tokenCookieValue) {
            return res.redirect("/user/signin");
        }

        try {
            // Validate token and set req.user, else redirect
            const userPayload = validateToken(tokenCookieValue);
            if (!userPayload) {
                return res.redirect("/user/signin");
            }
            req.user = userPayload;
        } catch (error) {
            console.error("Token validation error:", error);
            return res.redirect("/user/signin");
        }

        return next();
    };
}

module.exports = {
    checkForAuthCookie,
    checkForIsUserSignin,
};
