var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var multer = require("multer");
const bodyParser = require("body-parser");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var zipRouter = require("./routes/zip");
var multizipRouter = require("./routes/multizip");
var listRouter = require("./routes/list");
var uploadRouter = require("./routes/upload");
var deleteRouter = require("./routes/delete");
var folderdownloadRouter = require("./routes/folderdownload");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/zip", zipRouter);
app.use("/multizip", multizipRouter);
app.use("/list", listRouter);
app.use("/upload", uploadRouter);
app.use("/delete", deleteRouter);
app.use("/folderdownload", folderdownloadRouter)

app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Expre1111ss" });
});

var origins = {
  origin: ["http://localhost:9000"],
  optionsSuccessStatus: 200,
  credentials: false,
};
app.use(cors(origins));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
