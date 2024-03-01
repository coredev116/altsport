import { getAuth } from "firebase-admin/auth";

export const clearFirebaseUsers = async (nextPageToken?: string) => {
  try {
    const userList = await getAuth().listUsers(100, nextPageToken);
    const userListIds = userList.users.map((user) => user.uid);
    await getAuth().deleteUsers(userListIds);

    if (userList.pageToken) {
      // there are additional pages, recursively delete
      return clearFirebaseUsers(userList.pageToken);
    }

    return true;
  } catch (error) {
    throw error;
  }
};

export const clearFirebaseEmailUsers = async (emails: string[]) => {
  try {
    const promises = emails.map(async (email) => {
      const user = await getAuth().getUserByEmail(email);
      return user.uid;
    });

    const userIds = await Promise.all(promises);

    await getAuth().deleteUsers(userIds);

    return true;
  } catch (error) {
    throw error;
  }
};
