module.exports = (sequelize, DataTypes) => {
    const CartProducts = sequelize.define('CartProducts', {
quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1
            }
        },
        priceAtPurchase: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return CartProducts;
};