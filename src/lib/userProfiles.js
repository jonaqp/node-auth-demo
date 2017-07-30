import UserProfileModel from "../models/userProfile";
import _ from "lodash";

class UserProfiles {
  static getAll(query) {
    return UserProfileModel.find(query).exec();
  }

  static getById(id) {
    return UserProfileModel.findOne({_id: id}).exec();
  }


  static create(data) {
    return UserProfileModel.create(data);
  }

  static update(id, data) {
    return UserProfileModel.findById(id)
      .exec()
      .then(user => {
        _.forEach(data, (update, key) => {
          user[key] = update;
        });
        return user.save();
      });
  }

  static remove(id) {
    return UserProfileModel.findByIdAndRemove({_id: id}).exec();
  }

  static list({skip = 0, limit = 50} = {}) {
    return UserProfileModel.find()
      .sort({createdAt: -1})
      .skip(Number(skip))
      .limit(Number(limit))
      .exec();
  }

}

export default UserProfiles;
