import { Request, Response, NextFunction } from 'express';
import httpResponse from '../utils/httpResponse';
import Joi from 'joi';

// Structure for data
interface requestBody {
  name: string;
  short_name: string;
  desc: string;
  order_no: number;
}

export default {
  post: (
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    req: Request<{}, {}, requestBody>,
    res: Response,
    next: NextFunction
  ) => {
    // Validation schema for incoming data
    const schema = Joi.object({
      name: Joi.string().min(3).max(75).required(),
      short_name: Joi.string().required(),
      desc: Joi.string().required(),
      order_no: Joi.number().integer().required()
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, short_name, desc, order_no } = req.body;
    const { error } = schema.validate(req.body);
    // Validation Error
    if (error) {
      return httpResponse(req, res, 400, error.message);
    }

    // Attach validated data to req object
    req.body = {
      name: req.body.name,
      short_name: req.body.short_name,
      desc: req.body.desc,
      order_no: req.body.order_no
    };
    next();
  }
};
