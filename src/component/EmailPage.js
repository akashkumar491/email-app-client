import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { COLOR } from "../Asset/Color";

const EmailPage = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const getAllEmails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/`
      );
      console.log(response.data);
      setData(response.data);
      setOriginalData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleMAF = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/update/${selectedCard._id}`,
        { isFavourite: true }
      );
      getAllEmails();
    } catch (error) {
      console.error("Error Updating data:", error);
    }
  };

  const handleFilter = (filter) => {
    if (filter === "read") {
      const list = originalData.filter((item) => item?.isRead);
      setData(list);
      setSelectedFilter("read");
    } else if (filter === "unread") {
      const list = originalData.filter((item) => !item?.isRead);
      setData(list);
      setSelectedFilter("unread");
    } else if (filter === "favourite") {
      const list = originalData.filter((item) => item?.isFavourite);
      setData(list);
      setSelectedFilter("favourite");
    } else if (filter === "reset") {
      setData(originalData);
      setSelectedFilter(null);
    }
  };

  useEffect(() => {
    getAllEmails();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        p: 2,
        backgroundColor: "#F4F5F9",
      }}
    >
      {/* Filters */}
      <Box position={"fixed"} display={"flex"} alignItems={"center"}>
        <Typography color={COLOR.text} mr={2}>
          Filter By:{" "}
        </Typography>
        <Button
          sx={{
            borderRadius: "20px",
            border: selectedFilter === "unread" ? "1px" : "none",
            backgroundColor:
              selectedFilter === "unread" ? COLOR.filterBtn : "none",
          }}
          color={COLOR.text}
          onClick={() => handleFilter("unread")}
        >
          Unread
        </Button>
        <Button
          sx={{
            borderRadius: "20px",
            border: selectedFilter === "read" ? "1px" : "none",
            backgroundColor:
              selectedFilter === "read" ? COLOR.filterBtn : "none",
          }}
          color={COLOR.text}
          onClick={() => handleFilter("read")}
        >
          Read
        </Button>
        <Button
          sx={{
            borderRadius: "20px",
            border: selectedFilter === "favourite" ? "1px" : "none",
            backgroundColor:
              selectedFilter === "favourite" ? COLOR.filterBtn : "none",
          }}
          color={COLOR.text}
          onClick={() => handleFilter("favourite")}
        >
          Favourite
        </Button>
        <Button color={COLOR.text} onClick={() => handleFilter("reset")}>
          Reset
        </Button>
      </Box>
      {/* Card List Section */}
      <Box
        sx={{
          flex: selectedCard ? "0 0 30%" : "1",
          flexDirection: "column",
          overflowY: "auto",
          transition: "flex 0.3s ease",
          mt: 8,
        }}
      >
        <Stack spacing={2} mr={5}>
          {data.map((card) => (
            <Card
              sx={{
                cursor: "pointer",
                backgroundColor: card?.isRead ? "#F2F2F2" : "#ffffff",
                border:
                  selectedCard?._id === card._id ? "2px solid #E54065" : "none",
              }}
              onClick={() => handleCardClick(card)}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Avatar sx={{ bgcolor: "#E54065", mr: 5 }}>
                  {card.sender[0].toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="#636363">
                    <Box component="span" fontWeight="bold">
                      From:
                    </Box>{" "}
                    {card.sender}
                  </Typography>
                  <Typography variant="subtitle2" color="#636363">
                    <Box component="span" fontWeight="bold">
                      Subject:
                    </Box>{" "}
                    {card.subject}
                  </Typography>
                  <Typography variant="subtitle2" color="#636363">
                    {card.body}
                  </Typography>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Typography variant="subtitle2" color="#636363">
                      {dayjs(card.receivedAt).format("DD/MM/YYYY HH:mm A")}
                    </Typography>

                    {card?.isFavourite ? (
                      <Typography fontSize={12} color="#E54065">
                        Favourite
                      </Typography>
                    ) : null}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Detail Section */}
      {selectedCard && (
        <Box
          sx={{
            flex: "1",
            pl: 2,
            transition: "flex 0.3s ease",
          }}
        >
          <Stack height={"550px"} mt={8} bgcolor={"white"} borderRadius={1.5}>
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              p={5}
            >
              <Box display={"flex"} alignItems={"center"}>
                <Avatar sx={{ bgcolor: "#E54065", mr: 2 }}>
                  {selectedCard.sender[0].toUpperCase()}
                </Avatar>
                <Typography variant="h4" color="text.secondary">
                  {selectedCard.subject}
                </Typography>
              </Box>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  color={selectedCard.isFavorite ? "secondary" : "primary"}
                  onClick={() => handleMAF("favourite")}
                  sx={{
                    borderRadius: "50px",
                    padding: "6px 16px",
                    textTransform: "none",
                    boxShadow: 2,
                    backgroundColor: "#E54065",
                    color: "white",
                  }}
                >
                  Mark As Favorite
                </Button>
                <Button
                  color={selectedCard.isFavorite ? "secondary" : "primary"}
                  onClick={() => setSelectedCard(null)}
                  sx={{
                    borderRadius: "50px",
                    padding: "6px 16px",
                    textTransform: "none",
                    boxShadow: 2,
                    backgroundColor: "#E54065",
                    color: "white",
                  }}
                >
                  Close
                </Button>
              </Stack>
            </Box>
            <Typography variant="subtitle2" sx={{ pl: 12 }} color={COLOR.text}>
              {dayjs(selectedCard.receivedAt).format("DD/MM/YYYY HH:mm A")}
            </Typography>
            <Typography variant="subtitle2" sx={{ pl: 12 }} color={COLOR.text}>
              {selectedCard.body}
            </Typography>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default EmailPage;
