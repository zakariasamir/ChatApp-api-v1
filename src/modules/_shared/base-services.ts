// import type { Model, PopulateOptions } from "mongoose";

// const _addSelectionDates = (selection: any) => {
//   if (selection) {
//     if (Array.isArray(selection)) {
//       return selection.concat("createdAt", "updatedAt");
//     }

//     if (typeof selection === "object") {
//       return {
//         ...selection,
//         createdAt: 1,
//         updatedAt: 1,
//       };
//     }
//   }
//   return null;
// };

// export interface baseServiceDataPropI {
//   // FIXME
//   pipeline?: Array<object>;
//   context?: object;
//   id?: string;
//   query?: Record<string, any>;
//   sort?: object | string;
//   payload?: any;
//   selection?: string[] | object;
//   populate?: string[] | object | PopulateOptions | PopulateOptions[];
//   page?: number;
//   limit?: number;
//   originalUrl?: string;
// }

// export interface baseServiceConfigPropI {
//   throwIfNoResult?: boolean;
//   decorator?: (doc: any) => any;
// }

// type ModelType = Model<any>;

// const defaultConfig = {
//   throwIfNoResult: false,
//   decorator: (data: any) => data,
// };

// function _mergeDefaultConfig(config: baseServiceConfigPropI = defaultConfig) {
//   return {
//     ...defaultConfig,
//     ...config,
//   };
// }

// const fetchAll = async (
//   Model: ModelType,
//   data: baseServiceDataPropI,
//   config: baseServiceConfigPropI
// ) => {
//   const { query, sort, selection: _selection, page, limit, populate } = data;
//   const { throwIfNoResult, decorator } = _mergeDefaultConfig(config);

//   const selection = _addSelectionDates(_selection);

//   const options = {
//     select: selection,
//     populate,
//     projection: selection,
//     sort,
//     page: page || 1,
//     // lean the results
//     // in general, we don't care here about mongoose documents
//     lean: true,
//   } as any;

//   if (limit && limit >= 1) {
//     options.limit = limit ?? 10;
//   } else {
//     options.pagination = false;
//   }

//   const result = await Model.paginate(query, options);

//   if (result && result.docs) {
//     if (
//       result.docs?.length > 60 &&
//       ["production", "development"].includes(process.env.API_ENV)
//     ) {
//       let responseSize: string | number = 0;

//       try {
//         responseSize = Buffer.byteLength(JSON.stringify(result));
//       } catch (error) {}
//       try {
//         responseSize = _formatBytes(responseSize);
//       } catch (error) {}

//       try {
//         const queryContext = AsyncHook.getRequestContext();
//         LogtailLogger.warn(
//           `More than 60 docs returned. collection: ${Model?.modelName}, count: ${result.docs.length}`,
//           {
//             requestId: queryContext.requestId,
//             requestData: queryContext.data,
//             collection: Model?.modelName,
//             totalDocs: result.docs.length,
//             responseSize,
//             queryData: data as any,
//           }
//         );
//       } catch (error) {}
//     }

//     // Only run decorator if needed
//     if (decorator !== defaultConfig.decorator) {
//       return {
//         ...result,
//         docs: await Promise.all(result.docs.map(decorator)),
//       };
//     }

//     return result;
//   }

//   if (throwIfNoResult) {
//     throw Errors.entityDoesntExist(pluralize(Model.modelName));
//   }

//   return result;
// };

// const fetchById = async (
//   Model: ModelType,
//   data: baseServiceDataPropI,
//   config: baseServiceConfigPropI
// ) => {
//   const { id, selection: _selection, populate } = data;
//   const { throwIfNoResult, decorator } = _mergeDefaultConfig(config);

//   const selection = _addSelectionDates(_selection);

//   const result = await Model.findById(id)
//     .select(selection)
//     .populate(populate)
//     .lean({ virtuals: true });

//   if (result) {
//     return await decorator(result);
//   }

