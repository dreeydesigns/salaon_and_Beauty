"use client";

import { create } from "zustand";

import { bookingDates, bookingTimes } from "@/lib/site-data";

type TargetType = "salons" | "professionals";

interface ContactDetails {
  fullName: string;
  phone: string;
  email: string;
  note: string;
}

interface NotificationPreferences {
  email: boolean;
  whatsapp: boolean;
  text: boolean;
}

interface BookingState {
  step: number;
  targetType: TargetType;
  targetId: string | null;
  selectedServiceIds: string[];
  selectedDate: string;
  selectedTime: string;
  contact: ContactDetails;
  notifications: NotificationPreferences;
  status: "idle" | "processing" | "done";
  setStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  setTarget: (targetType: TargetType, targetId?: string | null) => void;
  toggleService: (serviceId: string) => void;
  setSelectedServices: (serviceIds: string[]) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setContact: (field: keyof ContactDetails, value: string) => void;
  toggleNotification: (field: keyof NotificationPreferences) => void;
  setStatus: (status: BookingState["status"]) => void;
  reset: () => void;
}

const initialState = {
  step: 1,
  targetType: "salons" as TargetType,
  targetId: null,
  selectedServiceIds: [] as string[],
  selectedDate: bookingDates[1]?.date ?? "17 Apr",
  selectedTime: bookingTimes[2] ?? "11:00 AM",
  contact: {
    fullName: "",
    phone: "",
    email: "",
    note: "",
  },
  notifications: {
    email: true,
    whatsapp: true,
    text: false,
  },
  status: "idle" as const,
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  nextStep: () =>
    set((state) => ({
      step: Math.min(state.step + 1, 5),
    })),
  previousStep: () =>
    set((state) => ({
      step: Math.max(state.step - 1, 1),
    })),
  setTarget: (targetType, targetId = null) =>
    set({
      targetType,
      targetId,
    }),
  toggleService: (serviceId) =>
    set((state) => ({
      selectedServiceIds: state.selectedServiceIds.includes(serviceId)
        ? state.selectedServiceIds.filter((id) => id !== serviceId)
        : [...state.selectedServiceIds, serviceId],
    })),
  setSelectedServices: (serviceIds) => set({ selectedServiceIds: serviceIds }),
  setDate: (selectedDate) => set({ selectedDate }),
  setTime: (selectedTime) => set({ selectedTime }),
  setContact: (field, value) =>
    set((state) => ({
      contact: {
        ...state.contact,
        [field]: value,
      },
    })),
  toggleNotification: (field) =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        [field]: !state.notifications[field],
      },
    })),
  setStatus: (status) => set({ status }),
  reset: () => set(initialState),
}));
