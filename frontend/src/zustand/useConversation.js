import { create } from "zustand";

const useConversation = create((set) => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  reArrange: false,
  setReArrange: (reArrange) => set({ reArrange }),
}));

export default useConversation;
