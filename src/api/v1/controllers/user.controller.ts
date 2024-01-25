import {
  NextFunction,
  Response
} from 'express';
import {
  AddressInterface,
  CustomError,
  CustomSuccess,
  EditUserBasicDetailsDto,
  GetUserAuthInfoRequestInterface,
  Pagination,
  UserDocument,
  UserFilterCriteriaDto,
  UserInterface,
  UserRole,
  convertStringIdsToObjectId,
  isValidArrayOfStrings,
  merge
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
      newBasicDetails.address = merge<AddressInterface>(basicDetails.address, req.body?.address);

      user.address = newBasicDetails.address;
      user.address.streetAddressLine1 = newBasicDetails.address.streetAddressLine1;
      user.address.streetAddressLine2 = newBasicDetails.address.streetAddressLine2;
      user.address.streetAddressLine3 = newBasicDetails.address.streetAddressLine3;
      user.address.city = newBasicDetails.address.city;
      user.address.state = newBasicDetails.address.state;
      user.address.country = newBasicDetails.address.state;
      user.address.state = newBasicDetails.address.country;
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
      role,
      search
    } = new UserFilterCriteriaDto(req.query);

    const filterQueryList: Array<FilterQuery<UserInterface>> = [];

    if (role) {
      filterQueryList.push({ role });
    }

    if (typeof search === 'string' && search.length > 0) {
      filterQueryList.push({ email: { $regex: search, $options: 'i' } });
    }


    let totalElements: number;
    let totalPages: number;
    let users;

    if (filterQueryList.length > 0) {
      totalElements = await UserModel.countDocuments({
        $and: filterQueryList
      });
  
      totalPages = Math.floor(totalElements / size);
      if ((totalElements % size) > 0) {
        totalPages += 1;
      }
  
      users = await UserModel
        .find({
          $and: filterQueryList
        })
        .skip(page * size)
        .limit(size);
    } else {
      totalElements = await UserModel.countDocuments();
  
      totalPages = Math.floor(totalElements / size);
      if ((totalElements % size) > 0) {
        totalPages += 1;
      }
  
      users = await UserModel
        .find()
        .skip(page * size)
        .limit(size);
    }

    const pagination = new Pagination(
      users,
      totalElements,
      totalPages,
      page,
      size
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
  session.startTransaction();
  try {

    if (!req.body) {
      throw new Error(`Array of users not present`);
    }

    if (!isValidArrayOfStrings(req.body)) {
      throw new Error(`Invalid array of new similar products`)
    }

    const newModUserIds = convertStringIdsToObjectId(req.body);

    const currentModUsers = await UserModel.find({ role: UserRole.MODERATOR });

    const removeableModUsers = currentModUsers.filter(user => {
      return !newModUserIds.some(userId => userId.equals(user._id));
    });

    const addableModUserIds = newModUserIds.filter(userId => {
      return !currentModUsers.some(user => user._id.equals(userId));
    });

    for (let user of removeableModUsers) {
      user.role = UserRole.CUSTOMER;
      await user?.save({ session });
    }

    const newModUsers = [];

    for (let userId of addableModUserIds) {
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
    }

    await session.commitTransaction();
    await session.endSession();
    return next(new CustomSuccess(newModUsers, 200));
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(new CustomError(error.message, 500));
  }
};
