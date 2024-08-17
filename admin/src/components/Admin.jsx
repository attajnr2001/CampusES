import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../helpers/firebase";

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", role: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const adminsCollection = collection(db, "admins");
    const adminSnapshot = await getDocs(adminsCollection);
    const adminList = adminSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAdmins(adminList);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewAdmin({ name: "", email: "", role: "" });
    setError("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAdmin = async () => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newAdmin.email,
        "123456"
      );
      const user = userCredential.user;

      // Add admin to Firestore
      const adminDoc = await addDoc(collection(db, "admins"), {
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        createdOn: serverTimestamp(),
        status: "Active",
        uid: user.uid,
      });

      setAdmins((prev) => [
        ...prev,
        {
          id: adminDoc.id,
          ...newAdmin,
          createdOn: new Date(),
          status: "Active",
        },
      ]);
      handleClose();
    } catch (error) {
      setError("Error adding admin: " + error.message);
    }
  };

  const toggleAdminStatus = async (adminId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    const adminRef = doc(db, "admins", adminId);
    await updateDoc(adminRef, { status: newStatus });
    setAdmins(
      admins.map((admin) =>
        admin.id === adminId ? { ...admin, status: newStatus } : admin
      )
    );
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Admins
      </Typography>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        Add Admin
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  {admin.createdOn?.toDate().toLocaleString()}
                </TableCell>
                <TableCell>{admin.role}</TableCell>
                <TableCell>{admin.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => toggleAdminStatus(admin.id, admin.status)}
                  >
                    Toggle Status
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={newAdmin.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            value={newAdmin.email}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              name="role"
              value={newAdmin.role}
              label="Role"
              onChange={handleInputChange}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Super">Super</MenuItem>
            </Select>
          </FormControl>
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddAdmin}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Admin;
