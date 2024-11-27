module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('Users', {
        // User's first name with length limit
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        // User's last name with length limit
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        // Unique email for user identification
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,  // No duplicate emails allowed
            validate: {
                isEmail: true  // Must be valid email format
            }
        },
        // Hashed password (should be hashed before saving)
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // URL for user's avatar
        avatar: {
            type: DataTypes.STRING(1000),
            allowNull: true,
            validate: {
                isUrl: true  // Must be valid URL
            }
        },
        // URL for user's background image
        background: {
            type: DataTypes.STRING(1000),
            allowNull: true,
            validate: {
                isUrl: true  // Must be valid URL
            }
        },
        // User's bio or description
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        // Birth date components
        day: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 31  // Valid day range
            }
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1900,
                max: new Date().getFullYear()  // Can't be born in the future
            }
        },
        month: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isIn: [['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December']]  // Valid months only
            }
        },
        // User role for access control
        type: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user',
        }
    }, {
        timestamps: false  // Tracks createdAt and updatedAt
    });
    return User;
};