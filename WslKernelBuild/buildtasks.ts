import fs from "fs";
import path from "path";
import { buildConfig, startBuildTask } from "./buildHandler/buildHandler";
export type buildTask = {
  name: string;
  link: string;
  config: string;
  status: "pending" | "building" | "done";
};
export class buildTasks {
  private buildConfig: buildConfig;
  private tasks: buildTask[] = [];
  private current: number = -1;
  public readFromFile = () => {
    let obj = JSON.parse(
      fs.readFileSync(__dirname + path.sep + "tasks.json", "utf-8")
    );
    this.tasks = <buildTask[]>obj.tasks;
    this.current = <number>obj.current;
    try {
      if (
        this.tasks[this.current].status === "pending" ||
        this.tasks[this.current].status === "building"
      ) {
        this.current -= 1;
        this.next();
      }
    } catch (e) {}
  };
  public saveToFile = () => {
    let obj = {
      current: this.current,
      tasks: this.tasks,
    };
    fs.writeFileSync(
      __dirname + path.sep + "tasks.json",
      JSON.stringify(obj),
      "utf-8"
    );
  };
  public next = () => {
    if (this.current + 1 === this.tasks.length) return;
    this.current += 1;
    this.tasks[this.current].status = "building";
    if (!this.buildConfig.check(this.tasks[this.current].config)) {
      this.tasks[this.current].name += " !Config invalid";
      this.tasks[this.current].status = "done";
      this.saveToFile();
      return;
    } else {
      startBuildTask(
        this.tasks[this.current].link,
        this.tasks[this.current].config
      ).then(() => {
        this.tasks[this.current].status = "done";
        this.saveToFile();
        this.next();
      });
    }
    this.saveToFile();
  };
  public newTask(name: string, link: string, config: string) {
    this.tasks.push({
      name: name,
      link: link,
      config: config,
      status: "pending",
    });
    if (
      this.tasks.length <= 1 ||
      this.tasks[this.tasks.length - 2].status === "done"
    )
      this.next();
    this.saveToFile();
    return;
  }
  public get() {
    return this.tasks;
  }
  constructor() {
    this.buildConfig = new buildConfig();
    this.readFromFile();
  }
}
