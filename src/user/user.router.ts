import { Request, Response, Router } from "express";
import { asyncErrorHandler } from "../common/middlewares/async-error-handler.middleware";
import { UserController, UserRepository, UserService } from "./index";
import { validate } from "../common/middlewares/validation.middleware";
import { updateUserDto } from "./dto";

const userController = new UserController(
  new UserService(new UserRepository()),
);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Rotas para operações relacionadas a usuários
 */
const userRoutes = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna todos os usuários
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *        200:
 *          description: Lista de usuários retornada com sucesso
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/ReturnUser'
 * */
userRoutes.get(
  "/users",
  asyncErrorHandler(async (req: Request, res: Response) => {
    await userController.findAll(req, res);
  }),
);

/**
 * @swagger
 * /users/id/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser retornado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: usuário retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReturnUser'
 * */
userRoutes.get(
  "/users/id/:id",
  asyncErrorHandler(async (req: Request, res: Response) => {
    await userController.findOne(req, res);
  }),
);

/**
 * @swagger
 * /users/id/{id}:
 *   patch:
 *     summary: Atualiza um usuário existente pelo ID
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser atualizado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReturnUser'
 * */
userRoutes.patch(
  "/users/id/:id",
  validate(updateUserDto),
  asyncErrorHandler(async (req: Request, res: Response) => {
    await userController.update(req, res);
  }),
);

/**
 * @swagger
 * /users/id/{id}:
 *   delete:
 *     summary: Exclui um usuário existente pelo ID
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser excluído
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: usuário excluído com sucesso
 */
userRoutes.delete(
  "/users/id/:id",
  asyncErrorHandler(async (req: Request, res: Response) => {
    await userController.remove(req, res);
  }),
);

export default userRoutes;
