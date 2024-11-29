module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        rarity: {
            type: DataTypes.ENUM('Secret Rare', 'Uncommon Rare', 'Ultra Rare'),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        
        },
        image: {
            type: DataTypes.STRING(10000),
            allowNull: false,
         
        },
        status: {
            type: DataTypes.ENUM('New', 'Available', 'Not Available'),
            allowNull: false,
            defaultValue: 'Available'
        },
     
        onSale: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        collection: {
            type: DataTypes.ENUM('Shoes', 'Dresses', 'Coats', 'Shirts', 'Pants'),
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        timestamps: false  
    });
    return Product;
};