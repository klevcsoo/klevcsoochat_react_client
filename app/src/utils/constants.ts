export const routes = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ACCOUNT_SETTINGS: '/dashboard/account',
  CREATE_CHATROOM: '/dashboard/create-chatroom',
  CHATROOM: '/dashboard/chatroom/:id',
  CHATROOM_SETTINGS: '/dashboard/chatroom/:id/settings'
};

export const regex = {
  WHITESPACE: /^\s+$/g,
  EMAIL: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
  CHATROOM_INVITECODE: /([a-z]|[A-Z]){5,12}/g,
  URL: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g
};

export const defaultChatroomPhoto = 'https://firebasestorage.googleapis.com/v0/b/klevcsoochat.appspot.com/o/default%2FDefaultChatroomPhoto.png?alt=media&token=0dace237-88fd-4ece-a2f9-540cf01c11d7';
export const defaultAccountPhoto = 'https://firebasestorage.googleapis.com/v0/b/klevcsoochat.appspot.com/o/default%2FDefaultAccountPhoto.png?alt=media&token=8de61378-711d-4dd4-8485-7fbcb7b5e0da';

export const targetResolution = [ 375, 812 ];
