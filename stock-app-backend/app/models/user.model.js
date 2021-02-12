module.exports = (sequelize, Sequelize) => {
    var User = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: false,
            primaryKey: true,
            default: 1
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            
            unique: {
                args: true,
                msg: 'Username already exists!'
            }
        },
        password: {
            type: Sequelize.STRING
        }
    });

    return User;
};