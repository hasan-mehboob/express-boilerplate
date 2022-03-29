// const swaggerDocument = require(`../swagger/openApi.js`);
require("./libs/sentry.lib");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
var session = require("express-session");
app.use(session({ secret: "SECRET", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());

global.messages = require("../config/messages");
global.emailConstraints = require("../config/emailConstraints");
global.dataConstraint = require("../config/data_constraints");

require("./middlewares");
require("./services");
require("./modules");
require("../config/strategies");

/**
 * Handle unhandle exception
 */
app.use(sentry.Handlers.errorHandler());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res
    .status(err.status || 500)
    .send({ status: err.status, message: err.message, data: {} });
  // res.json({ status: err.status || 500, message: err.message });
});
