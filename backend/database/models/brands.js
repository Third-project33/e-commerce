module.exports =  (sequelize , DataTypes)  => {
    const brands = sequelize.define('brands', {
    
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    
    
        volume: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        logo: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    
        floorprice: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        day: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        owner: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        verified: {
            type: DataTypes.TINYINT(0),
            allowNull: true,
        },
        items: {
            type: DataTypes.TEXT,
            allowNull: true,
    
        },
    } , { timestamps: false })
    return brands
    }
    