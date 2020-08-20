import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import * as db from '../src/models/db';
import { User } from '../src/models/user';

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Api
 *   description: api 요청 처리
 * definitions:
 *   Api_request:
 *     type: object
 *     required:
 *       - accesstoken
 *     properties:
 *       accesstoken:
 *         type: string
 *         description: 헤더에 Bearer type으로 존재
 *   Api_response:
 *     type: object
 *     required:
 *       - success
 *     properties:
 *       success:
 *         type: boolean
 *         description: 요청 성공 여부 - true, false
 *       res:
 *         type: object
 *         description: 요청한 정보
 *   Response_error:
 *     type: object
 *     required:
 *       - success
 *     properties:
 *       message:
 *         type: string
 *         description: 오류 사유
 *       success:
 *         type: boolean
 *         description: 요청 성공 여부
 */

/**
 * @swagger
 *  paths:
 *    /check:
 *      get:
 *        tags:
 *        - "Api"
 *        summary: "Login check and get userinfo"
 *        description: "Login check and get userinfo"
 *        consumes:
 *        - "application/json"
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - in: "header"
 *          name: "authroization"
 *          description: "발급받은 jwt accesstoken"
 *          required: true
 *          schema:
 *            $ref: "#/definitions/Api_request"
 *        responses:
 *          200:
 *            description: "로그인이 되어있는 유저에 대한 유저 정보"
 *            schema:
 *              $ref: "#/definitions/Api_response"
 *          403:
 *            description: "로그인이 되어있지 않은 유저에 대한 에러메시지"
 *            schema:
 *              $ref: "#/definitions/Response_error"
 */

router.get('/check', (req: express.Request, res: express.Response) => {
  db.readUser(req.decoded.username)
    .then(users => {
      const { _id, __v, password, ...userinfo } = users[0].toObject();
      res.json({
        success: true,
        userinfo
      });
    })
    .catch(err => {
      res.json({ success: false, message: err.message });
    });
});

/**
 * @swagger
 *  paths:
 *    /nickname:
 *      get:
 *        tags:
 *        - "Api"
 *        summary: "nickname 변경"
 *        description: "nickname 변경"
 *        consumes:
 *        - "application/json"
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - in: "header"
 *          name: "authroization"
 *          description: "발급받은 jwt accesstoken"
 *          required: true
 *          schema:
 *            $ref: "#/definitions/Api_request"
 *        - in: "body"
 *          name: "nickname"
 *          description: "새로 지은 nickname"
 *          required: true
 *          schema:
 *            $ref: "#/definitions/Api_request"
 *        responses:
 *          200:
 *            description: "로그인이 되어있는 유저에 대한 요청 성공"
 *            schema:
 *              $ref: "#/definitions/Api_response"
 *          403:
 *            description: "로그인이 되어있지 않은 유저에 대한 에러메시지"
 *            schema:
 *              $ref: "#/definitions/Response_error"
 */
router.post('/nickname', (req: express.Request, res: express.Response) => {
  db.readUser(req.decoded.username)
    .then(users => {
      console.log(<User>users[0]);
      console.log(typeof req.body.nickname);
      db.updateNickname(<User>users[0], req.body.nickname).then(() => {
        res.json({ success: true });
      });
    })
    .catch(err => {
      res.json({ success: false, message: err.message });
    });
});

export default router;
