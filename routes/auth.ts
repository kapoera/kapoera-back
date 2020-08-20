import express from 'express';
import { Tokens, LoginInput } from '../utils/type';
import * as jwtUtils from '../utils/jwt';
import * as authUtils from '../utils/auth';
import * as db from '../src/models/db';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: auth 요청 처리
 * definitions:
 *   Auth_request:
 *     type: object
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *         description: body에 존재
 *       password:
 *         type: string
 *         description: body에 존재
 *   Auth_response:
 *     type: object
 *     required:
 *       - success
 *     properties:
 *       success:
 *         type: boolean
 *         description: 요청 성공 여부 - true, false
 *       accessToken:
 *         type: string
 *         description: 로그인에 필요한 accessToken
 *       refreshToken
 *         type: string
 *         description: accessToken 재발급에 필요한 refreshToken
 *       is_new
 *         type: boolean
 *         description: 처음 방문한 유저인지 아닌지 판별하기 위한 값
 *       userinfo
 *         type: object
 *         description: auth 요청한 유저에 대한 정보
 *       default_nickname
 *         type: string
 *         description: 기본으로 발급하는 닉네임
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
 *    /login:
 *      get:
 *        tags:
 *        - "Auth"
 *        summary: "send username, password and get tokens"
 *        description: "send username, password and get tokens"
 *        consumes:
 *        - "application/json"
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - in: "body"
 *          name: "username"
 *          description: "유저 이름"
 *          required: true
 *          schema:
 *            $ref: "#/definitions/Auth_request"
 *        - in: "body"
 *          name: "password"
 *          description: "패스워드"
 *          required: true
 *          schema:
 *            $ref: "#/definitions/Auth_request"
 *        responses:
 *          200:
 *            description: "로그인 성공한 유저에 대한 응답"
 *            schema:
 *              $ref: "#/definitions/Auth_response"
 *          200:
 *            description: "로그인 실패한 유저에 대한 에러메시지"
 *            schema:
 *              $ref: "#/definitions/Response_error"
 */
router.post('/login', (req: express.Request, res: express.Response) => {
  console.log(req.body);
  db.readUser(req.body.username).then(user => {
    console.log(user);
    const { _id, __v, password, ...userinfo } = user[0].toObject();
    if (user.length > 0) {
      jwtUtils
        .createTokens(user[0].username, user[0].nickname)
        .then((tokens: Tokens) => {
          console.log(tokens);
          res.json({
            success: true,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            is_new: false,
            default_nickname: 'hrouteryhroutery',
            userinfo: userinfo
          });
        })
        .catch(err => console.error(err));
    } else {
      db.createUser(<LoginInput>req.body)
        .then(saveUser => {
          console.log(saveUser);
          const { _id, __v, password, ...userinfo } = saveUser.toObject();
          jwtUtils
            .createTokens(saveUser.username, saveUser.nickname)
            .then((tokens: Tokens) => {
              res.json({
                success: true,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                is_new: true,
                default_nickname: 'hrouteryhroutery',
                userinfo: userinfo
              });
            })
            .catch(err => res.json({ success: false, message: err.message }));
        })
        .catch(err => {
          console.error(err);
          res.json({ success: false, message: err.message });
        });
    }
  });
});

/**
 * @swagger
 *  paths:
 *    /token:
 *      get:
 *        tags:
 *        - "Auth"
 *        summary: "send refreshtoken and revoke accesstoken"
 *        description: "send refreshtoken and revoke accesstoken"
 *        consumes:
 *        - "application/json"
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - in: "header"
 *          name: "refreshtoken"
 *          description: "재발급 토큰"
 *          required: true
 *          schema:
 *            $ref: "#/definitions/Auth_request"
 *        responses:
 *          200:
 *            description: "새로 발급한 accesstoken"
 *            schema:
 *              $ref: "#/definitions/Auth_response"
 *          200:
 *            description: "잘못된 재발급 토큰을 보낸 유저에 대한 에러메시지"
 *            schema:
 *              $ref: "#/definitions/Response_error"
 */
router.post('/token', (req: express.Request, res: express.Response) => {
  if (!req.headers.refreshtoken) {
    res.json({ success: false, message: 'no refresh token' });
  } else {
    if (jwtUtils.refreshTokens.includes(req.headers.refreshtoken)) {
      authUtils
        .tokenVerify(<string>req.headers.refreshtoken)
        .then(authUtils.revokeToken)
        .then(token => {
          res.json({ success: true, accessToken: token });
        })
        .catch(err => res.json({ success: false, message: err.message }));
    } else {
      res.json({ success: false, message: 'not appropriate token' });
    }
  }
});

export default router;
