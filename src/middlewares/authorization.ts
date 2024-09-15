// import response from '../utils/response';
// import { auth } from '../firebase';
import { NextFunction, Request, Response } from 'express';

const authorization = async (req: Request, res: Response, next: NextFunction) => {
  req.body.uid = '12345';
  next();
  return;
  // TODO validate token
  // if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
  //   return response({
  //     res,
  //     status: 401,
  //     error: true,
  //     message: 'No está autorizado para realizar esa operación',
  //   });
  // }
  // try {
  //   var t = req.headers.authorization.replace('Bearer ', '');
  //   const JWT = await auth.verifyIdToken(t);
  //   if (JWT) {
  //     req.body.uid = JWT.uid;
  //     next();
  //   } else {
  //     return response({
  //       res,
  //       status: 401,
  //       error: true,
  //       message: 'No está autorizado para realizar esa operación',
  //     });
  //   }
  // } catch (error) {
  //   return response({
  //     res,
  //     status: 500,
  //     error: true,
  //     message: 'Error al autenticar petición',
  //   });
  // }
};

export default authorization;
