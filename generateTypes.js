"use strict";
require("dotenv").config();

/**
 * Add packages globally
 */
require("./src/globalPackage");
/**
 * Add Helper globally
 */

require("./src/helpers");
/**
 * Add Util globally
 */

require("./src/utils");
/**
 * Add Lib globally
 */
require("./src/libs");

// require('./src/libs');
require("./config/db");
/**
 * Add server setup
 */

require("./src/server");
const fs = require("fs");

let types = {
  models: {},
  middlewares: {},
  services: {},
  utils: {},
  libs: {},
  helpers: {},
  actions: {},
  validators: {},
};

// SCHEMA
for (let schemaFile of utils.globalFile.getGlobbedFiles("./**/*.schema.js")) {
  const schema = require(path.resolve(`${schemaFile}`))(
    models.sequelize,
    models.Sequelize.DataTypes
  );
  schema &&
    (types["models"][
      schema.name
    ] = `ReturnType<typeof import("${schemaFile.replace(".js", "")}")>`);
}

// MIDDLEWARES
var middlewaresDir = "/src/middlewares";
fs.readdirSync(__dirname + "/src/middlewares")
  .filter((file) => file.indexOf(".") !== 0 && file.indexOf("index.js") === -1)
  .forEach((file) => {
    types.middlewares[
      file.replace(".middleware.js", "")
    ] = `typeof import(".${path.join(
      middlewaresDir,
      file.replace(".js", "")
    )}")`;
  });

// SERVICES
var serivcesDir = "/src/services/";
fs.readdirSync(__dirname + serivcesDir)
  .filter((file) => file.indexOf(".") !== 0 && file.indexOf("index.js") === -1)
  .forEach((file) => {
    let service = require("./" + path.join(serivcesDir, file));
    // Object.assign(types.services, service);
    types.services[Object.keys(service)[0]] = `typeof import(".${path.join(
      serivcesDir,
      file.replace(".js", "")
    )}").${Object.keys(service)[0]}`;
  });

// UTILS
var utilsDir = "/src/utils";
fs.readdirSync(__dirname + utilsDir)
  .filter((file) => file.indexOf(".") !== 0 && file.indexOf("index.js") === -1)
  .forEach((file) => {
    types.utils[file.replace(".util.js", "")] = `typeof import(".${path.join(
      utilsDir,
      file.replace(".js", "")
    )}")`;
  });

// LIBS
var libsDir = "/src/libs";
fs.readdirSync(__dirname + libsDir)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file.indexOf("index.js") === -1 &&
      file.indexOf("lib.js") > -1
  )
  .forEach((file) => {
    types.libs[file.replace(".lib.js", "")] = `typeof import(".${path.join(
      libsDir,
      file.replace(".js", "")
    )}")`;
  });

// HELPERS
var helpersDir = "/src/helpers";
fs.readdirSync(__dirname + helpersDir)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file.indexOf("index.js") === -1 &&
      file.indexOf("helper.js") > -1
  )
  .forEach((file) => {
    types.helpers[
      file.replace(".helper.js", "")
    ] = `typeof import(".${path.join(helpersDir, file.replace(".js", ""))}")`;
  });

