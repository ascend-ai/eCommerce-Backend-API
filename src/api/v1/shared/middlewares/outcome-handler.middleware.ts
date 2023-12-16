import {
  NextFunction,
  Request,
  Response
} from 'express';
import {
  CustomError,
  CustomSuccess
} from '../utility-classes';
import {
  ResponseDataInterface
} from '../interfaces';

export const outcomeHandler = (result: CustomSuccess | CustomError, req: Request, res: Response, next: NextFunction) => {
  if (result instanceof CustomSuccess) {
    res
      .status(result.statusCode)
      .json(<ResponseDataInterface>{
        success: true,
        message: null,
        data: result.data
      });
  } else if (result instanceof CustomError) {
    res
      .status(result.statusCode)
      .json(<ResponseDataInterface>{
        success: false,
        message: result.message,
        data: null
      });
  }
  next();
};
