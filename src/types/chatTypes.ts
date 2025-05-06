export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  loading: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
}