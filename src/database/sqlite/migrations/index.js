const connectDb = require("../../sqlite");

const createUsers = require("./createUsers");

async function createTables() {
  const schemas = [
    createUsers,
  ].join("");

  connectDb()
  .then((db) => { db.exec(schemas) })
  .catch((err) => {
    console.error(err);
  });
}

module.exports = createTables;