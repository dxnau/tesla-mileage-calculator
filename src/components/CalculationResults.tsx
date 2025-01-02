import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import { useLease } from "../hooks/useLease";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const CalculationResults = ({ onBack }: { onBack: () => void }) => {
  const { leaseStartDate, annualMileage, currentMileage, includeToday } =
    useLease();

  const daysSinceLeaseStart = () => {
    if (!leaseStartDate) return 0;
    const today = new Date();
    const days = Math.ceil(
      (today.getTime() - leaseStartDate.getTime()) / (1000 * 3600 * 24)
    );
    return includeToday ? days : days - 1;
  };

  const allotedDailyMileage = annualMileage / 365;
  const currentDailyMileage = currentMileage / daysSinceLeaseStart() || 0;
  const milesOverUnder =
    currentMileage - daysSinceLeaseStart() * allotedDailyMileage;

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
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Container maxWidth="sm">
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            Your Mileage Summary
          </Typography>

          <Card sx={{ mt: 3, mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Days of Ownership
              </Typography>
              <Typography variant="h4" align="center">
                {daysSinceLeaseStart()} days
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Mileage Stats
              </Typography>
              <Typography>
                Alloted: {allotedDailyMileage.toFixed(2)} mi/day
              </Typography>
              <Typography>
                Current: {currentDailyMileage.toFixed(2)} mi/day
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mileage Summary
              </Typography>
              <Typography variant="h5" align="center" color="primary">
                {Math.abs(milesOverUnder).toFixed(2)} miles{" "}
                {milesOverUnder > 0 ? "over" : "under"}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};
