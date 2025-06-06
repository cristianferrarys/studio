
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BranchContextType {
  branches: string[];
  addBranch: (branchName: string) => void;
  isLoadingBranches: boolean;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

// Default branches based on existing data.
const DEFAULT_BRANCHES = ["Central", "Norte", "Sur"].sort();

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const [branches, setBranches] = useState<string[]>(DEFAULT_BRANCHES);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false); // True if fetching initial, false for defaults
  const { toast } = useToast();

  // Example: If you were to fetch initial branches dynamically
  // useEffect(() => {
  //   async function loadInitialBranches() {
  //     setIsLoadingBranches(true);
  //     try {
  //       // Replace with your actual fetch logic if needed
  //       // const fetchedBranches = await myFetchFunction(); 
  //       // const uniqueBranches = Array.from(new Set([...DEFAULT_BRANCHES, ...fetchedBranches])).sort();
  //       // setBranches(uniqueBranches);
  //       setBranches(DEFAULT_BRANCHES); // Using defaults for now
  //     } catch (error) {
  //       console.error("Error fetching initial branches:", error);
  //       setBranches(DEFAULT_BRANCHES); // Fallback
  //       toast({ title: "Error", description: "No se pudieron cargar las sucursales iniciales.", variant: "destructive"});
  //     } finally {
  //       setIsLoadingBranches(false);
  //     }
  //   }
  //   // loadInitialBranches(); // Uncomment if fetching
  // }, [toast]);

  const addBranch = (branchName: string) => {
    const trimmedName = branchName.trim();
    if (trimmedName && !branches.some(b => b.toLowerCase() === trimmedName.toLowerCase())) {
      setBranches(prevBranches => [...prevBranches, trimmedName].sort());
      toast({
        title: "Sucursal Añadida",
        description: `La sucursal "${trimmedName}" ha sido añadida a la lista.`,
      });
    } else if (trimmedName === "") {
      toast({
        title: "Error",
        description: "El nombre de la sucursal no puede estar vacío.",
        variant: "destructive",
      });
    } else {
       toast({
        title: "Información",
        description: `La sucursal "${trimmedName}" ya existe.`,
        variant: "default", // Or "destructive" if you prefer
      });
    }
  };

  return (
    <BranchContext.Provider value={{ branches, addBranch, isLoadingBranches }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranches = (): BranchContextType => {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranches must be used within a BranchProvider');
  }
  return context;
};
