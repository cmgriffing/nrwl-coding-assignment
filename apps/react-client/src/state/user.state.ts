import { atom } from 'jotai';
import { User } from '@acme/shared-models';

export const usersState = atom<User[]>([]);
export const usersByIdState = atom((get) => {
  const users = get(usersState);

  const usersById = users.reduce((usersMap, user) => {
    usersMap[user.id] = user;
    return usersMap;
  }, {} as Record<number, User>);

  return usersById;
});
