module.exports = function () {
      var common = require("./common");
      var database = require("./database");
      var config = Object.assign(database, common);
      return config;
}();