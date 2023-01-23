import { User } from '@acme/shared-models';
import { AxiosResponse } from 'axios';
import { BaseService } from './base.service';

export class UserService extends BaseService {
  cachedUsers: User[] = [];
  cachedUsersTimestamp = 0;

  async getUsers() {
    if (this.cachedUsersTimestamp < Date.now() - 30_000) {
      this.cachedUsersTimestamp = Date.now();
      return this.axios.get('/users').then((response) => {
        this.cachedUsers = response?.data;
        return response;
      });
    } else {
      return { data: this.cachedUsers, status: 304 } as AxiosResponse<User[]>;
    }
  }

  getUser(userId: string) {
    return this.axios.get<User>(`/users/${userId}`);
  }
}
