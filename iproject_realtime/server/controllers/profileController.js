const { Profile } = require("../models");
const cloudinary = require("../utils/cloudinary");

class ProfileController {
  static async read(req, res, next) {
    try {
      const { userId } = req.loginInfo;

      const profile = await Profile.findOne({
        where: { userId },
      });

      if (!profile) throw { name: "NotFound", message: "Profile not found" };

      res.status(200).json({
        message: "Success read profile",
        profile,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { userId } = req.loginInfo;

      let profile = await Profile.findOne({ where: { userId } });

      if (!profile) throw { name: "NotFound", message: "Profile not found" };

      const { username, gender } = req.body;

      let imageUrl = profile.imageUrl;

      if (req.file) {
        const imageUpload = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ folder: "profile_pictures" }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
          uploadStream.end(req.file.buffer);
        });

        imageUrl = imageUpload.secure_url;
      }

      await Profile.update({ username, gender, imageUrl }, { where: { userId } });

      profile = await Profile.findOne({ where: { userId } });

      res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async post(req, res, next) {
    try {
      const { userId } = req.loginInfo;
      const { username, gender } = req.body;

      if (!req.file) throw { name: "BadRequest", message: "Image is required" };

      const imageUpload = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: "profile_pictures" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        uploadStream.end(req.file.buffer);
      });

      const profile = await Profile.create({
        username,
        gender,
        imageUrl: imageUpload.secure_url,
        userId,
      });

      res.status(201).json({
        message: "Profile created successfully",
        profile,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async patch(req, res, next) {
    try {
      const { userId } = req.loginInfo;

      let profile = await Profile.findOne({ where: { userId } });

      if (!profile) throw { name: "NotFound", message: "Profile not found" };

      if (!req.file) throw { name: "BadRequest", message: "Image is required" };

      const imageUpload = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: "profile_pictures" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        uploadStream.end(req.file.buffer);
      });

      await Profile.update({ imageUrl: imageUpload.secure_url }, { where: { userId } });

      profile = await Profile.findOne({ where: { userId } });

      res.status(200).json({
        message: "Profile image updated successfully",
        profile,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

module.exports = ProfileController;
