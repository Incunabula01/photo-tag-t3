import { create } from "zustand";
import { ModalProps } from "react-native";
import { ReactNode } from "react";
import { User } from "../../../../packages/db";

interface AppState {
  status: string; // App currently has 3 states: placed, pending and found
  setStatus: (status: string) => void;
}

interface UserState {
  currentUser: User;
  setCurrentUser: (user: User) => void;
}

interface ModalState extends ModalProps {
  isOpen: boolean;
  modalWrapper?: boolean;
  component: ReactNode | null;
  openModal: (component: ReactNode, modalWrapper: boolean) => void;
  closeModal: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  status: "placed",
  setStatus: (status: string) => set({ status }),
}));

export const useUserStore = create<UserState>((set) => ({
  currentUser: {
    username: "",
    email: "",
    hasTag: false,
    id: 0,
    capturedTags: [],
  },
  setCurrentUser: (currentUser: User) => set({ currentUser }),
}));

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  component: null,
  modalWrapper: true,
  openModal: (component, modalWrapper) =>
    set({ isOpen: true, component, modalWrapper }),
  closeModal: () => set({ isOpen: false, component: null }),
}));
