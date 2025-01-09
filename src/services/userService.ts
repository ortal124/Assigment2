import UserModel, {IUser} from '../models/userModel';
import bcrypt from 'bcrypt';
class UserService {
  async createUser(userData: IUser) {
    const user = new UserModel( userData );
    return user.save();
  }
  async getUser(userId: string) {
    return UserModel.findById(userId);
  }
  async updateUser(userId: string, updateData: Partial<IUser>) {
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    return UserModel.findByIdAndUpdate(userId, updateData, { new: true });
  }

  async deleteUser(userId: string) {
    return UserModel.findByIdAndDelete(userId);
  }
}

export default new UserService();