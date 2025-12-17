import * as services from "./services";
import { Application } from "express";

function run(app: Application) {}

export default {
  isPublished: true,
  name: "User",
  run,
  services,
};
