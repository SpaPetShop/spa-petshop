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
import { Link } from "react-router-dom";
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

  const defaultImage =
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

  return (
    <Container maxWidth="lg">
      <LoadingComponentVersion2 open={isLoading} />
      <FeaturedTitle
        title="Dịch Vụ Spa - Grooming"
        subtitle="Các gói combo spa cho thú cưng"
      />

      <Grid container spacing={4} sx={{ mb: 4 }}>
        {comboList.map((combo) => (
          <Grid item xs={12} sm={6} md={4} key={combo.id}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image={
                  combo.image.length ? combo?.image[0]?.imageURL : defaultImage
                }
                alt={combo.name}
                sx={{
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              />
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {combo.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {combo.description}
                </Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ mt: 2, fontWeight: "bold" }}
                >
                  Giá: {combo.sellingPrice.toLocaleString()} VND
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/spa-services/${combo.id}`}
                  sx={{ mx: 1, fontWeight: "bold" }}
                >
                  Xem chi tiết
                </Button>
                <Button
                  onClick={() =>
                    toast.info("Chức năng đang trong quá trình xây dựng")
                  }
                  size="medium"
                  variant="outlined"
                  color="primary"
                  sx={{ mx: 1, fontWeight: "bold" }}
                >
                  Đặt lịch
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

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
