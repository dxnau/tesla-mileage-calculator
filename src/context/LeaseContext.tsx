import { createContext } from "react";

type LeaseContextType = {
  leaseStartDate: Date | null;
  annualMileage: number;
  currentMileage: number;
  includeToday: boolean;
  setLeaseStartDate: (date: Date) => void;
  setAnnualMileage: (mileage: number) => void;
  setCurrentMileage: (mileage: number) => void;
  setIncludeToday: (include: boolean) => void;
};

export const LeaseContext = createContext<LeaseContextType>({
  leaseStartDate: null,
  annualMileage: 12000,
  currentMileage: 0,
  includeToday: false,
  setLeaseStartDate: () => {},
  setAnnualMileage: () => {},
  setCurrentMileage: () => {},
  setIncludeToday: () => {},
});
