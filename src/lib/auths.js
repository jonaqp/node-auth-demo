import UserModel from '../models/user';
import jwt from 'jsonwebtoken';
import hashers from 'node-django-hashers';


const JWT_SECRET = process.env.JWT_SECRET || 'asdfghjklñ123456';

class Auths {
  static comparePassword(changePwd, currentPwd) {
    const hashName = hashers.identifyHasher(currentPwd);
    const hashAlgorithm = hashers.getHasher(hashName);
    const isPassword = hashAlgorithm.verify(changePwd, currentPwd);
    return Boolean(isPassword);
  }
  static verifyToken(token) {
    const decoded = jwt.verify(token, JWT_SECRET);
    const valid = (new Date().getTime() < decoded);

    if (!decoded || !valid) {
      throw new Error();
    }
    return decoded;
  }
  static createUserToken(user) {
    const expiresIn = '7d';
    return jwt.sign({
      id: user._id,
      email: user.email
    }, JWT_SECRET, {
      expiresIn,
    });

  }
  static createTokenUserConfirmation(user) {
    const expiresIn = '5d';
    return jwt.sign({
      id: user._id,
      verified: false
    }, JWT_SECRET, {
      expiresIn,
    });
  }
  static updateTokenUserConfirmation(user) {
    const expiresIn = '5d';
    return jwt.sign({
      id: user._id,
      verified: true
    }, JWT_SECRET, {
      expiresIn,
    });
  }

  static login(username, password) {
    const findUser = UserModel.findOne({username}).exec();
    let user = {};
    return findUser.then(data => {
      user = data;
      return UserModel.comparePassword(password, user.password);
    }).then(() => {
      return user;
    }).catch(() => {
      throw new Error('Username and password do not match.');
    });
  }

}

export default Auths;

