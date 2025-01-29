import { create } from "zustand";

export type Image = {
  file: File;
  height: number;
  width: number;
};

export type Store = {
  image: HTMLImageElement | null;
  height: number;
  width: number;
  blockSize: number;
  colorPalette: string[];
  setImage: (image: HTMLImageElement) => void;
  setHeight: (height: number) => void;
  setWidth: (width: number) => void;
  setBlockSize: (blockSize: number) => void;
  setColorPalette: (colorPalette: string[]) => void;
};

const useStore = create<Store>((set) => ({
  image: null,
  height: 0,
  width: 0,
  blockSize: 0,
  colorPalette: [],
  setImage: (image: HTMLImageElement) => set({ image }),
  setHeight: (height: number) => set({ height }),
  setWidth: (width: number) => set({ width }),
  setBlockSize: (blockSize: number) => set({ blockSize }),
  setColorPalette: (colorPalette: string[]) => set({ colorPalette }),
}));

export default useStore;
