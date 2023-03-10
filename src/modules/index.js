/**
 *  Initailize all action
 */
global["actions"] = {};
for (let actionFile of utils.globalFile.getGlobbedFiles("./**/*.action.js")) {
  const filePathArr = actionFile.split("/");
  const moduleName = filePathArr[filePathArr.length - 4];
  const requestName = filePathArr[filePathArr.length - 2];
  const fileName = filePathArr[filePathArr.length - 1].split(".")[1];
  const actions = require(path.resolve(`${actionFile}`));
  global["actions"][moduleName] = {
    ...(global["actions"]?.[moduleName] && global["actions"]?.[moduleName]),
    [requestName]: {
      ...(global["actions"][moduleName]?.[requestName] &&
        global["actions"][moduleName]?.[requestName]),
      [fileName]: actions,
    },
  };
}
global["validators"] = {};
for (let validatorFile of utils.globalFile.getGlobbedFiles(
  "./**/*.validator.js"
)) {
  const filePathArr = validatorFile.split("/");
  const moduleName = filePathArr[filePathArr.length - 2];
  const validators = require(path.resolve(`${validatorFile}`));
  if (global["validators"][moduleName]) {
    Object.assign(global["validators"][moduleName], validators);
  } else {
    global["validators"][moduleName] = validators;
  }
}

/**
 *  Initailize routes
 */
// set root
app.get("/", (req, res, next) => {
  return res.json({
    status: 200,
    message: messages.success,
  });
});

//json validation
// app.use(
//   bodyParser.json({
//     type: "*/*",
//   })
// );

for (let routeFile of utils.globalFile.getGlobbedFiles("./**/*.route.js")) {
  const routeObj = require(path.resolve(`${routeFile}`));
  let version = routeFile.split("/")[routeFile.split("/").length - 2];
  if (typeof routeObj === "function") {
    app.use(`/api/${version}`, routeObj);
  } else if (routeObj.router) {
    app.use(`/api/${version}` || "/api/v1", routeObj.router);
  } else {
    throw `router is missing in  ${routeFile} file`;
  }
}
