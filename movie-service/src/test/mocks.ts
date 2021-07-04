import jwt from 'jsonwebtoken';

type Role = 'basic' | 'premium';
type InvalidType = 'expiresIn' | 'secret' | 'userRole';

export const moviesList = ['User', 'Marvel', 'Tennis', 'Superman', 'Hero', 'Football'];

export const users = {
  basic: {
    id: 123,
    role: 'basic',
    name: 'Basic Thomas',
    username: 'basic-thomas',
    password: 'sR-_pcoow-27-6PAwCD8',
  },
  premium: {
    id: 434,
    role: 'premium',
    name: 'Premium Jim',
    username: 'premium-jim',
    password: 'GBLtTyq3E_UNjFnpo9m6',
  }
};

export const getToken =  (userRole: Role) => {
  const user = users[userRole];
  return 'Bearer ' + jwt.sign(
    {
      userId: user.id,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      issuer: 'https://www.netguru.com/',
      subject: `${user.id}`,
      expiresIn: 30 * 60,
    }
  );
};

export const getInvalidToken = (invalidType: InvalidType) => {
  const user = users.basic;
  return 'Bearer ' + jwt.sign(
    {
      role: invalidType === 'userRole' ? 'invalid' : user.role,
    },
    invalidType === 'secret' ? 'some_another_value' : process.env.JWT_SECRET as string,
    {
      issuer: 'https://www.netguru.com/',
      subject: `${user.id}`,
      expiresIn: invalidType === 'expiresIn' ? 0 : 30 * 60,
    }
  );
};
