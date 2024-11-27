module.exports = (sequelize, DataTypes) => {
    const user_favorites = sequelize.define('user_favorites', {

      


    }, {
        timestamps: false
    });

    return user_favorites;
};