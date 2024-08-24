import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Container,
  IconButton,
  Button,
  TextField,
  Paper,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import ProductAPI from "../../../utils/ProductAPI";
import { ComboType } from "../../../types/Combo/ComboType";
import LoadingComponentVersion2 from "../../../components/common/loading/Backdrop";
import SubProductAPI from "../../../utils/SubProductAPI";
import styles from './OrderDetailsDialog.module.css';

const DEFAULT_IMAGE_URL =
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

const CartSummary: React.FC = () => {
  const [cartItems, setCartItems] = useState<ComboType[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [promoCode, setPromoCode] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const fetchedItems: ComboType[] = [];
      let price = 0;

      for (const item of cart) {
        try {
          const response = await ProductAPI.getDetail(item.id);
          const product: any = response;
          fetchedItems.push(product);
          price += product.sellingPrice;
        } catch (error) {
          console.error(
            `Error fetching product details for ${item.id}:`,
            error
          );

          // Try fetching sub-products if the main product fetch fails
          try {
            const supProductResponse = await SubProductAPI.getOne(item.id);
            const supProduct: any = supProductResponse;
            fetchedItems.push(supProduct);
            price += supProduct.sellingPrice;
          } catch (supError) {
            console.error(
              `Error fetching sub-product details for ${item.id}:`,
              supError
            );
          }
        }
      }

      setCartItems(fetchedItems);
      setTotalPrice(price);
      setIsLoading(false);
    };

    fetchCartItems();
  }, []);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleDeleteItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Update total price
    let updatedPrice = 0;
    updatedCart.forEach((item) => {
      updatedPrice += item.sellingPrice;
    });
    setTotalPrice(updatedPrice);
  };

  const handleProceedToBooking = () => {
    if (cartItems.length > 0) {
      // Save cart details to localStorage or send it via state
      localStorage.setItem("bookingData", JSON.stringify(cartItems));

      // // Save the final amount to localStorage
      localStorage.setItem("finalAmount", JSON.stringify(totalPrice));

      // Navigate to the booking page
      navigate("/booking", { state: { cartItems, totalPrice } });
    } else {
      alert("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm.");
    }
  };

  if (isLoading) {
    return <LoadingComponentVersion2 open={isLoading} />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: "flex", flexDirection: "row", marginTop: 4 }}>
        {/* Cart Items Section */}
        <Box sx={{ flex: 2, paddingRight: 3 }}>
          <Typography variant="h5" gutterBottom>
            Giỏ Hàng
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {cartItems.length === 0 ? (
            <Typography variant="body1">
              Giỏ hàng của bạn đang trống.
            </Typography>
          ) : (
            cartItems.map((item) => (
              <Card key={item.id} sx={{ display: "flex", mb: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 100 }}
                  image={
                    item.image.length > 0
                      ? item.image[0].imageURL
                      : DEFAULT_IMAGE_URL
                  }
                  alt={item.name}
                />
                <CardContent
                  sx={{ flex: 1, display: "flex", alignItems: "center" }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {item.name}
                    </Typography>
                    <Chip
                      label={item.supProducts?.length > 0 ? "Combo" : "Dịch vụ"}
                      color="primary"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                    <Typography
                      variant="h6"
                      sx={{ color: "primary.main", mt: 1 }}
                    >
                      {formatCurrency(item.sellingPrice)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>

        {/* Order Summary Section */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Chi tiết đơn hàng
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Tổng giá trị:
              </Typography>
              <Typography variant="h6">{formatCurrency(totalPrice)}</Typography>
            </Box>
            {/* <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Mã giảm giá"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Nhập mã giảm giá"
              />
            </Box> */}
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Số tiền đặt cọc:
              </Typography>
              <Typography variant="h5" sx={{ color: "primary.main" }}>
                {formatCurrency(totalPrice*0.2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleProceedToBooking}
            >
              Tiến hành đặt lịch
            </Button>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default CartSummary;
