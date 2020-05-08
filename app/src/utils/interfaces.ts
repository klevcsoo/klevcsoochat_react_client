export interface ChatroomMetadata {
  id: string;
  name: string;
  creator: string;
  created: number;
}

export interface AppNotificatonData {
  text: string;
  persistent: boolean;
  type: 'info' | 'error';
  onDismiss?: () => void;
}
