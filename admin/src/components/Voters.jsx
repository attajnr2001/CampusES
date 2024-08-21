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
  Input,
  Alert,
  IconButton,
} from "@mui/material";
import * as XLSX from "xlsx";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../helpers/firebase";
import DeleteIcon from "@mui/icons-material/Delete";

const Voters = () => {
  const [voters, setVoters] = useState([]);
  const [open, setOpen] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      const votersCollection = collection(db, "voters");
      const votersSnapshot = await getDocs(votersCollection);
      const votersList = votersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVoters(votersList);
    } catch (error) {
      console.error("Error fetching voters:", error);
      setError("Error fetching voters");
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setExcelFile(null);
    setError(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setExcelFile(e.target.result);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleUpload = async () => {
    if (excelFile) {
      setLoading(true);
      try {
        const workbook = XLSX.read(excelFile, { type: "buffer" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        if (data) {
          const votersToSave = data.map((voter) => ({
            name: voter.Name || "",
            indexNumber: voter["Index Number"] || "",
            applicantId: voter["Applicant Id"] || "",
            level: voter.Level || "",
            gender: voter.Gender || "",
            hasVoted: false,
          }));

          await saveVotersToDatabase(votersToSave);
          await fetchVoters(); // Refresh the voters list
          handleClose();
        }
      } catch (error) {
        console.error("Error processing file:", error);
        setError("Error processing file");
      }
      setLoading(false);
    }
  };

  const saveVotersToDatabase = async (voters) => {
    try {
      const votersCollection = collection(db, "voters");

      // Check for existing voters
      const indexNumbers = voters.map((voter) => voter.indexNumber);
      const existingVotersQuery = query(
        votersCollection,
        where("indexNumber", "in", indexNumbers)
      );
      const existingVotersSnapshot = await getDocs(existingVotersQuery);
      const existingIndexNumbers = new Set(
        existingVotersSnapshot.docs.map((doc) => doc.data().indexNumber)
      );

      const newVoters = voters.filter(
        (voter) => !existingIndexNumbers.has(voter.indexNumber)
      );

      const promises = newVoters.map((voter) =>
        addDoc(votersCollection, voter)
      );
      await Promise.all(promises);

      setError(
        <Alert severity="success">Voters successfully saved to database</Alert>
      );
    } catch (error) {
      console.error("Error saving voters to database:", error);
      setError(<Alert severity="error">Error saving voters to database</Alert>);
    }
  };

  const deleteVoter = async (voter) => {
    try {
      const votersCollection = collection(db, "voters");
      const voterDoc = doc(votersCollection, voter.id);
      await deleteDoc(voterDoc);
      await fetchVoters();
    } catch (error) {
      console.error("Error deleting voter:", error);
      setError(<Alert severity="error">Error deleting voter</Alert>);
    }
  };

  const deleteAllVoters = async () => {
    try {
      const votersCollection = collection(db, "voters");
      const votersSnapshot = await getDocs(votersCollection);
      const promises = votersSnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(promises);
      await fetchVoters();
      setError(<Alert severity="success">All voters have been deleted</Alert>);
    } catch (error) {
      console.error("Error deleting all voters:", error);
      setError(<Alert severity="error">Error deleting all voters</Alert>);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Voters
      </Typography>
      <Button variant="contained" onClick={handleOpen}>
        Add Voters
      </Button>
      <Button variant="contained" color="error" onClick={deleteAllVoters}>
        Delete All Voters
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Index Number</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Has Voted</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {voters.map((voter) => (
              <TableRow key={voter.indexNumber}>
                <TableCell>{voter.name}</TableCell>
                <TableCell>{voter.indexNumber}</TableCell>
                <TableCell>{voter.level}</TableCell>
                <TableCell>{voter.gender}</TableCell>
                <TableCell>{voter.hasVoted ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => deleteVoter(voter)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Import Voters Excel</DialogTitle>
        <DialogContent>
          <Input
            type="file"
            sx={{ margin: "1em 0" }}
            onChange={handleFileChange}
            accept=".xlsx, .xls, .csv"
          />
          <p>
            Please upload an Excel file with columns: Index Number, Name, Level,
            and Gender.
          </p>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            sx={{ margin: "1em 0" }}
            disabled={!excelFile || loading}
          >
            {loading ? "Adding Voters..." : "Add Voters"}
          </Button>
          {error && <>{error}</>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Voters;
