import mongoose, {Schema} from 'mongoose';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';
import hashers from 'node-django-hashers';
import httpStatus from 'http-status';
import APIError from '../utils/api-error';

const JWT_SECRET = process.env.JWT_SECRET || 'asdfghjklñ123456';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required!'],
      trim: true,
      validate: {
        validator (email) {
          const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i;
          return emailRegex.test(email);
        },
        message: '{VALUE} is not a valid email!'
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
      trim: true,
      minlength: [6, 'Password need to be longer!'],
      validate: {
        validator (password) {
          return password.length >= 6 && password.match(/\d+/g);
        }
      }
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false
    },

  },
  {timestamps: true}
);

UserSchema.plugin(uniqueValidator, {
  message: '{VALUE} already taken!'
});


UserSchema.pre('save', function (next) {
  const currentDate = new Date();
  const user = this;
  if (!this.updatedAt) {
    this.updatedAt = currentDate;
  }

  if (!user.isModified('password')) {return next();}

  const h = new hashers.PBKDF2PasswordHasher();
  user.password = h.encode(user.password, h.salt());
  return next();

});


UserSchema.methods = {
  comparePassword(changePwd, currentPwd) {
    const hashName = hashers.identifyHasher(currentPwd);
    const hashAlgorithm = hashers.getHasher(hashName);
    const isPassword = hashAlgorithm.verify(changePwd, currentPwd);
    return Boolean(isPassword);
  },
  createUserToken(user) {
    const expiresIn = 900000000;
    return jwt.sign({
      id: user._id,
      email: user.email
    }, JWT_SECRET, {
      expiresIn,
    });

  },
  toAuthJSON () {
    return {
      _id: this._id,
      token: `JWT ${this.createUserToken()}`
    };
  }
};

UserSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then(user => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  list({skip = 0, limit = 50} = {}) {
    return this.find()
      .sort({createdAt: -1})
      .skip(Number(skip))
      .limit(Number(limit))
      .exec();
  }

};

let UserModel;

try {
  UserModel = mongoose.model('User');
} catch (e) {
  UserModel = mongoose.model('User', UserSchema);
}

export default UserModel;
