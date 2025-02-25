import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../src/config/firebase.config';

/**
 * Retrieves user data by handle
 * 
 * @param {string} handle - User handle to look up
 * @returns {Promise<Object|null>} User data or null if not found
 */
export const getUserByHandle = async (handle) => {

   const snapshot = await get(ref(db, `users/${handle}`));
   if(snapshot.exists){
     return snapshot.val();
   }

};

/**
 * Creates a new user record
 * 
 * @param {string} handle - User handle
 * @param {string} uid - Firebase auth UID
 * @param {string} email - User email
 * @param {string} firstName - User first name
 * @param {string} lastName - User last name
 * @param {string} phone - User phone number
 * @param {string} role - User role
 * @returns {Promise} Firebase set promise
 */
export const createUserHandle = async (handle, uid, email, firstName, lastName, phone, role) => {
  const user = {
      handle,
      uid,
      email,
      firstName,
      lastName,
      phone,
      createdOn: new Date().toString(),
      role,
  };

  await set(ref(db, `users/${handle}`), user);
};

/**
 * Retrieves user data by Firebase UID
 * 
 * @param {string} uid - Firebase auth UID
 * @returns {Promise<Object|null>} User data or null if not found
 */
export const getUserData = async (uid) => {

    const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
    if(snapshot.exists){
        return snapshot.val();
      }

};

/**
 * Gets total count of users in the system
 * 
 * @returns {Promise<number>} Total user count
 */
export const getTotalUsers = async () => {
  const snapshot = await get(ref(db, 'users'));
  if (snapshot.exists()) {
    return Object.keys(snapshot.val()).length;
  }
  return 0;
};

/**
 * Retrieves all users with optional handle search filter
 * 
 * @param {string} search - Optional search term for filtering by handle
 * @returns {Promise<Array>} Array of user objects
 */
export const getAllUsers = async (search='') => {
  const snapshot = await get(ref(db, 'users'));
  if (snapshot.exists()) {
    if(search){
      const users = Object.values(snapshot.val());
      return users.filter(user=>user.handle.toLowerCase().includes(search.toLowerCase()))
    }
    return Object.values(snapshot.val());
  }
  return {};
};

/**
 * Retrieves all users with optional email search filter
 * 
 * @param {string} search - Optional search term for filtering by email
 * @returns {Promise<Array>} Array of user objects
 */
export const getAllUsersByEmail = async (search='') => {
  const snapshot = await get(ref(db, 'users'));
  if (snapshot.exists()) {
    if(search){
      const users = Object.values(snapshot.val());
      return users.filter(user=>user.email.toLowerCase().includes(search.toLowerCase()))
    }
    return Object.values(snapshot.val());
  }
  return {};
};

/**
 * Retrieves user data by Firebase UID
 * 
 * @param {string} uid - Firebase auth UID
 * @returns {Promise<Object|null>} User data or null if not found
 */
export const getUserById = async (uid) => {
  const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
  if (snapshot.exists()) {
    const users = snapshot.val();
    const userId = Object.keys(users)[0];
    return users[userId];
  }
  return null;
};

/**
 * Updates a user's role
 * 
 * @param {string} uid - Firebase auth UID
 * @param {string} newRole - New role to assign
 * @returns {Promise} Firebase update promise
 */
export const updateUserRole = async (uid, newRole) => {
  const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
  if (snapshot.exists()) {
    const userKey = Object.keys(snapshot.val())[0];
    await update(ref(db, `users/${userKey}`), { role: newRole });
  } else {
    throw new Error('User not found');
  }
};

/**
 * Updates user profile data
 * 
 * @param {string} handle - User handle
 * @param {Object} userData - Updated user data
 * @returns {Promise} Firebase update promise
 */
export const updateUser = async (handle, userData) => {
  const userRef = ref(db, `users/${handle}`);
  await update(userRef, userData);
};