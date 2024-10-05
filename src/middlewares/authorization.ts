import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import response from '../utils/response';

const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_POOL_ID}/.well-known/jwks.json`,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

const authorization = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
    return response({
      res,
      status: 401,
      error: true,
      message: 'No está autorizado para realizar esa operación',
    });
  }

  const token = req.headers.authorization.replace('Bearer ', '');
  jwt.verify(
    token,
    getKey,
    {
      algorithms: ['RS256'],
    },
    (err, decoded) => {
      if (err) {
        return response({
          res,
          status: 401,
          error: true,
          message: 'No está autorizado para realizar esa operación',
        });
      }

      const uid = (decoded as any)['custom:id'];
      req.body.uid = uid;
      next();
    }
  );
};

export default authorization;
