import {
  NextFunction,
  Response
} from 'express';
import {
  AddressInterface,
  CustomError,
  CustomSuccess,
  DEFAULT_SORT_COLUMN,
  DEFAULT_SORT_DIRECTION,
  EditUserBasicDetailsDto,
  GetUserAuthInfoRequestInterface,
  Pagination,
  SortDirection,
  USER_SORTABLE_COLUMNS,
  UserDocument,
  UserFilterCriteriaDto,
  UserRole,
  convertStringIdsToObjectId,
  isSortStringValid,
  isValidArrayOfStrings,
  merge,
  retrieveSortInfo
} from '../shared';
import {
  UserModel
} from '../data-models';
import mongoose, {
  ClientSession,
  FilterQuery,
  Types
} from 'mongoose';

export const getUser = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    let { userId }: any = req.params;
    userId = new Types.ObjectId(userId);

    const isLoggedInUserAdminOrMod: boolean =  [
      UserRole.ADMIN,
      UserRole.MODERATOR
    ].includes((<UserDocument>req.loggedInUser)?.role);

    const isLoggedInUserSelf: boolean = (<UserDocument>req.loggedInUser)?._id.equals(userId);

    if (isLoggedInUserAdminOrMod || isLoggedInUserSelf) {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }
      return next(new CustomSuccess(user, 200));
    } else {
      return next(new CustomError(`Unauthorized access`, 401));
    }
  } catch (error: any) {
    return next(new CustomError(error.message, 400));
  }
};

export const editBasicDetailsOfUser = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    let { userId }: any = req.params;
    userId = new Types.ObjectId(userId);


    
    let user = await UserModel.findById(userId);
    
    if (!user) {
      throw new Error(`User with id ${userId} not found.`);
    }
    
    const isLoggedInUserSelf: boolean = (<UserDocument>req.loggedInUser)?._id.equals(userId);


    if (isLoggedInUserSelf) {
      const basicDetails = new EditUserBasicDetailsDto(user);
      const newBasicDetails = new EditUserBasicDetailsDto({});
      newBasicDetails.phoneNumber = req.body?.phoneNumber || basicDetails.phoneNumber;
      newBasicDetails.address = merge<AddressInterface, any>(basicDetails.address, req.body?.address);

      user.address = newBasicDetails.address;
      user.address.streetAddressLine1 = newBasicDetails.address.streetAddressLine1;
      user.address.streetAddressLine2 = newBasicDetails.address.streetAddressLine2;
      user.address.streetAddressLine3 = newBasicDetails.address.streetAddressLine3;
      user.address.city = newBasicDetails.address.city;
      user.address.state = newBasicDetails.address.state;
      user.address.country = newBasicDetails.address.country;
      user.address.postalCode = newBasicDetails.address.postalCode;
      user.phoneNumber = newBasicDetails.phoneNumber;
      await user.save();
      return next(new CustomSuccess(user, 200));
    } else {
      return next(new CustomError(`Unauthorized access`, 401));
    }
  } catch (error: any) {
    return next(new CustomError(error.message, 400));
  }
};

export const getUsers = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const {
      page,
      size,
      sort,
      role,
      search
    } = new UserFilterCriteriaDto(req.query);

    const filterQuery: FilterQuery<UserDocument> = {};
    const $andFilterQueryList: Array<FilterQuery<UserDocument>> = [];
    let sortColumn: string = DEFAULT_SORT_COLUMN;
    let sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;

    if (role) {
      $andFilterQueryList.push({ role });
    }

    if (typeof search === 'string' && search.length > 0) {
      $andFilterQueryList.push({ email: { $regex: search, $options: 'i' } });
    }

    if (typeof sort === 'string' && sort.length > 0) {
      if (isSortStringValid(sort, USER_SORTABLE_COLUMNS)) {
        ({ sortColumn, sortDirection } = retrieveSortInfo(sort));
      } else {
        throw new Error(`Sort string is of invalid format.`);
      }
    }

    if ($andFilterQueryList.length > 0) {
      filterQuery['$and'] = $andFilterQueryList;
    }

    const [ totalElements, orders ] = await Promise.all([
      UserModel.countDocuments(filterQuery),
      UserModel
        .find(filterQuery)
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
      orders,
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

export const getModeratorList = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const moderators = await UserModel.find({
      role: UserRole.MODERATOR
    });

    return next(new CustomSuccess(moderators, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};

export const updateModerators = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  const session: ClientSession = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      if (!req.body) {
        throw new Error(`Array of users not present`);
      }
  
      if (!isValidArrayOfStrings(req.body)) {
        throw new Error(`Invalid array of new similar products`)
      }
  
      const newModUserIds = convertStringIdsToObjectId(req.body);
  
      const currentModUsers = await UserModel.find({ role: UserRole.MODERATOR });
  
      const removeableModUsers: Array<UserDocument> = currentModUsers.filter(user => !newModUserIds.some(userId => userId.equals(user._id)));
  
      const unchangedModUsers: Array<UserDocument> = currentModUsers.filter(user => newModUserIds.some(userId => userId.equals(user._id)));
  
      const addableModUserIds: Array<Types.ObjectId> = newModUserIds.filter(userId => !currentModUsers.some(user => user._id.equals(userId)));
  
      await Promise.all(removeableModUsers.map(async (user) => {
        user.role = UserRole.CUSTOMER;
        await user?.save({ session });
      }));
  
      const newModUsers = [...unchangedModUsers];
  
      await Promise.all(addableModUserIds.map(async (userId) => {
        if (req.loggedInUser?._id.equals(userId)) {
          throw new Error(`Cannot add admin as moderator`);
        }
        const user = await UserModel.findById(userId);
        if (!user) {
          throw new Error(`User with id ${userId} not found`);
        }
        user.role = UserRole.MODERATOR;
        await user.save({ session });
        newModUsers.push(user)
      }));
  
      return next(new CustomSuccess(newModUsers, 200));
    });
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  } finally {
    await session.endSession();
  }
};
