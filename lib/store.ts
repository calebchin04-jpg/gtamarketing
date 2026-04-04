import { create } from 'zustand';

export type ModuleType = 'liveHub' | 'growthEcosystem';
export type SwitcherPhase = 'idle' | 'switching' | 'resolved';

interface SwitcherState {
  // Which world is currently "full-screen"
  activeModule: ModuleType;
  // Whether the overview (card picker) is open
  isSwitcherOpen: boolean;
  // Animation phase gate — disables global pointer events during spring
  phase: SwitcherPhase;

  // Actions
  toggleSwitcher: () => void;
  setSwitcherOpen: (isOpen: boolean) => void;
  setActiveModule: (module: ModuleType) => void;
  /** Called by Framer Motion's onAnimationComplete */
  resolveTransition: () => void;
}

export const useSwitcherStore = create<SwitcherState>((set) => ({
  activeModule: 'liveHub',
  isSwitcherOpen: false,
  phase: 'idle',

  toggleSwitcher: () =>
    set((state) => ({
      isSwitcherOpen: !state.isSwitcherOpen,
      phase: 'switching',          // immediately lock pointer events
    })),

  setSwitcherOpen: (isOpen) =>
    set({
      isSwitcherOpen: isOpen,
      phase: 'switching',
    }),

  setActiveModule: (module) =>
    set({
      activeModule: module,
      isSwitcherOpen: false,
      phase: 'switching',
    }),

  resolveTransition: () =>
    set({ phase: 'resolved' }),    // framer fires onAnimationComplete → idle
}));
