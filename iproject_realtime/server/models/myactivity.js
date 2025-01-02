"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MyActivity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MyActivity.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
    }
  }
  MyActivity.init(
    {
      name: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MyActivity",
    }
  );

  return MyActivity;
};
