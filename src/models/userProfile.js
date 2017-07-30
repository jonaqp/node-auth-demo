import mongoose, {Schema} from 'mongoose';


const ProfileSchema = new Schema(
  {
    userId: {type: Schema.Types.ObjectId, ref: 'user'},
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    bio: {type: String, default: ''},
    birthday: {type: Date},
    picture: {type: String, default: ''},
    location: {type: String, default: ''},
    website: {type: String, default: ''},
    gender: {type: String, default: ''},
  },
  {timestamps: true}
);


ProfileSchema.pre('save', function (next) {
  const currentDate = new Date();
  if (!this.updatedAt) {
    this.updatedAt = currentDate;
  }
  return next();
});

let UserProfileModel;

try {
  UserProfileModel = mongoose.model('userProfile', 'userProfile');
} catch (e) {
  UserProfileModel = mongoose.model('userProfile', ProfileSchema, 'userProfile');
}

export default UserProfileModel;