// ACTIONS
for (let actionFile of utils.globalFile.getGlobbedFiles("./**/*.action.js")) {
  const filePathArr = actionFile.split("/");
  const moduleName = filePathArr[filePathArr.length - 4];
  const requestName = filePathArr[filePathArr.length - 2];
  const fileName = filePathArr[filePathArr.length - 1].split(".")[1];
  const actions = require(path.resolve(`${actionFile}`));
  if (typeof actions === "object")
    for (const action in actions) {
      types.actions = {
        ...types.actions,
        [moduleName]: {
          ...types.actions?.[moduleName],
          [requestName]: {
            ...types.actions?.[moduleName]?.[requestName],
            [fileName]: {
              ...types.actions?.[moduleName]?.[requestName]?.[fileName],
              [action]: `typeof import("./${path.join(
                actionFile.replace(".js", "")
              )}").${action}`,
            },
          },
        },
      };
    }
  else
    types.actions = {
      ...types.actions,
      [moduleName]: {
        ...types.actions?.[moduleName],
        [requestName]: {
          ...types.actions?.[moduleName]?.[requestName],
          [fileName]: `typeof import("./${path.join(
            actionFile.replace(".js", "")
          )}")`,
        },
      },
    };
}
// VALIDATORS
let files = utils.globalFile.getGlobbedFiles("./**/*.validator.js");
for (let validatorFile of files) {
  const filePathArr = validatorFile.split("/");
  const moduleName = filePathArr[filePathArr.length - 2];
  const validators = require(`${validatorFile}`);
  // let files = utils.globalFile.getGlobbedFiles(
  //   `./**/${moduleName}/*.validator.js`
  // );
  let indexOfCurrentFile = files.findIndex((i) => i === validatorFile);
  let greaterThan1 = files.some((file, index) => {
    return (
      file.includes(`modules/${moduleName}`) && indexOfCurrentFile !== index
    );
  });
  if (greaterThan1) {
    for (const validator in validators) {
      types.validators = {
        ...types.validators,
        [moduleName]: {
          ...types.validators[moduleName],
          [validator]: `typeof import("./${path.join(
            validatorFile.replace(".js", "")
          )}").${validator}`,
        },
      };
    }
  } else {
    types.validators = {
      ...types.validators,
      [moduleName]: `typeof import("./${path.join(
        validatorFile.replace(".js", "")
      )}")`,
    };
  }
}

var text = `declare global {
  var express: typeof import("express");
  var app: ReturnType<typeof express>;
  const httpModule: typeof import("http");
  var httpServer = ReturnType<typeof httpModule.createServer>;
  var router: ReturnType<typeof express.Router>;
  var createError: typeof import("http-errors");
  var cookieParser: typeof import("cookie-parser");
  var logger: typeof import("morgan");
  var _: typeof import("lodash");
  var glob: typeof import("glob");
  var path: typeof import("path");
  var fs: typeof import("fs");
  var passport: typeof import("passport");
  var passportLocal: typeof import("passport-local");
  var passportJWT: typeof import("passport-jwt");
  var crypto: typeof import("crypto");
  var jwt: typeof import("jsonwebtoken");
  var jwtDecode: typeof import("jwt-decode");
  var moment: typeof import("moment");
  var bodyParser: typeof import("body-parser");
  var cors: typeof import("cors");
  var expressValidator: typeof import("express-validator");
  var sgMail: typeof import("@sendgrid/mail");
  var util: typeof import("util");
  var Sequelize: typeof import("sequelize");
  var Op: typeof import("sequelize").Op;
  var apolloServerExpress: typeof import("apollo-server-express");
  var apolloServerCore: typeof import("apollo-server-core");
  
  //MIDDLEWARES
  var middlewares: ${convertToCode(types.middlewares)};
  // SERVICES
  var services: ${convertToCode(types.services)};
  // MODELS
  var models: ${convertToCode(types.models)};
  
  // VALIDATORS
  var validators: ${convertToCode(types.validators)};
  
  // ACTIONS
  var actions: ${convertToCode(types.actions)};
  // LIBS
  var libs: ${convertToCode(types.libs)};
  // UTILS
  var utils: ${convertToCode(types.utils)};
  // HELPERS
  var helpers: ${convertToCode(types.helpers)};
  
  var messages: typeof import("./config/messages");
  var emailConstraints: typeof import("./config/emailConstraints");
  var dataConstraint: typeof import("./config/data_constraints");
  var emailConstraints: typeof import("./config/emailConstraints");
  var constants: typeof import("./config/constants");
  var auth: typeof import("./config/auth");
}
export {};
`;

function convertToCode(code) {
  return util
    .inspect(code, false, 2, false)
    .replace(/'/g, "")
    .replace(/,/g, ";");
}

fs.writeFile("./global.d.ts", text, (err) => {
  if (err) throw err;
  console.log("??? Generated types");
});
