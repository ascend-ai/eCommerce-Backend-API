import {
  BaseFilterCriteriaDto,
  CreateStallScheduleDto,
  CustomError,
  CustomSuccess,
  DEFAULT_SORT_COLUMN,
  DEFAULT_SORT_DIRECTION,
  EditStallScheduleBasicDetailsDto,
  GetUserAuthInfoRequestInterface,
  Pagination,
  STALL_SCHEDULE_SORTABLE_COLUMNS,
  SortDirection,
  isSortStringValid,
  merge,
  retrieveSortInfo,
} from '../shared';
import {
  NextFunction,
  Response
} from 'express';
import {
  StallScheduleModel
} from '../data-models';
import { Types } from 'mongoose';

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

export const getStallSchedule = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    let { stallScheduleId }: any = req.params;
    stallScheduleId = new Types.ObjectId(stallScheduleId);

    const stallSchedule = await StallScheduleModel
      .findById(stallScheduleId);

    if (!stallSchedule) {
      throw new Error(`Stall schedule with id ${stallScheduleId} not found.`);
    }

    return next(new CustomSuccess(stallSchedule, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};

export const editBasicDetailsOfStallSchedule = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    let { stallScheduleId }: any = req.params;
    stallScheduleId = new Types.ObjectId(stallScheduleId);

    let stallSchedule = await StallScheduleModel
      .findById(stallScheduleId);
    
    if (!stallSchedule) {
      throw new Error(`Stall schedule with id ${stallScheduleId} not found.`);
    }

    const newBasicDetails = merge<EditStallScheduleBasicDetailsDto, any>(
      new EditStallScheduleBasicDetailsDto(stallSchedule),
      req.body
    );

    stallSchedule.venue = newBasicDetails.venue;
    stallSchedule.date = newBasicDetails.date;
    stallSchedule.openingTime = newBasicDetails.openingTime;
    stallSchedule.closingTime = newBasicDetails.closingTime;
    await stallSchedule.save();
    return next(new CustomSuccess(stallSchedule, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};

export const deleteStallSchedule = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    let { stallScheduleId }: any = req.params;
    stallScheduleId = new Types.ObjectId(stallScheduleId);

    const deletedStallSchedule = await StallScheduleModel
      .findByIdAndDelete(stallScheduleId);

    if (!deletedStallSchedule) {
      throw new Error(`Stall schedule with id ${stallScheduleId} not found.`);
    }

    return next(new CustomSuccess(deletedStallSchedule, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};
