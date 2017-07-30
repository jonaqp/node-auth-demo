import mongoose, {Schema} from 'mongoose';

const AccountVerifySchema = new Schema(
  {
    userId: {type: Schema.Types.ObjectId, ref: 'user'},
    verified: {type: Boolean, default: false}
  },
  {timestamps: true}
);


AccountVerifySchema.pre('save', function (next) {
  const currentDate = new Date();
  if (!this.updatedAt) {
    this.updatedAt = currentDate;
  }
  return next();
});


let AccountVerifyModel;

try {
  AccountVerifyModel = mongoose.model('accountVerified','accountVerified');
} catch (e) {
  AccountVerifyModel = mongoose.model('accountVerified', AccountVerifySchema,'accountVerified');
}

export default AccountVerifyModel;


