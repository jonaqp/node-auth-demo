import mongoose, {Schema} from 'mongoose';
import PROVIDERS from '../graphql/emun/const_provider';

const SocialAppSchema = new Schema(
  {
    provider: {
      type: String,
      enum: PROVIDERS,
      default: ''
    },
    name: {type: String, default: ''},
    secret: {type: String, default: ''},
    key: {type: String, default: ''}
  },
  {timestamps: true}
);


SocialAppSchema.pre('save', function (next) {
  const currentDate = new Date();
  if (!this.updatedAt) {
    this.updatedAt = currentDate;
  }
  return next();
});


let SocialAppModel;

try {
  SocialAppModel = mongoose.model('socialApp','socialApp');
} catch (e) {
  SocialAppModel = mongoose.model('socialApp', SocialAppSchema, 'socialApp');
}

export default SocialAppModel;
