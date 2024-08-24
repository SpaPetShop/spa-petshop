import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Grid, Chip } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

interface Pet {
  id: string;
  name: string;
  stockPrice: number;
  sellingPrice: number;
  description?: string;
  status: string;
  priority?: string;
  category: {
    id: string;
    name: string;
  };
  image: string;
  timeWork: number;
}

const PetCard: React.FC<{ pet: Pet }> = ({ pet }) => {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    localStorage.removeItem("bookingData");
    localStorage.setItem("selectedPet", JSON.stringify(pet));
    navigate("/booking");
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          backgroundColor: "#fff7e6",
        }}
      >
        <Box sx={{ position: "relative", textAlign: "center" }}>
          <CardMedia
            component="img"
            image={pet.image}
            alt={pet.name}
            sx={{
              borderRadius: "15px",
              maxHeight: "200px",
              objectFit: "cover",
              marginBottom: "16px",
            }}
          />
        </Box>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#272727",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            {pet.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#888888",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            {pet.description || "No description available"}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "#e67e22", fontWeight: "bold", textAlign: "center" }}
          >
            {pet.sellingPrice.toLocaleString()} VNĐ
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "16px",
          }}
        >
          <Button
            component={Link}
            to={`/${pet.id}`}
            variant="outlined"
            sx={{
              color: "#e67e22",
              borderColor: "#e67e22",
              textTransform: "none",
              borderRadius: "50px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#e67e22",
                color: "#fff",
              },
            }}
          >
            Xem chi tiết
          </Button>
          <Button
            variant="contained"
            onClick={handleBookingClick}
            sx={{
              backgroundColor: "#e67e22",
              color: "#fff",
              textTransform: "none",
              borderRadius: "50px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#cf681b",
              },
            }}
          >
            Đặt lịch
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default PetCard;
