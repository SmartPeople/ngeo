
import type { Action } from './types';

export const SET_USER = 'SET_USER';

export function setUser(user:string, token: string):Action {
  return {
    type: SET_USER,
    payload: [user, token],
  };
}
