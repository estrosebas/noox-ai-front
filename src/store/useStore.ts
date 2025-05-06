import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Chat, Theme, Message } from '../types/chatTypes';

interface State {
  chats: Chat[];
  currentChatId: string | null;
  theme: Theme;
  isSidebarOpen: boolean;
  isSettingsOpen: boolean;
  addChat: (messages: Message[]) => void;
  updateChat: (id: string, messages: Message[]) => void;
  updateChatTitle: (id: string, title: string) => void;
  setCurrentChat: (id: string) => void;
  deleteChat: (id: string) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  toggleSettings: () => void;
}

const defaultTheme: Theme = {
  name: 'Dark',
  primary: '#1a1a2e',
  secondary: '#16213e',
  background: '#0f0f1a',
  text: '#ffffff'
};

const useStore = create<State>()(
  persist(
    (set) => ({
      chats: [],
      currentChatId: null,
      theme: defaultTheme,
      isSidebarOpen: false,
      isSettingsOpen: false,
      addChat: (messages) => set((state) => {
        const newChat: Chat = {
          id: Date.now().toString(),
          title: messages[1]?.content.slice(0, 30) + '...' || 'New Chat',
          messages,
          createdAt: new Date().toISOString()
        };
        return { 
          chats: [newChat, ...state.chats],
          currentChatId: newChat.id
        };
      }),
      updateChat: (id, messages) => set((state) => ({
        chats: state.chats.map((chat) => 
          chat.id === id 
            ? { ...chat, messages }
            : chat
        )
      })),
      updateChatTitle: (id, title) => set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === id ? { ...chat, title } : chat
        )
      })),
      setCurrentChat: (id) => set({ currentChatId: id }),
      deleteChat: (id) => set((state) => ({ 
        chats: state.chats.filter((chat) => chat.id !== id),
        currentChatId: state.currentChatId === id ? null : state.currentChatId
      })),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen }))
    }),
    {
      name: 'noox-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        chats: state.chats,
        theme: state.theme
      })
    }
  )
);

export default useStore;