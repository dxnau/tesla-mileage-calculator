import { useEffect, useRef } from "react";
import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import { useLease } from "../hooks/useLease";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const DAYS_PER_YEAR = 365;

export const CalculationResults = ({ onBack }: { onBack: () => void }) => {
  const { leaseStartDate, annualMileage, currentMileage, includeToday } =
    useLease();

  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const daysSinceLeaseStart = (): number => {
    if (!leaseStartDate) return 0;
    const today = new Date();
    const days = Math.ceil(
      (today.getTime() - leaseStartDate.getTime()) / (1000 * 3600 * 24)
    );
    const result = includeToday ? days : days - 1;
    return Math.max(result, 0);
  };

  const days = daysSinceLeaseStart();
  const allottedDailyMileage = annualMileage / DAYS_PER_YEAR;
  const currentDailyMileage = days > 0 ? currentMileage / days : 0;
  const milesOverUnder = currentMileage - days * allottedDailyMileage;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        position: "relative",
      }}
    >
      <IconButton
        onClick={onBack}
        aria-label="Go back to setup"
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          minWidth: 44,
          minHeight: 44,
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Container maxWidth="sm">
        <Box sx={{ p: 3 }}>
          <Typography
            ref={headingRef}
            tabIndex={-1}
            variant="h4"
            align="center"
            color="primary"
            gutterBottom
            sx={{ outline: "none" }}
          >
            Your Mileage Summary
          </Typography>

          <Card sx={{ mt: 3, mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Days Since Lease Start
              </Typography>
              <Typography variant="h4" align="center">
                {days} days
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Mileage Stats
              </Typography>
              <Typography>
                Allotted: {Math.round(allottedDailyMileage)} mi/day
              </Typography>
              <Typography>
                Current: {Math.round(currentDailyMileage)} mi/day
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mileage Summary
              </Typography>
              <Typography variant="h5" align="center" color="primary">
                {Math.round(Math.abs(milesOverUnder))} miles{" "}
                {milesOverUnder > 0 ? "over" : "under"}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};
