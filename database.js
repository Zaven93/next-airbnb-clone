const user = "postgres"
const password = "Grant#26082013"
const host = "localhost"
const database = "nextbnb"

const Sequelize = require("sequelize")

const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: "postgres",
  logging: false,
})

module.exports = sequelize
