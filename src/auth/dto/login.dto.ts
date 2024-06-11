/**
 * @swagger
 * components:
 *   schemas:
 *      Login:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: Email do usuário
 *           example: matheusbaraldi@mail.com
 *         password:
 *           type: string
 *           description: Senha do usuário
 *           example: string
 *      ReturnLogin:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           description: JWT Token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMjQwMzQwMzQwMzQwMzQwMzQwMzQwMzQiLCJlbWFpbCI6Im1hdGhldXNiYXJhn
 */

export const loginDto = {
  user: {
    minLength: 1,
    maxLength: 4,
    required: "User is required",
  },
  password: {
    minLength: 1,
    maxLength: 4,
    required: "Password is required",
  },
};

export interface LoginDto {
  email: string;
  password: string;
}
