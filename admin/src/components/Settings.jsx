import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  Alert,
} from "@mui/material";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../helpers/firebase"; // Adjust the import path as needed

const Settings = () => {
  const [settings, setSettings] = useState({
    votingPeriodStart: "",
    votingPeriodEnd: "",
    allowLateVoting: false,
    automaticResultPublication: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dateError, setDateError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, "settings", "votingSettings"));
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data());
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setError("Error fetching settings");
    }
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setSettings((prevSettings) => {
      const newSettings = {
        ...prevSettings,
        [name]: event.target.type === "checkbox" ? checked : value,
      };

      // Validate dates
      if (name === "votingPeriodStart" || name === "votingPeriodEnd") {
        if (newSettings.votingPeriodStart && newSettings.votingPeriodEnd) {
          const start = new Date(newSettings.votingPeriodStart);
          const end = new Date(newSettings.votingPeriodEnd);
          if (start > end) {
            setDateError(
              "Voting period start cannot be after voting period end"
            );
          } else {
            setDateError(null);
          }
        }
      }

      return newSettings;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (dateError) {
      return; // Prevent submission if there's a date error
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await setDoc(doc(db, "settings", "votingSettings"), settings);
      setSuccess("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      setError("Error saving settings");
    }

    setLoading(false);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Voting System Settings
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Voting Period Start"
              type="datetime-local"
              name="votingPeriodStart"
              value={settings.votingPeriodStart}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!dateError}
              helperText={dateError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Voting Period End"
              type="datetime-local"
              name="votingPeriodEnd"
              value={settings.votingPeriodEnd}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!dateError}
              helperText={dateError}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.allowLateVoting}
                  onChange={handleChange}
                  name="allowLateVoting"
                />
              }
              label="Allow Late Voting"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !!dateError}
            >
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          {success && (
            <Grid item xs={12}>
              <Alert severity="success">{success}</Alert>
            </Grid>
          )}
        </Grid>
      </form>
    </div>
  );
};

export default Settings;
