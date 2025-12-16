import { BaseServices, type ModelType } from "@/modules/_shared";
import Model from "../models";

export const {
  existsById,
  exists,
  fetchAll,
  fetchOne,
  fetchById,
  createOne,
  updateById,
  updateOne,
  disableById,
  aggregate,
  aggregateWithoutPaginate,
  countDocuments,
  distinct,
  createMany,
} = BaseServices(Model as ModelType);
