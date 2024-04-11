import {
  BaseFilterCriteriaDto,
  CreateStallScheduleDto,
  CustomError,
  CustomSuccess,
  DEFAULT_SORT_COLUMN,
  DEFAULT_SORT_DIRECTION,
  GetUserAuthInfoRequestInterface,
  Pagination,
  STALL_SCHEDULE_SORTABLE_COLUMNS,
  SortDirection,
  isSortStringValid,
  retrieveSortInfo,
} from '../shared';
import {
  NextFunction,
  Response
} from 'express';
import {
  StallScheduleModel
} from '../data-models';

export const createStallSchedule = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const stallScheduleData = new CreateStallScheduleDto(req.body);
    const stallShedule = new StallScheduleModel(stallScheduleData);
    await stallShedule.save();

    return next(new CustomSuccess(stallShedule, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 400));
  }
};

export const getAllStallSchedules = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const {
      page,
      size,
      sort,
    } = new BaseFilterCriteriaDto(req.query);

    let sortColumn: string = DEFAULT_SORT_COLUMN;
    let sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;

    if (typeof sort === 'string' && sort.length > 0) {
      if (isSortStringValid(sort, STALL_SCHEDULE_SORTABLE_COLUMNS)) {
        ({ sortColumn, sortDirection } = retrieveSortInfo(sort));
      } else {
        throw new Error(`Sort string is of invalid format.`);
      }
    }

    const [ totalElements, stallSchedules ] = await Promise.all([
      StallScheduleModel.countDocuments(),
      StallScheduleModel
        .find()
        .skip(page * size)
        .limit(size)
        .sort({
          [sortColumn]: sortDirection
        })
    ]);

    let totalPages = Math.floor(totalElements / size);
    if ((totalElements % size) > 0) {
      totalPages += 1;
    }

    const pagination = new Pagination(
      stallSchedules,
      totalElements,
      totalPages,
      page,
      size,
      sortColumn,
      sortDirection
    );
    return next(new CustomSuccess(pagination, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};

export const editBasicDetailsOfStallSchedule = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    return next(new CustomSuccess(null, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};
