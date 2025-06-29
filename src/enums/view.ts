export const View = {
  SheetMusic: "SheetMusic",
  GuitarHero: "GuitarHero",
};

export type ViewType = (typeof View)[keyof typeof View];
