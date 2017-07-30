import mongoose, {Schema} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import hashers from 'node-django-hashers';

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
    userProfileId: {type: Schema.Types.ObjectId, ref: 'userProfile'}

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

  if (!user.isModified('password')) {
    return next();
  }

  const h = new hashers.PBKDF2PasswordHasher();
  user.password = h.encode(user.password, h.salt());
  return next();

});

let UserModel;

try {
  UserModel = mongoose.model('user', 'user');

} catch (e) {
  UserModel = mongoose.model('user', UserSchema, 'user');
}

export default UserModel;
