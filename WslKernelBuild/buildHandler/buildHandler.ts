import { exec } from "child_process";
import fs from "fs";
import path from 'path';
export type buildConfigObj = Array<{ name: string }>;
export class buildConfig {
  private buildConfigObj: buildConfigObj = [];
  new(name) {
    this.buildConfigObj.push({ name: name });
  }
  get() {
    return this.buildConfigObj;
  }
  readFromFile() {
    this.buildConfigObj = <buildConfigObj>(
      JSON.parse(fs.readFileSync(__dirname + path.sep + "configs.json", "utf-8"))
    );
  }
  check(config) {
    return this.buildConfigObj.some((item) => item.name === config);
  }

  constructor(){
    this.readFromFile();
  }
}
export async function startBuildTask(link: string, name: string) {
  return new Promise((resolve, reject) => {
    exec(
      "bash " + __dirname + path.sep +`buildHandler.sh ${link} ${name}`,
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve(null);
        }
      }
    );
  });
}
