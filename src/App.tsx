import { useState, useMemo } from "react";
import { ThemeProvider, createTheme, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LeaseProvider } from "./context/LeaseProvider";
import { CalculatorView } from "./views/CalculatorView";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Box from "@mui/material/Box";

import InfoIcon from "@mui/icons-material/Info";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

function App() {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [infoOpen, setInfoOpen] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "dark" ? "#E0E0E0" : "#2A2A2A",
          },
          background: {
            default: mode === "dark" ? "#202020" : "#F5F5F5",
            paper: mode === "dark" ? "#2A2A2A" : "#FFFFFF",
          },
          text: {
            primary: mode === "dark" ? "#FFFFFF" : "#2A2A2A",
            secondary: mode === "dark" ? "#B0B0B0" : "#757575",
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: 12,
                boxShadow: "none",
                padding: "10px 24px",
                "&.Mui-disabled": {
                  backgroundColor: mode === "dark" ? "#404040" : "#E0E0E0",
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow:
                  mode === "dark"
                    ? "0 4px 20px rgba(0,0,0,0.25)"
                    : "0 2px 20px rgba(0,0,0,0.05)",
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: 12,
                  backgroundColor: mode === "dark" ? "#363636" : "#FFFFFF",
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
        },
        shape: {
          borderRadius: 12,
        },
        typography: {
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          h4: {
            fontWeight: 600,
            letterSpacing: "-0.01em",
          },
        },
      }),
    [mode]
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1000,
          display: "flex",
          gap: 1,
        }}
      >
        <IconButton
          onClick={() => setInfoOpen(true)}
          color="inherit"
          sx={{
            bgcolor:
              mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            "&:hover": {
              bgcolor:
                mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
            },
          }}
        >
          <InfoIcon />
        </IconButton>
        <IconButton
          onClick={toggleColorMode}
          color="inherit"
          sx={{
            bgcolor:
              mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            "&:hover": {
              bgcolor:
                mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
            },
          }}
        >
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      {/* Info Modal */}
      <Dialog
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: "sm",
          },
        }}
      >
        <DialogTitle>About Tesla Mileage Tracker</DialogTitle>
        <DialogContent>
          <Typography paragraph sx={{ mt: 1 }}>
            This calculator helps Tesla lease owners track their mileage usage
            and ensure they stay within their lease limits.
          </Typography>
          <Typography paragraph>Enter your lease details including:</Typography>
          <Typography component="div" sx={{ pl: 2 }}>
            • Lease start date
            <br />
            • Annual mileage allowance
            <br />• Current odometer reading
          </Typography>
          <Typography paragraph sx={{ mt: 2 }}>
            The calculator will show you:
          </Typography>
          <Typography component="div" sx={{ pl: 2 }}>
            • Days of ownership
            <br />
            • Daily mileage statistics
            <br />• How many miles you're over or under your allowance
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <LeaseProvider>
          <CalculatorView />
        </LeaseProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
