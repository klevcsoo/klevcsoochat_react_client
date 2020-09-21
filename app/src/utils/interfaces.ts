export interface ChatroomMetadata {
  id: string;
  name: string;
  creator: string;
  created: number;
  code?: string;
  photo: string;
}

export interface ChatMessage {
  mid: string;
  author: {
    id: string;
    name: string | null;
  };
  sent: number;
  type: 'text' | 'image';
  content: string;
  reactions?: ChatReaction[];
}

export interface ChatReaction {
  timestamp: number;
  reaction: 'heart' | 'laugh' | 'sad' | 'suprised' | 'like';
}

export interface AppNotificatonData {
  persistent: boolean;
  type: 'info' | 'error';
  onDismiss?: () => void;
}

export interface AuthUserInfoUI {
  online: boolean;
  lastOnline: number;
  photo: string;
  username: string;
}
