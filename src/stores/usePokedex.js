import create from "zustand";

const usePokedex = create((set) => ({
  pokedex: [],
  setPokedex: (pokedex) => set({ pokedex }),
}));

export default usePokedex;
