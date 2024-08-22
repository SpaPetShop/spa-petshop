import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import ProductAPI from "../../../utils/ProductAPI";
import { ComboType } from "../../../types/Combo/ComboType";
import LoadingComponentVersion2 from "../../../components/common/loading/Backdrop";
import { toast } from "react-toastify";

const DetailSpaCompoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [combo, setCombo] = useState<ComboType | null>(null);
  const [isInCart, setIsInCart] = useState<boolean>(false);
  const navigate = useNavigate();

  const defaultProductData: ComboType = {
    id: "N/A",
    name: "Combo không có sẵn",
    stockPrice: 0,
    sellingPrice: 0,
    description: "Mô tả combo không có sẵn.",
    status: "Unavailable",
    priority: null,
    image: [
      {
        imageURL:
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      },
    ],
    category: {
      id: "N/A",
      name: "Chưa xác định",
    },
    supProducts: [],
  };

  useEffect(() => {
    const fetchCombo = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const response = await ProductAPI.getDetail(id);
          const comboData: ComboType = response;

          const comboWithDefaults = {
            ...defaultProductData,
            ...comboData,
            category: {
              ...defaultProductData.category,
              ...comboData.category,
            },
            image:
              comboData.image.length > 0
                ? comboData.image
                : defaultProductData.image,
          };

          setCombo(comboWithDefaults);

          // Check if the item is in the cart
          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          const existingItem = cart.find(
            (item: any) => item.id === comboWithDefaults.id
          );
          setIsInCart(!!existingItem);
        }
      } catch (error) {
        console.error("Failed to fetch combo details", error);
        setCombo(defaultProductData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCombo();
  }, [id]);

  const handleBookingSubmit = () => {
    if (!combo) return;

    // Remove any existing booking data from localStorage
    localStorage.removeItem("bookingData");

    navigate("/booking", {
      state: {
        productId: combo.id,
        productName: combo.name,
        productPrice: combo.sellingPrice,
      },
    });
  };

  const handleToggleCart = () => {
    if (!combo) return;

    // Retrieve the current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (isInCart) {
      // Remove item from cart
      const updatedCart = cart.filter((item: any) => item.id !== combo.id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setIsInCart(false);
      toast.success("Sản phẩm đã được bỏ khỏi giỏ hàng!");
    } else {
      // Add item to cart with id, quantity, and price
      cart.push({ id: combo.id, quantity: 1, price: combo.sellingPrice });
      localStorage.setItem("cart", JSON.stringify(cart));
      setIsInCart(true);
      toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  if (isLoading) {
    return <LoadingComponentVersion2 open={isLoading} />;
  }

  if (!combo) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h5">Combo không tìm thấy</Typography>
      </Box>
    );
  }

  return (
    <Box p={12}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              position: "relative",
              borderRadius: "20px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff7e6",
              padding: "16px",
            }}
          >
            <CardMedia
              component="img"
              alt={combo.name}
              height="280"
              image={combo.image[0].imageURL}
              title={combo.name}
              sx={{
                borderRadius: "15px",
                maxHeight: "280px",
                objectFit: "cover",
                marginBottom: "16px",
              }}
            />
            <Chip
              label={combo.status === "AVAILABLE" ? "Có sẵn" : "Hết hàng"}
              color={combo.status === "AVAILABLE" ? "success" : "error"}
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                fontSize: "0.75rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                padding: "0 8px",
              }}
            />
            <CardContent sx={{ padding: "16px" }}>
              <Typography gutterBottom variant="h6" component="div">
                {combo.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {combo.description}
              </Typography>
              <Typography variant="h6" color="primary">
                Giá: {formatCurrency(combo.sellingPrice)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tình trạng:{" "}
                {combo.status === "AVAILABLE" ? "Có sẵn" : "Hết hàng"}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Danh mục: {combo.category.name}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EventIcon />}
                fullWidth
                sx={{
                  mt: 2,
                  borderRadius: "50px",
                  fontWeight: "bold",
                  backgroundColor: "#e67e22",
                  "&:hover": {
                    backgroundColor: "#cf681b",
                  },
                }}
                onClick={handleBookingSubmit}
              >
                Đặt lịch
              </Button>
              <Button
                variant={isInCart ? "outlined" : "contained"}
                color={isInCart ? "error" : "primary"}
                startIcon={
                  isInCart ? (
                    <RemoveShoppingCartIcon />
                  ) : (
                    <AddShoppingCartIcon />
                  )
                }
                fullWidth
                sx={{
                  mt: 2,
                  borderRadius: "50px",
                  fontWeight: "bold",
                  borderColor: "#e67e22",
                  color: isInCart ? "#e67e22" : "#fff",
                  "&:hover": {
                    backgroundColor: isInCart ? "transparent" : "#cf681b",
                    color: isInCart ? "#cf681b" : "#fff",
                    borderColor: isInCart ? "#cf681b" : "",
                  },
                }}
                onClick={handleToggleCart}
              >
                {isInCart ? "Bỏ khỏi giỏ hàng" : "Thêm vào giỏ hàng"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Sản phẩm trong combo
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {combo.supProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    borderRadius: "15px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: "16px",
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={product.name}
                    height="150"
                    image={
                      product.image.length
                        ? product.image[0].imageURL
                        : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                    }
                    title={product.name}
                    sx={{
                      borderRadius: "12px",
                      objectFit: "cover",
                      marginBottom: "12px",
                    }}
                  />
                  <CardContent sx={{ padding: "8px" }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: "bold", fontSize: "16px" }}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "14px", fontWeight: "500" }}
                    >
                      Giá: {formatCurrency(product.sellingPrice)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DetailSpaCompoPage;