//   if (throwIfNoResult) {
//     throw Errors.entityDoesntExist(Model.modelName);
//   }

//   return result;
// };

// const fetchOne = async (
//   Model: ModelType,
//   data: baseServiceDataPropI,
//   config: baseServiceConfigPropI
// ) => {
//   const { query, sort, selection: _selection, populate } = data;
//   const { throwIfNoResult, decorator } = _mergeDefaultConfig(config);

//   const selection = _addSelectionDates(_selection);

//   const result = await Model.findOne(query)
//     .select(selection)
//     .populate(populate)
//     .sort(sort)
//     .lean({ virtuals: true });

//   if (result) {
//     return await decorator(result);
//   }

//   if (throwIfNoResult) {
//     throw Errors.entityDoesntExist(Model.modelName);
//   }

//   return result;
// };

// const createOne = async (
//   Model: ModelType,
//   data: baseServiceDataPropI,
//   config: baseServiceConfigPropI
// ) => {
//   const { payload, selection: _selection, populate } = data;

//   const { decorator } = _mergeDefaultConfig(config);

//   // const selection = _addSelectionDates(_selection);

//   const result = await Model.create(payload);

//   if (result) {
//     return await decorator(result);
//   }

//   return result;
// };

// const createMany = async (
//   Model: ModelType,
//   data: baseServiceDataPropI,
//   config: baseServiceConfigPropI
// ) => {
//   const {
//     payload,
//     query: options = {},
//     selection: _selection,
//     populate,
//   } = data;

//   const { decorator } = _mergeDefaultConfig(config);

//   // const selection = _addSelectionDates(_selection);

//   const result = await Model.insertMany(payload, options);

//   if (result) {
//     return await decorator(result);
//   }

//   return result;
// };

// const updateById = async (
//   Model: ModelType,
//   data: baseServiceDataPropI,
//   config: baseServiceConfigPropI
// ) => {
//   const { id, payload, selection: _selection, populate } = data;

//   const { decorator } = _mergeDefaultConfig(config);

//   const selection = _addSelectionDates(_selection);

//   const result = await Model.findByIdAndUpdate(id, payload, {
//     new: true,
//     runValidators: true,
//     lean: true,
//   })
//     .select(selection)
//     .populate(populate);

//   if (result) {
//     return await decorator(result);
//   }

//   return result;
// };

// const updateOne = async (
//   Model: ModelType,
//   data: baseServiceDataPropI,
//   config: baseServiceConfigPropI
// ) => {
//   const { query, payload, selection: _selection, populate } = data;

//   const { decorator } = _mergeDefaultConfig(config);

//   const selection = _addSelectionDates(_selection);

//   const result = await Model.findOneAndUpdate(query, payload, {
//     new: true,
//     runValidators: true,
//     lean: true,
//   })
//     .select(selection)
//     .populate(populate);

//   if (result) {
//     return await decorator(result);
//   }

//   return result;
// };

// const wrapHelper =
//   (Model: Model<any>, fn) =>
//   async (
//     data: baseServiceDataPropI,
//     config: baseServiceConfigPropI = defaultConfig
//   ) =>
//     fn(Model, data, config);

// function BaseServices(Model) {
//   return {
//     fetchAll: wrapHelper(Model, fetchAll),
//     fetchOne: wrapHelper(Model, fetchOne),
//     fetchById: wrapHelper(Model, fetchById),
//     createOne: wrapHelper(Model, createOne),
//     createMany: wrapHelper(Model, createMany),
//     updateById: wrapHelper(Model, updateById),
//     updateOne: wrapHelper(Model, updateOne),
//   };
// }

// export default BaseServices;
// export { BaseServices };

//----------------------------------------------------

import dotenv from "dotenv";
import type { Model, PopulateOptions, PipelineStage } from "mongoose";
import pluralize from "pluralize";
import * as Errors from "../../utils/errors";

dotenv.config();

