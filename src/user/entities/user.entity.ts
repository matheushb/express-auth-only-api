/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do usuário
 *           example: Matheus Baraldi
 *         email:
 *           type: string
 *           description: Email do usuário
 *           example: matheusbaraldi@mail.com
 *         password:
 *           type: string
 *           description: Senha do usuário
 *         weight:
 *           type: integer
 *           description: Peso do usuário
 *           example: 80
 *     ReturnUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID do usuário
 *         name:
 *           type: string
 *           description: Nome do usuário
 *           example: Matheus Baraldi
 *         email:
 *           type: string
 *           description: Email do usuário
 *           example: matheusbaraldi@mail.com
 *         weight:
 *           type: integer
 *           description: Peso do usuário
 *           example: 80
 *         createdAt:
 *           type: string
 *           description: Data de criação do livro
 *           example: 2024-03-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           description: Data de atualização do livro
 *           example: 2024-03-01T00:00:00.000Z
 *     ReturnUserWithToken:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID do usuário
 *         name:
 *           type: string
 *           description: Nome do usuário
 *           example: Matheus Baraldi
 *         email:
 *           type: string
 *           description: Email do usuário
 *           example: matheusbaraldi@mail.com
 *         weight:
 *           type: integer
 *           description: Peso do usuário
 *           example: 80
 *         access_token:
 *           type: string
 *           description: JWT Token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMjQwMzQwMzQwMzQwMzQwMzQwMzQwMzQiLCJlbWFpbCI6Im1hdGhldXNiYXJhn
 *         createdAt:
 *           type: string
 *           description: Data de criação do livro
 *           example: 2024-03-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           description: Data de atualização do livro
 *           example: 2024-03-01T00:00:00.000Z
 */

export interface UserEntity {
  id: string;
  name: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}
