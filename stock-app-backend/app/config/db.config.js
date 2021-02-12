module.exports = {
    HOST: "localhost",
    // USER: "user1",
    // PASSWORD: "password123",
    USER: "root",
    PASSWORD: "Meghali01/12",
    DB: "pr_image",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
