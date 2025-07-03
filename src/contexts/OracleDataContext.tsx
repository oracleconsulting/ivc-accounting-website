import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OracleData {
  part1Complete?: boolean;
  part2Complete?: boolean;
  fitMessage?: string;
}

interface OracleDataContextType {
  data: OracleData | null;
  setData: (data: OracleData) => void;
}

const OracleDataContext = createContext<OracleDataContextType | undefined>(undefined);

export function OracleDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OracleData | null>(null);

  return (
    <OracleDataContext.Provider value={{ data, setData }}>
      {children}
    </OracleDataContext.Provider>
  );
}

export function useOracleData() {
  const context = useContext(OracleDataContext);
  if (context === undefined) {
    throw new Error('useOracleData must be used within an OracleDataProvider');
  }
  return context;
} 