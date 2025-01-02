import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useLease } from "../hooks/useLease";

interface SetupScreenProps {
  onComplete: () => void;
}

export const SetupScreen = ({ onComplete }: SetupScreenProps) => {
  const {
    setLeaseStartDate,
    setAnnualMileage,
    setCurrentMileage,
    setIncludeToday,
  } = useLease();
  const [mileageInput, setMileageInput] = useState("12000");
  const [currentMileageInput, setCurrentMileageInput] = useState("0");
  const [includeToday, setIncludeTodayInput] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  const handleCalculate = () => {
    if (date && mileageInput) {
      setLeaseStartDate(date);
      setAnnualMileage(parseInt(mileageInput));
      setCurrentMileage(parseInt(currentMileageInput));
      setIncludeToday(includeToday);
      onComplete();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mb: -4,
          }}
        >
          <img
            src="/tesla-roadster-png.png"
            alt="Tesla Roadster"
            style={{
              width: "50%",
              height: "auto",
              marginBottom: "1rem",
            }}
          />
          <Paper
            elevation={3}
            sx={{
              p: 3,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Typography variant="h4" align="center" color="primary">
              Tesla Mileage Tracker
            </Typography>

            <DatePicker
              label="Lease Start Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />

            <TextField
              label="Annual Mileage Allowance"
              type="number"
              value={mileageInput}
              onChange={(e) => {
                const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
                const numValue = parseInt(sanitizedValue);
                if (!isNaN(numValue) && numValue >= 0 && numValue <= 100000) {
                  setMileageInput(sanitizedValue);
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pastedText = e.clipboardData.getData("text");
                const sanitizedValue = pastedText.replace(/[^0-9]/g, "");
                const numValue = parseInt(sanitizedValue);
                if (!isNaN(numValue) && numValue >= 0 && numValue <= 100000) {
                  setMileageInput(sanitizedValue);
                }
              }}
              InputProps={{
                inputMode: "numeric",
                "aria-label": "Annual mileage allowance",
              }}
              fullWidth
            />

            <TextField
              label="Current Mileage"
              type="number"
              value={currentMileageInput}
              onChange={(e) => {
                const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
                const numValue = parseInt(sanitizedValue);
                if (!isNaN(numValue) && numValue >= 0 && numValue <= 999999) {
                  setCurrentMileageInput(sanitizedValue);
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pastedText = e.clipboardData.getData("text");
                const sanitizedValue = pastedText.replace(/[^0-9]/g, "");
                const numValue = parseInt(sanitizedValue);
                if (!isNaN(numValue) && numValue >= 0 && numValue <= 999999) {
                  setCurrentMileageInput(sanitizedValue);
                }
              }}
              InputProps={{
                inputMode: "numeric",
                "aria-label": "Current mileage",
              }}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={includeToday}
                  onChange={(e) => setIncludeTodayInput(e.target.checked)}
                />
              }
              label="Include Today in Calculation"
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleCalculate}
              disabled={!date || !mileageInput}
            >
              Calculate
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};
