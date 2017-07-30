import mongoose, {Schema} from 'mongoose';


const AccountTokenSchema = new Schema(
  {
    userId: {type: Schema.Types.ObjectId, ref: 'user'},
    accessToken: {type: String, default: ''},
    refreshToken: {type: String, default: ''},
  },
  {timestamps: true}
);


AccountTokenSchema.pre('save', function (next) {
  const currentDate = new Date();
  if (!this.updatedAt) {
    this.updatedAt = currentDate;
  }
  return next();
});


let AccountTokenModel;

try {
  AccountTokenModel = mongoose.model('accountToken','accountToken');
} catch (e) {
  AccountTokenModel = mongoose.model('accountToken', AccountTokenSchema,'accountToken');
}

export default AccountTokenModel;

