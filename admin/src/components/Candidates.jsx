import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../helpers/firebase";
import DeleteIcon from "@mui/icons-material/Delete";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [open, setOpen] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    indexNumber: "",
    level: "",
    gender: "",
    position: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const candidatesCollection = collection(db, "candidates");
      const candidatesSnapshot = await getDocs(candidatesCollection);
      const candidatesList = candidatesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCandidates(candidatesList);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Error fetching candidates");
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewCandidate({
      name: "",
      indexNumber: "",
      level: "",
      gender: "",
      position: "",
    });
    setAvatarFile(null);
    setAvatarPreview(null);
    setError(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCandidate({ ...newCandidate, [name]: value });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddCandidate = async () => {
    setLoading(true);
    try {
      let avatarUrl = "";
      if (avatarFile) {
        const storageRef = ref(storage, `avatars/${newCandidate.indexNumber}`);
        await uploadBytes(storageRef, avatarFile);
        avatarUrl = await getDownloadURL(storageRef);
      }

      const candidateData = {
        ...newCandidate,
        avatarUrl,
      };

      const candidatesCollection = collection(db, "candidates");
      await addDoc(candidatesCollection, candidateData);

      await fetchCandidates();
      handleClose();
      setError(<Alert severity="success">Candidate successfully added</Alert>);
    } catch (error) {
      console.error("Error adding candidate:", error);
      setError(<Alert severity="error">Error adding candidate</Alert>);
    }
    setLoading(false);
  };

  const deleteCandidate = async (candidate) => {
    try {
      const candidatesCollection = collection(db, "candidates");
      const candidateDoc = doc(candidatesCollection, candidate.id);
      await deleteDoc(candidateDoc);
      await fetchCandidates();
    } catch (error) {
      console.error("Error deleting candidate:", error);
      setError(<Alert severity="error">Error deleting candidate</Alert>);
    }
  };

  const deleteAllCandidates = async () => {
    try {
      const candidatesCollection = collection(db, "candidates");
      const candidatesSnapshot = await getDocs(candidatesCollection);
      const promises = candidatesSnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(promises);
      await fetchCandidates();
      setError(
        <Alert severity="success">All candidates have been deleted</Alert>
      );
    } catch (error) {
      console.error("Error deleting all candidates:", error);
      setError(<Alert severity="error">Error deleting all candidates</Alert>);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Candidates
      </Typography>
      <Button variant="contained" onClick={handleOpen}>
        Add Candidate
      </Button>
      <Button variant="contained" color="error" onClick={deleteAllCandidates}>
        Delete All Candidates
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Index Number</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.indexNumber}>
                <TableCell>
                  <Avatar src={candidate.avatarUrl} />
                </TableCell>
                <TableCell>{candidate.name}</TableCell>
                <TableCell>{candidate.indexNumber}</TableCell>
                <TableCell>{candidate.level}</TableCell>
                <TableCell>{candidate.gender}</TableCell>
                <TableCell>{candidate.position}</TableCell>
                <TableCell>
                  <IconButton onClick={() => deleteCandidate(candidate)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Candidate</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src={avatarPreview} sx={{ width: 100, height: 100 }} />
              <Button variant="contained" component="label">
                Upload Avatar
                <input
                  type="file"
                  hidden
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
              </Button>
            </Box>
            <TextField
              name="name"
              label="Name"
              value={newCandidate.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="indexNumber"
              label="Index Number"
              value={newCandidate.indexNumber}
              onChange={handleInputChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="level-label">Level</InputLabel>
              <Select
                labelId="level-label"
                name="level"
                value={newCandidate.level}
                onChange={handleInputChange}
              >
                <MenuItem value="100">100</MenuItem>
                <MenuItem value="200">200</MenuItem>
                <MenuItem value="300">300</MenuItem>
                <MenuItem value="400">400</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                name="gender"
                value={newCandidate.gender}
                onChange={handleInputChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="position-label">Position</InputLabel>
              <Select
                labelId="position-label"
                name="position"
                value={newCandidate.position}
                onChange={handleInputChange}
              >
                <MenuItem value="President">President</MenuItem>
                <MenuItem value="Organizer">Organizer</MenuItem>
                <MenuItem value="Secretary">Secretary</MenuItem>
                <MenuItem value="Treasurer">Treasurer</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {error && <Box sx={{ mt: 2 }}>{error}</Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleAddCandidate} disabled={loading}>
            {loading ? "Adding..." : "Add Candidate"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Candidates;
