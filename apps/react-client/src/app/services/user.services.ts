import { User } from '@acme/shared-models';
import { BaseService } from './base.service';

export class UserService extends BaseService {
  getUsers() {
    return this.axios.get('/users');
  }

  getUser(userId: string) {
    this.axios.get<User>(`/users/${userId}`);
  }
}
