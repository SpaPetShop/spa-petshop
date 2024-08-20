import React from "react";
import styles from "./PetCard.module.css"; // Import CSS Module
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
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
  image: any;
}

const PetCard: React.FC<{ pet: Pet }> = ({ pet }) => {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    // Remove any existing booking data from localStorage
    localStorage.removeItem("bookingData");
    // Store the pet information in localStorage
    localStorage.setItem("selectedPet", JSON.stringify(pet));
    navigate("/booking");
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} className={styles.cardContainer}>
      <Card className={styles.card}>
        <CardMedia
          className={styles.cardMedia}
          image={pet.image}
          title={pet.name}
        />
        <CardActions className={styles.cardActions}>
          <Link to={`/${pet.id}`} className={styles.detailButton}>
            <Button className={styles.button} variant="outlined">
              Xem chi tiết
            </Button>
          </Link>
          <Button
            className={styles.button}
            variant="contained"
            onClick={handleBookingClick}
          >
            Đặt lịch
          </Button>
        </CardActions>
        <CardContent className={styles.cardContent}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "10px",
              color: "#272727",
            }}
          >
            {pet.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#e67e22",
            }}
          >
            {pet.sellingPrice.toLocaleString()} VNĐ
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default PetCard;
