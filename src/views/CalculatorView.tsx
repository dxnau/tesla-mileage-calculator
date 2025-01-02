import { useState } from "react";
import { SetupScreen } from "../components/SetupScreen";
import { CalculationResults } from "../components/CalculationResults";

export const CalculatorView = () => {
  const [isSetup, setIsSetup] = useState(true);

  if (!isSetup) {
    return <CalculationResults onBack={() => setIsSetup(true)} />;
  }

  return <SetupScreen onComplete={() => setIsSetup(false)} />;
};
