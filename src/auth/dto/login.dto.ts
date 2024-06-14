/**
 * @swagger
 * components:
 *   schemas:
 *      Login:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Usuário
 *           example: 0202
 *         password:
 *           type: string
 *           description: Senha do usuário
 *           example: 1234
 *      ReturnLogin:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           description: JWT Token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMjQwMzQwMzQwMzQwMzQwMzQwMzQwMzQiLCJlbWFpbCI6Im1hdGhldXNiYXJhn
 */

export const loginDto = {
  name: {
    minLength: 1,
    maxLength: 4,
    required: "Name is required",
  },
  password: {
    minLength: 1,
    maxLength: 4,
    required: "Password is required",
  },
};

export interface LoginDto {
  name: string;
  password: string;
}
