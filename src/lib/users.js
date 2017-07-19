import UserModel from '../models/user';
import _ from 'lodash'

class Users {
  static getAll(query) {
    return UserModel.find(query).exec();
  }
  static getById(id) {
    return UserModel.findOne({ _id: id }).exec();
  }
  static create(data) {
    return UserModel.create(data);
  }
  static update(id, data){
      return UserModel.findById(id)
          .exec()
          .then(user => {
              _.forEach(data, (update, key) => {
                  user[key] = update;
              });
              return user.save();
          })
  }
  static remove(id) {
    return UserModel.findByIdAndRemove({ _id: id }).exec();
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
