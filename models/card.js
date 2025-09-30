const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Card extends Model {
    toJSONSafe() {
      const { id, userId, brand, last4, expMonth, expYear, holderName, createdAt, updatedAt } = this.get({ plain: true });
      return { id, userId, brand, last4, expMonth, expYear, holderName, createdAt, updatedAt };
    }
  }

  Card.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last4: {
        type: DataTypes.STRING(4),
        allowNull: false,
        validate: {
          is: /^\d{4}$/,
        },
      },
      expMonth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'exp_month',
        validate: {
          min: 1,
          max: 12,
        },
      },
      expYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'exp_year',
      },
      holderName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'holder_name',
      },
    },
    {
      sequelize,
      modelName: 'Card',
      tableName: 'cards',
      underscored: true,
    }
  );

  return Card;
};