// Type definitions for paginated models
// These types represent mongoose models extended with pagination plugins
type PaginateModel<T = any> = Model<T> & {
  paginate: (query?: any, options?: any) => Promise<any>;
};

type AggregatePaginateModel<T = any> = Model<T> & {
  aggregatePaginate: (aggregation: any, options?: any) => Promise<any>;
};

// Default Services
const _addSelectionDates = (
  selection: string[] | object | null | undefined
): string[] | object | null => {
  if (selection) {
    if (Array.isArray(selection)) {
      return selection.concat("createdAt", "updatedAt");
    }

    if (typeof selection === "object") {
      return {
        ...selection,
        createdAt: 1,
        updatedAt: 1,
      };
    }
  }
  return null;
};

function _formatBytes(bytes: number, decimals: number = 2): string {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export interface baseServiceDataPropI {
  // FIXME
  pipeline?: Array<object>;
  context?: object;
  id?: string;
  query?: Record<string, any>;
  sort?: object | string;
  payload?: any;
  selection?: string[] | object;
  populate?: string[] | object | PopulateOptions | PopulateOptions[];
  page?: number;
  limit?: number;
  originalUrl?: string;
}

export interface baseServiceConfigPropI {
  throwIfNoResult?: boolean;
  decorator?(data: any): any;
}

export type baseServiceFnI = (
  data: baseServiceDataPropI,
  config?: baseServiceConfigPropI
) => Promise<any>;

type ModelType = PaginateModel<any>;
type ModelAggregateType = AggregatePaginateModel<any>;

const defaultConfig = {
  throwIfNoResult: false,
  decorator: (data: any) => data,
};

function _mergeDefaultConfig(config: baseServiceConfigPropI = defaultConfig) {
  return {
    ...defaultConfig,
    ...config,
  };
}

const countDocuments = async (
  Model: ModelType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { query } = data;
  const { throwIfNoResult } = _mergeDefaultConfig(config);
  const count = await Model.countDocuments(query);

  if (throwIfNoResult && !count) {
    throw Errors.emptyEntityDocumentsCount(Model.modelName);
  }

  return count;
};

const existsById = async (
  Model: ModelType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { id: _id } = data;
  const { throwIfNoResult } = _mergeDefaultConfig(config);
  const doesExist = await Model.exists({ _id });

  if (throwIfNoResult && !doesExist) {
    throw Errors.entityDoesntExist(Model.modelName);
  }

  return doesExist;
};

const exists = async (
  Model: ModelType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { query } = data;
  const { throwIfNoResult } = _mergeDefaultConfig(config);

  const doesExist = await Model.exists(query || {});

  if (throwIfNoResult && !doesExist) {
    throw Errors.entityDoesntExist(Model.modelName);
  }

  return doesExist;
};

const distinct = async (
  Model: ModelType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { id, query } = data;
  const { decorator } = _mergeDefaultConfig(config);

  if (!id) {
    throw new Error("Field name (id) is required for distinct operation");
  }

  const result = await Model.distinct(id, query || {});

  if (result) {
    return await Promise.all(result.map(decorator));
  }

  // if (throwIfNoResult) {
  //   throw Errors.entityDoesntExist(Model.modelName);
  // }

  return result;
};

const fetchAll = async (
  Model: ModelType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { query, sort, selection: _selection, page, limit, populate } = data;
  const { throwIfNoResult, decorator } = _mergeDefaultConfig(config);

  const selection = _addSelectionDates(_selection);

  const options = {
    select: selection,
    populate,
    projection: selection,
    sort,
    page: page || 1,
    // lean the results
    // in general, we don't care here about mongoose documents
    lean: true,
  } as any;

  if (limit && limit >= 1) {
    options.limit = limit;
  } else {
    options.pagination = false;
  }

  const result = await Model.paginate(query, options);

  if (result && result.docs) {
    if (
      result.docs?.length > 60 &&
      ["production", "development"].includes(process.env.API_ENV || "")
    ) {
      let responseSize: string | number = 0;

      try {
        responseSize = Buffer.byteLength(JSON.stringify(result));
      } catch (error) {}
      try {
        responseSize = _formatBytes(responseSize);
      } catch (error) {}

      try {
        console.warn(
          `More than 60 docs returned. collection: ${Model?.modelName}, count: ${result.docs.length}`
        );
      } catch (error) {}
    }

    // Only run decorator if needed
    if (decorator !== defaultConfig.decorator) {
      return {
        ...result,
        docs: await Promise.all(result.docs.map(decorator)),
      };
    }

    return result;
  }

  if (throwIfNoResult) {
    throw Errors.entityDoesntExist(pluralize(Model.modelName));
  }

  return result;
};

const fetchById = async (
  Model: ModelType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { id, selection: _selection, populate } = data;
  const { throwIfNoResult, decorator } = _mergeDefaultConfig(config);

  const selection = _addSelectionDates(_selection);

  let query = Model.findById(id);
  if (selection) {
    query = query.select(selection as any);
  }
  if (populate) {
    query = query.populate(populate as any);
  }
  const result = await query.lean({ virtuals: true });

  if (result) {
    return await decorator(result);
  }

  if (throwIfNoResult) {
    throw Errors.entityDoesntExist(Model.modelName);
  }

  return result;
};

const fetchOne = async (
  Model: ModelType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { query, sort, selection: _selection, populate } = data;
  const { throwIfNoResult, decorator } = _mergeDefaultConfig(config);

  const selection = _addSelectionDates(_selection);

  let queryBuilder = Model.findOne(query || {});
  if (selection) {
    queryBuilder = queryBuilder.select(selection as any);
  }
  if (populate) {
    queryBuilder = queryBuilder.populate(populate as any);
  }
  if (sort) {
    queryBuilder = queryBuilder.sort(sort as any);
  }
  const result = await queryBuilder.lean({ virtuals: true });

  if (result) {
    return await decorator(result);
  }

  if (throwIfNoResult) {
    throw Errors.entityDoesntExist(Model.modelName);
  }

  return result;
};

const createOne = async (
  Model: ModelType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { payload, selection: _selection, populate } = data;

  const { decorator } = _mergeDefaultConfig(config);

  // const selection = _addSelectionDates(_selection);

  const result = await Model.create(payload);

  if (result) {
    return await decorator(result);
  }

  return result;
};

const createMany = async (
  Model: ModelType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const {
    payload,
    query: options = {},
    selection: _selection,
    populate,
  } = data;

  const { decorator } = _mergeDefaultConfig(config);

  // const selection = _addSelectionDates(_selection);

  const result = await Model.insertMany(payload, options);

  if (result) {
    return await decorator(result);
  }

  return result;
};

const updateById = async (
  Model: ModelType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { id, payload, selection: _selection, populate } = data;

  const { decorator } = _mergeDefaultConfig(config);

  const selection = _addSelectionDates(_selection);

  let query = Model.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    lean: true,
  });
  if (selection) {
    query = query.select(selection as any);
  }
  if (populate) {
    query = query.populate(populate as any);
  }
  const result = await query;

  if (result) {
    return await decorator(result);
  }

  return result;
};

