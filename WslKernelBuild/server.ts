import {
  configure as log4jsConfigure,
  getLogger as log4jsGetLogger,
} from "log4js";
import bodyParser from "body-parser";
import express from "express";
import WebUi from "./webui";

log4jsConfigure({
  appenders: {
    df: { type: "dateFile", filename: "logs/app.log", keepFileExt: true },
    console: { type: "console" },
  },
  categories: {
    default: {
      appenders: ["console"],
      level: "trace",
    },
    app: {
      appenders: ["console", "df"],
      level: "trace",
    },
  },
});
var log = log4jsGetLogger("app");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
WebUi(app, log4jsGetLogger("WebUI"));

app.listen(1337, () => {
  log.info(`Server started listen at localhost:1337`);
});
