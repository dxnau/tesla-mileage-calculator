import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useLease } from "../hooks/useLease";

const STORAGE_KEY = "tesla-mileage-tracker";
const MAX_MILEAGE = 999999;

interface StoredValues {
  mileageInput: string;
  currentMileageInput: string;
  includeToday: boolean;
  leaseStartDate: string | null;
}

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

  const loadStored = (): StoredValues => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as StoredValues;
    } catch {
      // ignore malformed storage
    }
    return {
      mileageInput: "12000",
      currentMileageInput: "0",
      includeToday: false,
      leaseStartDate: null,
    };
  };

  const stored = loadStored();

  const [mileageInput, setMileageInput] = useState(stored.mileageInput);
  const [currentMileageInput, setCurrentMileageInput] = useState(
    stored.currentMileageInput
  );
  const [localIncludeToday, setLocalIncludeToday] = useState(
    stored.includeToday
  );
  const [date, setDate] = useState<Date | null>(
    stored.leaseStartDate ? new Date(stored.leaseStartDate) : null
  );
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    const values: StoredValues = {
      mileageInput,
      currentMileageInput,
      includeToday: localIncludeToday,
      leaseStartDate: isValidDate(date) ? date.toISOString() : null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }, [mileageInput, currentMileageInput, localIncludeToday, date]);

  const isValidDate = (d: Date | null): d is Date =>
    d instanceof Date && !isNaN(d.getTime());

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
    if (!isValidDate(newDate)) {
      setDateError(null);
      return;
    }
    if (newDate > new Date()) {
      setDateError("Lease start date cannot be in the future.");
    } else {
      setDateError(null);
    }
  };

  const isNumericString = (value: string) => /^\d+$/.test(value);

  const handleMileageChange = (value: string) => {
    if (!value || (isNumericString(value) && parseInt(value, 10) <= MAX_MILEAGE)) {
      setMileageInput(value);
    }
  };

  const handleCurrentMileageChange = (value: string) => {
    if (!value || (isNumericString(value) && parseInt(value, 10) <= MAX_MILEAGE)) {
      setCurrentMileageInput(value);
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLDivElement>,
    setter: (val: string) => void
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (isNumericString(pasted) && parseInt(pasted, 10) <= MAX_MILEAGE) {
      setter(pasted);
    }
  };

  const handleCalculate = () => {
    if (isValidDate(date) && mileageInput && !dateError) {
      setLeaseStartDate(date);
      setAnnualMileage(parseInt(mileageInput, 10));
      setCurrentMileage(parseInt(currentMileageInput || "0", 10));
      setIncludeToday(localIncludeToday);
      onComplete();
    }
  };

  const isDateValid = isValidDate(date) && !dateError;
  const canCalculate = isDateValid && !!mileageInput;

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
            component="form"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleCalculate();
            }}
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
              onChange={handleDateChange}
              disableFuture
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!dateError,
                  helperText: dateError ?? undefined,
                },
              }}
            />

            <TextField
              label="Annual Mileage Allowance"
              type="text"
              inputMode="numeric"
              value={mileageInput}
              onChange={(e) => handleMileageChange(e.target.value)}
              onBlur={(e) => {
                if (!e.target.value) setMileageInput("0");
              }}
              onPaste={(e) => handlePaste(e, setMileageInput)}
              inputProps={{
                inputMode: "numeric",
                "aria-label": "Annual mileage allowance",
              }}
              fullWidth
            />

            <TextField
              label="Current Mileage"
              type="text"
              inputMode="numeric"
              value={currentMileageInput}
              onChange={(e) => handleCurrentMileageChange(e.target.value)}
              onBlur={(e) => {
                if (!e.target.value) setCurrentMileageInput("0");
              }}
              onPaste={(e) => handlePaste(e, setCurrentMileageInput)}
              inputProps={{
                inputMode: "numeric",
                "aria-label": "Current mileage",
              }}
              fullWidth
            />

            {isValidDate(date) && !dateError && currentMileageInput && mileageInput && (
              (() => {
                const today = new Date();
                const days = Math.ceil(
                  (today.getTime() - date.getTime()) / (1000 * 3600 * 24)
                );
                const effectiveDays = localIncludeToday ? days : days - 1;
                const expectedMileage =
                  (parseInt(mileageInput, 10) / 365) * Math.max(effectiveDays, 0);
                const current = parseInt(currentMileageInput, 10);
                if (current > expectedMileage * 2 && current > 0) {
                  return (
                    <Alert severity="warning">
                      Current mileage seems high relative to your lease duration.
                      Double-check your entries.
                    </Alert>
                  );
                }
                return null;
              })()
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={localIncludeToday}
                  onChange={(e) => setLocalIncludeToday(e.target.checked)}
                />
              }
              label="Include Today in Calculation"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!canCalculate}
            >
              Calculate
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};
