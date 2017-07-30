import mongoose, {Schema} from 'mongoose';

const SocialAccountSchema = new Schema(
  {
    userId: {type: Schema.Types.ObjectId, ref: 'user'},
    socialAppId: {type: Schema.Types.ObjectId, ref: 'socialApp'},
    appId: {type: String}
  },
  {timestamps: true}
);


SocialAccountSchema.pre('save', function (next) {
  const currentDate = new Date();
  if (!this.updatedAt) {
    this.updatedAt = currentDate;
  }
  return next();
});


let SocialAccountModel;

try {
  SocialAccountModel = mongoose.model('socialAccount','socialAccount');
} catch (e) {
  SocialAccountModel = mongoose.model('socialAccount', SocialAccountSchema,'socialAccount');
}

export default SocialAccountModel;
