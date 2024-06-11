import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../exception/types/bad-request.exception";

const regexValidation = {
  email: {
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
};

function validate(schema: any) {
  const validation = (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const errors: string[] = [];
    const validatedBody: any = {};

    Object.keys(schema).forEach((item) => {
      const itemSchema = schema[item];

      if (itemSchema.required && !body[item]) {
        errors.push(itemSchema.required);
        return;
      }

      if (body[item] && itemSchema.min && body[item] < itemSchema.min)
        errors.push(`${item} must be at least ${itemSchema.min}`);

      if (body[item] && itemSchema.max && body[item] > itemSchema.max)
        errors.push(`${item} must be less than ${itemSchema.max}`);

      if (
        body[item] &&
        itemSchema.minLength &&
        body[item].length < itemSchema.minLength
      ) {
        errors.push(
          `${item} must have at least ${itemSchema.minLength} characters`,
        );
      }

      if (
        body[item] &&
        itemSchema.maxLength &&
        body[item].length > itemSchema.maxLength
      ) {
        errors.push(
          `${item} must have less than ${itemSchema.maxLength} characters`,
        );
      }

      if (
        itemSchema.required &&
        itemSchema.type === "date" &&
        isNaN(Date.parse(body[item]))
      )
        errors.push(`${item} must be a valid date`);

      if (
        itemSchema.required &&
        itemSchema.enum &&
        !itemSchema.enum.includes(body[item])
      )
        errors.push(`${item} must be one of ${itemSchema.enum.join(", ")}`);

      if (
        body[item] &&
        itemSchema.type === "email" &&
        !regexValidation.email.regex.test(body[item])
      ) {
        errors.push(`${item} must be a valid email`);
      }

      validatedBody[item] = body[item];
    });

    if (errors.length > 0) throw new BadRequestException(errors.join(", "));

    if (
      Object.keys(validatedBody).length === 0 ||
      Object.values(validatedBody).every((value: any) => value === undefined)
    )
      throw new BadRequestException("Missing required fields");

    req.body = validatedBody;

    return next();
  };

  return validation;
}

export { validate };
