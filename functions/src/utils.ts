export const defaultAccountPhoto = 'https://firebasestorage.googleapis.com/v0/b/klevcsoochat.appspot.com/o/default%2FDefaultAccountPhoto.png?alt=media&token=8de61378-711d-4dd4-8485-7fbcb7b5e0da';
export const defaultChatroomPhoto = 'https://firebasestorage.googleapis.com/v0/b/klevcsoochat.appspot.com/o/default%2FDefaultChatroomPhoto.png?alt=media&token=0dace237-88fd-4ece-a2f9-540cf01c11d7';

export function generateUID(): string {
  const radix = 34;
  const raw = Date.now().toString(radix) + Math.random().toString(radix).substring(2, 10);
  const id = raw.match(/.{1,4}/g);

  if (!id) throw new Error('Internal error');
  else return id.join('-');
}
