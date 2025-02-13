export const generateRecomendedBlockSizes = (width: number, height: number) => {
  if (!width || !height) return [];

  const numbersMap: { w: Set<number>; h: Set<number> } = {
    w: new Set(),
    h: new Set(),
  };

  for (
    let i = 0;
    i <= 10;
    i = Math.round(i * 100) / 100 + Math.round(0.05 * 100) / 100
  ) {
    const roundedNumber = Math.round(i * 100) / 100;
    if (width % roundedNumber === 0) numbersMap.w.add(roundedNumber);
  }

  for (
    let i = 0;
    i <= 10;
    i = Math.round(i * 100) / 100 + Math.round(0.05 * 100) / 100
  ) {
    const roundedNumber = Math.round(i * 100) / 100;
    if (height % roundedNumber === 0) numbersMap.h.add(roundedNumber);
  }

  const res: number[] = [];
  numbersMap.w.forEach((w: number) => {
    if (numbersMap.h.has(w)) res.push(w);
  });

  return res;
};

export function hexToRgb(hex: string) {
  // Remove the '#' if it exists
  hex = hex.replace("#", "");

  // Handle shorthand hex codes (e.g., "ABC")
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Parse the hex values for red, green, and blue
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Return the RGB values as an object
  return [r, g, b];
}

export const rgbToHex = (r: number, g: number, b: number) => {
  const componentToHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};
