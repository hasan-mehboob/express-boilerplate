"use strict";
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const db = {};

let sequelize;
(async () => {
  try {
    sequelize = new Sequelize(
      env === "production"
        ? process.env.DATABASE_URL
        : process.env.TEST_DATABASE_URL,
      {
        logging: env !== "production",
      }
    );
    console.log("Connected to  database") + process.env.NODE_ENV;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
