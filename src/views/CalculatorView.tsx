import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SetupScreen } from "../components/SetupScreen";
import { CalculationResults } from "../components/CalculationResults";
import { useLease } from "../hooks/useLease";

const STORAGE_KEY = "tesla-mileage-tracker";

export const CalculatorView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setLeaseStartDate, setAnnualMileage, setCurrentMileage, setIncludeToday, leaseStartDate } =
    useLease();

  const isResults = location.pathname === "/results";

  // On refresh at /results, rehydrate context from localStorage
  useEffect(() => {
    if (isResults && !leaseStartDate) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const stored = JSON.parse(raw);
          if (stored.leaseStartDate) {
            const date = new Date(stored.leaseStartDate);
            if (!isNaN(date.getTime())) {
              setLeaseStartDate(date);
              setAnnualMileage(parseInt(stored.mileageInput || "12000", 10));
              setCurrentMileage(parseInt(stored.currentMileageInput || "0", 10));
              setIncludeToday(stored.includeToday ?? false);
              return;
            }
          }
        }
      } catch {
        // malformed storage — fall back to setup
      }
      navigate("/", { replace: true });
    }
  }, [isResults, leaseStartDate, navigate, setAnnualMileage, setCurrentMileage, setIncludeToday, setLeaseStartDate]);

  if (isResults) {
    return <CalculationResults onBack={() => navigate("/")} />;
  }

  return <SetupScreen onComplete={() => navigate("/results")} />;
};
