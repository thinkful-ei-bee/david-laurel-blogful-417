'use strict';

const xss = require('xss');
const bcrypt = require('bcryptjs');

// eslint-disable-next-line no-useless-escape
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;



const UsersService = {
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (password.length > 71) {
      return 'Password must be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number and special character';
    }
  },
  hasUserWithUserName(db, user_name) {
    return db('blogful_users')
      .where({ user_name })
      .first()
      .then(user => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('blogful_users')
      .returning('*')
      .then(([user]) => user);
  },
  serializeUser(user) {
    if (user.nick_name) {
      return {
        id: user.id,
        full_name: xss(user.full_name),
        user_name: xss(user.user_name),
        nickname: xss(user.nick_name),
        date_created: new Date(user.date_created)
      };
    } else {
      return {
        id: user.id,
        full_name: xss(user.full_name),
        user_name: xss(user.user_name),
        date_created: new Date(user.date_created)
      };
    }  
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  }
};

module.exports = UsersService;