import UserModel from "../models/user";
import AccountVerifyModel from "../models/accountVerified";
import AuthConfirmationModel from "../models/accountConfirmation";
import AccountTokenModel from "../models/accountToken";
import Auths from "./auths";
import UserProfile from "./userProfiles";

import _ from "lodash";

class Users {
  static getAll(query) {
    return UserModel.find(query).exec();
  }

  static getById(id) {
    return UserModel.findOne({_id: id}).exec();
  }

  static createAccountVerify(data) {
    return AccountVerifyModel.create(data);
  }
  static createAccountConfirmation(data) {
    return AuthConfirmationModel.create(data);
  }
  static createAccountToken(data) {
    return AccountTokenModel.create(data);
  }

  static async create(data) {
    try {
      const user = await UserModel.create(data);
      data.userId = user._id;
      const newData = {userId: user._id};
      const profile = await UserProfile.create(data);
      await Users.createAccountVerify(newData);
      const userConfirmation = await Users.createAccountConfirmation(newData);
      await Users.createAccountToken(newData);

      user.userProfileId = profile._id;
      user.save();
      userConfirmation.key = Auths.createTokenUserConfirmation(user);
      userConfirmation.save();
      return user;

    } catch (error) {
      return error;
    }
  }

  static update(id, data) {
    return UserModel.findById(id)
      .exec()
      .then(user => {
        _.forEach(data, (update, key) => {
          user[key] = update;
        });
        return user.save();
      });
  }

  static remove(id) {
    return UserModel.findByIdAndRemove({_id: id}).exec();
  }

  static list({skip = 0, limit = 50} = {}) {
    return UserModel.find()
      .sort({createdAt: -1})
      .skip(Number(skip))
      .limit(Number(limit))
      .exec();
  }

}

export default Users;
