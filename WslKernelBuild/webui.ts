import { Express } from "express";
import { Logger } from "log4js";
import ejs from "ejs";
import { buildConfig as bc } from "./buildHandler/buildHandler";
import { buildTasks as ts } from "./buildtasks";

let webUi = (app: Express, log: Logger) => {
  let buildConfig = new bc();
  let buildTasks=new ts();
  app.get("/", async (req, res) => {
    res.send(
      await ejs.renderFile(__dirname + "/layouts/index.ejs", {
        configs: buildConfig.get(),
      })
    );
  });

  app.get("/tasks", async(req, res)=>{
    res.send(
      await ejs.renderFile(__dirname+"/layouts/tasks.ejs", {tasks:buildTasks.get()})
    )
  })

  app.post("/submit", async (req, res) => {
    if (req.body.config === "config...") {
      res.status(400).send("You cannot select 'config...'.");
      return;
    }
    buildTasks.newTask(req.body.name, req.body.link, req.body.config);
    res.send('success');
  });
};

export default webUi;
