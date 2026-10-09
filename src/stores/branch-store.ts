import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BranchOption {
  id: number;
  name: string;
}

interface BranchState {
  branches: BranchOption[];
  selectedBranch: BranchOption | null;
  setBranches: (branches: BranchOption[]) => void;
  selectBranch: (branch: BranchOption) => void;
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      branches: [],
      selectedBranch: null,
      setBranches: (branches) => set({ branches }),
      selectBranch: (branch) => set({ selectedBranch: branch }),
    }),
    { name: "branch-storage" },
  ),
);
