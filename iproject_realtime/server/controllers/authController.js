const { User } = require("../models");
const { compare } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");

class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        throw { name: "BadRequest", message: "Email and password are required" };

      const user = await User.create({ email, password });

      res.status(201).json({
        message: "Success create new user",
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) throw { name: "BadRequest" };

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) throw { name: "LoginError" };

      if (!compare(password, user.password)) throw { name: "LoginError" };

      const payload = {
        id: user.id,
        email: user.email,
      };

      const access_token = signToken(payload);

      res.status(200).json({
        access_token,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { token } = req.headers;
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const username = payload.name;

      const [user, created] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          email: payload.email,
          password: "password_google",
          username: username,
        },
        hooks: false,
      });

      const access_token = signToken({
        id: user.id,
        email: user.email,
      });

      console.log("USER>>>>>>", username, "<<<<<<<<<< USER");

      res.status(200).json({
        access_token,
        username,
      });
    } catch (err) {
      console.error("error Oauth", err);
      next(err);
    }
  }
}

module.exports = AuthController;
