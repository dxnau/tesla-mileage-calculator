import { ReactNode, useState } from "react";
import { LeaseContext } from "./LeaseContext";

export const LeaseProvider = ({ children }: { children: ReactNode }) => {
  const [leaseStartDate, setLeaseStartDate] = useState<Date | null>(null);
  const [annualMileage, setAnnualMileage] = useState(12000);
  const [currentMileage, setCurrentMileage] = useState(0);
  const [includeToday, setIncludeToday] = useState(false);

  return (
    <LeaseContext.Provider
      value={{
        leaseStartDate,
        annualMileage,
        currentMileage,
        includeToday,
        setLeaseStartDate,
        setAnnualMileage,
        setCurrentMileage,
        setIncludeToday,
      }}
    >
      {children}
    </LeaseContext.Provider>
  );
};
