import mongoose, {Schema} from 'mongoose';

const AuthConfirmationSchema = new Schema(
  {
    userId: {type: Schema.Types.ObjectId, ref: 'user'},
    key: {type: String, default: ''},
    send: {type: String, default: ''}
  },
  {timestamps: true}
);


AuthConfirmationSchema.pre('save', function (next) {
  const currentDate = new Date();
  if (!this.updatedAt) {
    this.updatedAt = currentDate;
  }
  return next();
});



let AuthConfirmationModel;

try {
  AuthConfirmationModel = mongoose.model('accountConfirmation', 'accountConfirmation');
} catch (e) {
  AuthConfirmationModel = mongoose.model('accountConfirmation', AuthConfirmationSchema, 'accountConfirmation');
}

export default AuthConfirmationModel;


