export interface ChatroomMetadata {
  id: string;
  name: string;
  creator: string;
  created: number;
  inviteCode?: string;
}

export interface ChatMessage {
  author: {
    id: string,
    name: string | null;
  },
  sent: number,
  type: 'text' | 'image',
  content: string;
}

export interface AppNotificatonData {
  text: string;
  persistent: boolean;
  type: 'info' | 'error';
  onDismiss?: () => void;
}

export interface AuthUserInfoUI {
  online: boolean,
  lastOnline: number,
  photo: string,
  username?: string,
  email: string;
}
