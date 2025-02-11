import { PixelCrop } from "react-image-crop";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Image = {
  file: File;
  height: number;
  width: number;
};

export type Store = {
  image: string;
  crop: PixelCrop | null;
  height: number;
  width: number;
  aspect: number;
  blockSize: number;
  colorPalette: string[];
  setImage: (image: string) => void;
  setCrop: (crop: PixelCrop | null) => void;
  setHeight: (height: number) => void;
  setWidth: (width: number) => void;
  setBlockSize: (blockSize: number) => void;
  setColorPalette: (colorPalette: string[]) => void;
};

const useStore = create<Store>()(
  persist(
    (set) => ({
      image: "",
      crop: null,
      height: 0,
      width: 0,
      blockSize: 0,
      aspect: 1,
      colorPalette: ["#000000"],
      setImage: (image: string) => set({ image }),
      setCrop: (crop: PixelCrop | null) => set({ crop }),
      setHeight: (height: number) =>
        set((state) => {
          const aspect = state.width ? state.width / height : 1;
          return { height, aspect };
        }),
      setWidth: (width: number) =>
        set((state) => {
          const aspect = state.height ? width / state.height : 1;
          return { width, aspect };
        }),
      setBlockSize: (blockSize: number) => set({ blockSize }),
      setColorPalette: (colorPalette: string[]) => set({ colorPalette }),
    }),
    {
      name: "pixelit-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        colorPalette: state.colorPalette,
      }),
    },
  ),
);

export default useStore;