const updateOne = async (
  Model: ModelType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { query, payload, selection: _selection, populate } = data;

  const { decorator } = _mergeDefaultConfig(config);

  const selection = _addSelectionDates(_selection);

  let queryBuilder = Model.findOneAndUpdate(query || {}, payload, {
    new: true,
    runValidators: true,
    lean: true,
  });
  if (selection) {
    queryBuilder = queryBuilder.select(selection as any);
  }
  if (populate) {
    queryBuilder = queryBuilder.populate(populate as any);
  }
  const result = await queryBuilder;

  if (result) {
    return await decorator(result);
  }

  return result;
};

const updateMany = async (
  Model: ModelType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { query, payload } = data;

  const { decorator } = _mergeDefaultConfig(config);

  const result = await Model.updateMany(query || {}, payload);

  if (result) {
    return await decorator(result);
  }

  return result;
};

const disableById = async (
  Model: ModelType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { id, selection: _selection, populate } = data;

  const selection = _addSelectionDates(_selection);

  let query = Model.findByIdAndUpdate(id, { isDisabled: true }, { new: true });
  if (selection) {
    query = query.select(selection as any);
  }
  if (populate) {
    query = query.populate(populate as any);
  }
  return query;
};

const deleteById = async (
  Model: ModelType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { id, selection: _selection, populate } = data;

  const selection = _addSelectionDates(_selection);

  let query = Model.findByIdAndDelete(id);
  if (selection) {
    query = query.select(selection as any);
  }
  if (populate) {
    query = query.populate(populate as any);
  }
  return query;
};

