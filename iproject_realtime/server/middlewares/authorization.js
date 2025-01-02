const { Profile, MyActivity } = require("../models");

const authorization = async (req, res, next) => {
  try {
    const { userId } = req.loginInfo;
    console.log(userId);

    const profile = await Profile.findOne({
      where: { userId },
    });

    if (!profile) {
      if (req.method === "POST" && req.path === `/profile`) {
        return next();
      }
    }

    if (req.method !== "GET" && !req.path.startsWith("/activity")) {
      return next();
    }

    const activity = await MyActivity.findOne({
      where: { userId },
    });

    if (!activity) {
      if (req.method === "GET") {
        return next();
      }
    }

    next();
  } catch (error) {
    console.log("Authorization error:", error);
    next(error);
  }
};

module.exports = authorization;
