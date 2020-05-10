export const routes = {
  HOME: '/',
  ACCOUNT_SETTINGS: '/account',
  CREATE_CHATROOM: '/create-chatroom',
  CHATROOM: '/chatroom/:id',
  CHATROOM_SETTINGS: '/chatroom/:id/settings'
};

export const regex = {
  WHITESPACE: /^\s+$/g,
  EMAIL: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
  CHATROOM_INVITECODE: /([a-z]|[A-Z]){5,12}/g
};