const deleteOne = async (
  Model: ModelType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { query, selection: _selection, populate } = data;

  const selection = _addSelectionDates(_selection);

  let queryBuilder = Model.findOneAndDelete(query || {});
  if (selection) {
    queryBuilder = queryBuilder.select(selection as any);
  }
  if (populate) {
    queryBuilder = queryBuilder.populate(populate as any);
  }
  return queryBuilder;
};

const deleteMany = async (
  Model: ModelType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { query } = data;

  return Model.deleteMany(query);
};

const aggregate = async (
  Model: ModelAggregateType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { pipeline, sort, page, limit } = data;
  const { decorator } = _mergeDefaultConfig(config);

  const options = {
    sort,
    page: page || 1,
  } as any;

  if (limit && limit >= 1) {
    options.limit = limit;
  } else {
    options.pagination = false;
  }

  const aggregation = Model.aggregate(pipeline as PipelineStage[]);
  const result = await Model.aggregatePaginate(aggregation, options);

  if (result && result.docs) {
    // FIXME (performance)
    return {
      ...result,
      docs: await Promise.all(result.docs.map(decorator)),
    };
  }

  return result;
};

const aggregateWithoutPaginate = async (
  Model: ModelAggregateType,
  data: baseServiceDataPropI,
  config: baseServiceConfigPropI
) => {
  const { pipeline, sort, page, limit } = data;
  const { decorator } = _mergeDefaultConfig(config);

  const options = {
    sort,
    page: page || 1,
  } as any;

  if (limit && limit >= 1) {
    options.limit = limit;
  } else {
    options.pagination = false;
  }

  const result = Model.aggregate(pipeline as PipelineStage[]);

  if (result) {
    return await decorator(result);
  }

  return result;
};

const wrapHelper =
  (Model: Model<any>, fn: any) =>
  async (
    data: baseServiceDataPropI,
    config: baseServiceConfigPropI = defaultConfig
  ) =>
    fn(Model, data, config);

function BaseServices(Model: ModelType) {
  return {
    countDocuments: wrapHelper(Model, countDocuments),
    existsById: wrapHelper(Model, existsById),
    exists: wrapHelper(Model, exists),
    fetchAll: wrapHelper(Model, fetchAll),
    fetchOne: wrapHelper(Model, fetchOne),
    fetchById: wrapHelper(Model, fetchById),
    createOne: wrapHelper(Model, createOne),
    createMany: wrapHelper(Model, createMany),
    updateById: wrapHelper(Model, updateById),
    updateOne: wrapHelper(Model, updateOne),
    updateMany: wrapHelper(Model, updateMany),
    disableById: wrapHelper(Model, disableById),
    deleteById: wrapHelper(Model, deleteById),
    deleteOne: wrapHelper(Model, deleteOne),
    aggregate: wrapHelper(Model, aggregate),
    aggregateWithoutPaginate: wrapHelper(Model, aggregateWithoutPaginate),
    deleteMany: wrapHelper(Model, deleteMany),
    distinct: wrapHelper(Model, distinct),
  };
}

export default BaseServices;
export { BaseServices };
