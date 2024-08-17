import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Grid, Paper, Typography, CircularProgress } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../helpers/firebase"; // Adjust this import path as needed

const Result = () => {
  const [chartData, setChartData] = useState({
    President: [],
    Secretary: [],
    Organizer: [],
    Treasurer: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      const positions = ["President", "Secretary", "Organizer", "Treasurer"];
      const newChartData = {};

      for (const position of positions) {
        const q = query(
          collection(db, "candidates"),
          where("position", "==", position)
        );
        const querySnapshot = await getDocs(q);
        const candidates = querySnapshot.docs.map((doc) => ({
          name: doc.data().name,
          votes: doc.data().votes || 0,
        }));
        newChartData[position] = candidates;
      }

      setChartData(newChartData);
      setLoading(false);
    };

    fetchCandidates();
  }, []);

  const renderChart = (title, data) => (
    <Grid item xs={12} md={6} spacing={1} sx={{ mt: "6rem" }}>
      <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="votes" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Grid>
  );

  return (
    <Grid container spacing={3}>
      {renderChart("President", chartData.President)}
      {renderChart("Secretary", chartData.Secretary)}
      {renderChart("Organizer", chartData.Organizer)}
      {renderChart("Treasurer", chartData.Treasurer)}
    </Grid>
  );
};

export default Result;
