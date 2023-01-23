import { useEffect, useRef } from 'react';
import { useAtom, SetStateAction } from 'jotai';
import { usersState } from '../state/user.state';
import { UserService } from '../services/user.services';
import { User } from '@acme/shared-models';

// This was used on both pages, so I abstracted it to a hook

export function useFetchedUsers(): [
  User[],
  (update: SetStateAction<User[]>) => void
] {
  const [users, setUsers] = useAtom(usersState);
  const userService = useRef(new UserService()).current;

  useEffect(() => {
    userService
      .getUsers()
      .then((fetchedTicketsResponse) => fetchedTicketsResponse?.data)
      .then(setUsers)
      .catch(() => {
        alert('Failure to fetch users.');
      });
  }, []);

  return [users, setUsers];
}
