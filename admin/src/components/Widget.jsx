import React, { useState, useEffect, useMemo } from "react";
import "../styles/widget.css";
import { HowToVote, People } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../helpers/firebase"; // Adjust this import path as needed

const Widget = React.memo(({ type }) => {
  const [loading, setLoading] = useState(true);
  const [totalVoters, setTotalVoters] = useState(0);
  const [votedVoters, setVotedVoters] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === "voters") {
          const votersCollection = collection(db, "voters");
          const votersSnapshot = await getDocs(votersCollection);
          const totalVoters = votersSnapshot.size;
          setTotalVoters(totalVoters);

          const votedVotersQuery = query(
            votersCollection,
            where("hasVoted", "==", true)
          );
          const votedVotersSnapshot = await getDocs(votedVotersQuery);
          setVotedVoters(votedVotersSnapshot.size);
        } else if (type === "candidates") {
          const candidatesCollection = collection(db, "candidates");
          const candidatesSnapshot = await getDocs(candidatesCollection);
          setTotalCandidates(candidatesSnapshot.size);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  const widgetData = useMemo(() => {
    switch (type) {
      case "voters":
        return {
          title: "VOTERS",
          link: "View all voters",
          icon: (
            <HowToVote
              className="icon"
              style={{
                backgroundColor: "rgba(0, 128, 0, 0.2)",
                color: "green",
              }}
            />
          ),
          content: (
            <Box>
              <Typography variant="h6">Total Voters: {totalVoters}</Typography>
              <Typography>Voted: {votedVoters}</Typography>
              <Typography>Not Voted: {totalVoters - votedVoters}</Typography>
            </Box>
          ),
        };
      case "candidates":
        return {
          title: "CANDIDATES",
          link: "View all candidates",
          icon: (
            <People
              className="icon"
              style={{
                backgroundColor: "rgba(218, 165, 32, 0.2)",
                color: "goldenrod",
              }}
            />
          ),
          content: (
            <Box>
              <Typography variant="h6">
                Total Candidates: {totalCandidates}
              </Typography>
            </Box>
          ),
        };
      default:
        return {};
    }
  }, [type, totalVoters, votedVoters, totalCandidates]);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a Skeleton component
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{widgetData.title}</span>
        {widgetData.content}
        <span className="link">{widgetData.link}</span>
      </div>
      <div className="right">{widgetData.icon}</div>
    </div>
  );
});

export default Widget;
