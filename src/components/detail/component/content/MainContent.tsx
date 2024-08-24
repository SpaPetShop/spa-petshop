import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProductType } from "../../../../types/Product/ProductType";
import { Box, Button, Typography, CardMedia, Chip } from "@mui/material";
import { toast } from "react-toastify";
import styles from "./MainContent.module.css"; // Import CSS Module

interface MainContentProps {
  product: ProductType | null;
}

const MainContent: React.FC<MainContentProps> = ({ product }) => {
  const navigate = useNavigate();
  const [isInCart, setIsInCart] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = cart.find((item: any) => item.id === product.id);
      setIsInCart(!!existingItem);
    }
  }, [product]);

  const handleBookingClick = () => {
    // Remove any existing booking data from localStorage
    localStorage.removeItem("bookingData");

    // Store the pet information in localStorage
    localStorage.setItem("selectedPet", JSON.stringify(product));

    // Navigate to the booking page
    navigate("/booking");
  };

  const handleToggleCartClick = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (isInCart) {
      const updatedCart = cart.filter((item: any) => item.id !== product.id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setIsInCart(false);
      toast.success("Sản phẩm đã được gỡ khỏi giỏ hàng!");
    } else {
      cart.push({
        id: product.id,
        quantity: 1,
        amount: product.sellingPrice,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      setIsInCart(true);
      toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
    }
  };

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(product.sellingPrice);

  return (
    <Box className={styles.mainContent}>
      <Box className={styles.productDetail}>
        <CardMedia
          component="img"
          src={product.image[0]?.imageURL}
          alt={product.name}
          className={styles.productImage}
        />
        <Box className={styles.productInfo}>
          <Typography variant="h4" className={styles.productTitle}>
            {product.name}
          </Typography>
          <Typography variant="body1" className={styles.productStatus}>
            <b>Tình trạng:</b>{" "}
            {product.status === "AVAILABLE" ? "Còn chỗ" : "Hết chỗ"}
          </Typography>
      
          <Typography variant="h5" className={styles.productPrice}>
            <b>Giá bán:</b>{" "}
            <Chip
              label={formattedPrice}
              color="primary"
              sx={{ fontSize: "1.2rem" }}
            />
          </Typography>
          <Button
            variant="contained"
            color="warning"
            size="large"
            onClick={handleBookingClick}
            sx={{ mt: 2, width: "100%" }}
          >
            ĐẶT LỊCH
          </Button>
          <Button
            variant={isInCart ? "outlined" : "contained"}
            color="primary"
            size="large"
            onClick={handleToggleCartClick}
            sx={{ mt: 2, width: "100%" }}
          >
            {isInCart ? "Gỡ bỏ khỏi giỏ hàng" : "Thêm vào giỏ hàng"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MainContent;
