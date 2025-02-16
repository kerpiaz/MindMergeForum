import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../src/config/firebase.config';

export const getUserByHandle = async (handle) => {

   const snapshot = await get(ref(db, `users/${handle}`));
   if(snapshot.exists){
     return snapshot.val();
   }

};

export const createUserHandle = async (handle, uid, email, firstName, lastName) => {
  const user = {
      handle,
      uid,
      email,
      firstName,
      lastName,
      createdOn: new Date().toString(),
  };

  await set(ref(db, `users/${handle}`), user);
};

export const getUserData = async (uid) => {

    const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
    if(snapshot.exists){
        return snapshot.val();
      }

};

export const getTotalUsers = async () => {
  const snapshot = await get(ref(db, 'users'));
  if (snapshot.exists()) {
    return Object.keys(snapshot.val()).length;
  }
  return 0;
};

export const getAllUsers = async () => {
  const snapshot = await get(ref(db, 'users'));
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};

export const getUserById = async (uid) => {
  const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
  if (snapshot.exists()) {
    const users = snapshot.val();
    const userId = Object.keys(users)[0];
    return users[userId];
  }
  return null;
};