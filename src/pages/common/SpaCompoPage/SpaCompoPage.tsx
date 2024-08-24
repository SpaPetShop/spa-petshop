import React, { useCallback, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CardActions,
  Button,
  Box,
  Container,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import FeaturedTitle from "../../../components/common/highlight/FeaturedTitle";
import ProductAPI from "../../../utils/ProductAPI";
import { ComboType, ComboResponse } from "../../../types/Combo/ComboType";
import PetImageGallery from "../../../components/home/component/gallery/PetImageGallery";
import LoadingComponentVersion2 from "../../../components/common/loading/Backdrop";
import { toast } from "react-toastify";

const SpaCompoPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [comboList, setComboList] = useState<ComboType[]>([]);
  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
  });
  const navigate = useNavigate();

  const fetchAllCombos = useCallback(async () => {
    try {
      setIsLoading(true);
      const data: ComboResponse = await ProductAPI.getAll(filter);
      setComboList(data.items);
    } catch (error: any) {
      console.error("Error fetching combo spa data", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchAllCombos();
  }, [fetchAllCombos]);

  const handleBookingClick = (combo: ComboType) => {
    localStorage.setItem("selectedPet", JSON.stringify(combo));
    localStorage.removeItem("bookingData");
    navigate("/booking", {
      state: { combo },
    });
  };

  const defaultImage =
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

  return (
    <Container maxWidth="lg">
      <LoadingComponentVersion2 open={isLoading} />
      <FeaturedTitle
        title="Dịch Vụ Spa - Grooming"
        subtitle="Các gói combo spa cho thú cưng"
      />

      <Box sx={{ marginBottom: 4 }}>
        <Grid container spacing={4}>
          {comboList.map((combo) => (
            <Grid item xs={12} sm={6} md={4} key={combo.id}>
              <Card
                sx={{
                  borderRadius: "20px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff7e6",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box sx={{ position: "relative", flexGrow: 1 }}>
                  <CardMedia
                    component="img"
                    image={
                      combo.image.length ? combo.image[0]?.imageURL : defaultImage
                    }
                    alt={combo.name}
                    sx={{
                      borderRadius: "15px",
                      height: "200px",
                      objectFit: "cover",
                      marginBottom: "16px",
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#272727",
                      marginBottom: "8px",
                    }}
                  >
                    {combo.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginBottom: "16px" }}
                  >
                    {combo.description || "Mô tả không có sẵn"}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#e67e22",
                      marginBottom: "16px",
                    }}
                  >
                    Giá: {combo.sellingPrice.toLocaleString()} VND
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", padding: "16px" }}>
                  <Button
                    size="medium"
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to={`/spa-services/${combo.id}`}
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
                      marginRight: "8px",
                    }}
                  >
                    Xem chi tiết
                  </Button>
                  <Button
                    onClick={() => handleBookingClick(combo)}
                    size="medium"
                    variant="contained"
                    color="primary"
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
          ))}
        </Grid>
      </Box>

      <Box mt={5}>
        <FeaturedTitle
          title="KHOẢNH KHẮC THÚ CƯNG"
          subtitle="PET LIKE US AND SO WILL YOU"
        />
        <PetImageGallery />
      </Box>
    </Container>
  );
};

export default SpaCompoPage;
