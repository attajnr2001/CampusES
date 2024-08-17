import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../helpers/firebase"; // Adjust this import path as needed
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Voting = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [allowLateVoting, setAllowLateVoting] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("warning");
  const [votingEndTime, setVotingEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [votes, setVotes] = useState({});
  const { currentUser, dispatch } = useContext(AuthContext);
  const [votingStartTime, setVotingStartTime] = useState(null);

  useEffect(() => {
    const fetchVotingTimes = async () => {
      const settingsRef = doc(db, "settings", "votingSettings");
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        setVotingEndTime(data.votingPeriodEnd);
        setVotingStartTime(data.votingPeriodStart);
        setAllowLateVoting(data.allowLateVoting || false);
      }
    };

    fetchVotingTimes();
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (!votingStartTime || !votingEndTime) return;

    const startDate = new Date(votingStartTime).getTime();
    const endDate = new Date(votingEndTime).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();

      if (now < startDate) {
        // Voting hasn't started yet
        const difference = startDate - now;
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else if (now >= startDate && now < endDate) {
        // Voting is ongoing
        const difference = endDate - now;
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // Voting has ended
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [votingStartTime, votingEndTime]);

  const fetchCandidates = async () => {
    const positionTitles = ["President", "Secretary", "Organizer", "Treasurer"];
    const fetchedPositions = [];

    for (const title of positionTitles) {
      const q = query(
        collection(db, "candidates"),
        where("position", "==", title)
      );
      const querySnapshot = await getDocs(q);
      const candidates = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        image: doc.data().avatarUrl || "", // Use the avatar URL from Firestore
      }));

      if (candidates.length > 0) {
        fetchedPositions.push({ title, candidates });
      }
    }

    setPositions(fetchedPositions);
    setLoading(false);
  };

  const handleVote = (position, candidate) => {
    setVotes((prev) => ({ ...prev, [position]: candidate }));
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      setSnackbarMessage("User is not logged in");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const now = new Date();
    const votingStart = new Date(votingStartTime);
    const votingEnd = new Date(votingEndTime);

    if (now < votingStart) {
      setSnackbarMessage("Voting period has not started yet");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (now > votingEnd && !allowLateVoting) {
      setSnackbarMessage("Voting period has ended");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (currentUser.hasVoted) {
      setSnackbarMessage("You have already voted");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      // 1. Update votes for selected candidates
      for (const [position, candidateId] of Object.entries(votes)) {
        const candidateRef = doc(db, "candidates", candidateId);
        const candidateSnap = await getDoc(candidateRef);

        if (candidateSnap.exists()) {
          if (candidateSnap.data().votes !== undefined) {
            await updateDoc(candidateRef, {
              votes: increment(1),
            });
          } else {
            await setDoc(candidateRef, { votes: 1 }, { merge: true });
          }
        }
      }

      // 2. Update voter's hasVoted status
      const voterRef = doc(db, "voters", currentUser.id);
      await updateDoc(voterRef, {
        hasVoted: true,
      });

      // 3. Update local state
      dispatch({
        type: "UPDATE_USER",
        payload: { ...currentUser, hasVoted: true },
      });

      setSnackbarMessage("Votes submitted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error submitting votes:", error);
      setSnackbarMessage("Error submitting votes");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: "6rem" }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Cast Your Vote
        </Typography>

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {new Date().getTime() < new Date(votingStartTime).getTime()
              ? "Time Until Voting Starts"
              : new Date().getTime() < new Date(votingEndTime).getTime()
              ? "Time Left to Vote"
              : allowLateVoting
              ? "Late Voting Period"
              : "Voting Has Ended"}
          </Typography>
          {(new Date().getTime() < new Date(votingEndTime).getTime() ||
            allowLateVoting) && (
            <Typography variant="h5">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
              {timeLeft.seconds}s
            </Typography>
          )}
        </Box>
        {positions.map((position) => (
          <Box key={position.title} sx={{ my: 4 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <Typography variant="h4" gutterBottom>
                  {position.title}
                </Typography>
              </FormLabel>
              <RadioGroup
                aria-label={position.title}
                name={position.title}
                value={votes[position.title] || ""}
                onChange={(e) => handleVote(position.title, e.target.value)}
              >
                <Grid container spacing={3}>
                  {position.candidates.map((candidate) => (
                    <Grid item xs={12} sm={6} key={candidate.id}>
                      <Card sx={{ width: 400 }}>
                        <CardMedia
                          component="img"
                          height="250"
                          image={candidate.image}
                          alt={candidate.name}
                        />
                        <CardContent>
                          <FormControlLabel
                            value={candidate.id}
                            control={<Radio />}
                            label={candidate.name}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </FormControl>
          </Box>
        ))}

        <Box sx={{ my: 4, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
          >
            Submit Votes
          </Button>
        </Box>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Voting;
