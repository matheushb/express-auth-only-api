import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exception/types/unauthorized.exception";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/constants";
import { UserRepository, UserService } from "../../user";
import { asyncErrorHandler } from "./async-error-handler.middleware";

const jwtRegex = /Bearer\s[a-zA-Z0-9-_=]+\.[a-zA-Z0-9-_=]+\.[a-zA-Z0-9-_=]+/;
const swaggerUrls = [
  "/api/",
  "/api",
  "/api/swagger-ui.css",
  "/api/swagger-ui-bundle.js",
  "/api/swagger-ui-standalone-preset.js",
  "/api/swagger-ui-init.js",
  "/api/swagger-ui-bundle.js.map",
  "/api/swagger-ui.css.map",
  "/api/swagger-ui-standalone-preset.js.map",
  "/api/favicon-32x32.png",
  "/api/favicon.ico",
];

type jwtDecodedPayload = {
  id: string;
  email: string;
  iat: number;
  exp: number;
};

const userService = new UserService(new UserRepository());

function jwtValidator(routes: string[] = []) {
  const validate = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (swaggerUrls.includes(req.url)) return next();
      if (routes.includes(req.url)) return next();

      const bearerToken = req.headers.authorization;

      if (!bearerToken || !jwtRegex.test(bearerToken)) {
        throw new UnauthorizedException("Invalid JWT Token");
      }

      const token = bearerToken.split(" ")[1];

      try {
        jwt.verify(token, JWT_SECRET);
      } catch (err) {
        throw new UnauthorizedException("Invalid JWT Token");
      }

      const decodedPayload = jwt.decode(token) as jwtDecodedPayload;

      try {
        await userService.findOne(decodedPayload.id);
      } catch (err) {
        throw new UnauthorizedException("Invalid JWT Token");
      }

      return next();
    },
  );

  return validate;
}

export { jwtValidator };
