import { create } from "zustand";

type QRCodeState = {
  qrCode: string;
  fetchQRCode: () => void;
};

export const useQRCodeState = create<QRCodeState>((set) => ({
  qrCode: "",
  fetchQRCode: () => {
    console.log("fetch qr code");
    // const qrCode = await fetch("/api/qrCode").then((res) => res.json());
    // todo
    set({ qrCode: "" });
  },
}));
