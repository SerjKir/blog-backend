import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  fullName: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  passwordHash: {type: String, required: true},
  avatarUrl: {type: String, default: 'http://localhost:5000/uploads/android.jpg'}
}, {
  timestamps: true
})

export default mongoose.model('User', UserSchema)