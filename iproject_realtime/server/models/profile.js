"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  Profile.init(
    {
      username: DataTypes.STRING,
      gender: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Profile",
    }
  );

  return Profile;
};
