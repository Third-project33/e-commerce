module.exports = (sequelize, DataTypes) => {
    const cart = sequelize.define('cart', {
      totalItems: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
       
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
         
        }
    }, {
        timestamps: false
    });
    return cart;
};