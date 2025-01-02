const { MyActivity } = require("../models");

class ActivityController {
  static async read(req, res, next) {
    try {
      const { userId } = req.loginInfo;

      const activities = await MyActivity.findAll({
        where: { userId },
      });

      res.status(200).json({
        message: "Success read activities",
        activities,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.loginInfo;

      const activity = await MyActivity.findOne({
        where: { id, userId },
      });

      if (!activity) {
        throw { name: "NotFound", message: "Activity not found or unauthorized" };
      }

      await activity.destroy();

      res.status(200).json({
        message: `Success delete activity with id ${id}`,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async generate(req, res, next) {
    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai");

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = "Give me Only One random activity suggestion that I can do today, and it would be really enjoyable.";

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(text);

      res.status(200).json(text);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { userId } = req.loginInfo;
      console.log(userId, "=========");

      const { name } = req.body;

      const newActivity = await MyActivity.create({
        name,
        userId,
      });

      res.status(201).json({
        message: "Activity Saved successfully",
        newActivity,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = ActivityController;
