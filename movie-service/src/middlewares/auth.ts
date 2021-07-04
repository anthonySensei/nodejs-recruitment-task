import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import roles from '../constants/roles';
import Movie from '../models/movie';

type FirstLast = 0 | 1;

/**
 * @returns Date equals to first day of month if the day parameter is 0.
 * @returns Date equals to last day of month if the day parameter is 1.
 *
 * @example
 * For example today is 03.07.2021
 * getFirstLastDay(0) // Thu Jul 01 2021 00:00:00
 * getFirstLastDay(1) // Sat Jul 31 2021 00:00:00
 */
const getFirstLastDay = (day: FirstLast): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + day, day === 0 ? 1 : 0);
};

// To avoid callbacks :)
const verifyToken = (token: string) => (
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => (
      err ? reject(err) : resolve(payload)
    ));
  })
);

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ message: 'User is not authenticated' });
  }

  try {
    const token = (authorization as string).split(' ')[1];
    res.locals.user = await verifyToken(token);

    if (!Object.values(roles).includes(res.locals.user?.role)) {
      return res.status(401).send({ message: 'User is not authorized' });
    }

    next();
  } catch (err) {
    console.error(`Authorization error: ${err.message}`);
    res.status(401).send({ message: 'Authorization error' });
  }
};

export const checkPackage =  async (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals;

  if (user.role === roles.BASIC) {
    try {
      const filter = { createdAt: { $gte: getFirstLastDay(0), $lte: getFirstLastDay(1) }, userId: user.userId };
      const totalBooksPerMonth = await Movie.countDocuments(filter);

      if (totalBooksPerMonth > 4) {
        return res.status(401).send({ message: `Your limit is over` });
      }
    } catch (err) {
      console.error(`Error counting books: ${err.message}`);
      return res.status(500).send({ message: 'Error occurred' });
    }
  }

  next();
};
