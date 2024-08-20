
import { Box, Button, Chip, Grid, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponentVersion2 from "../../components/common/loading/Backdrop";
import { renderStatusCombo } from "../../components/manager/SingleCombo";
import { ComboType } from "../../types/Combo/ComboType";
import ProductAPI from "../../utils/ProductAPI";


export default function DetailCombo() {
  const { id } = useParams();
  const navigate = useNavigate()
  console.log({ id });
  const [data, setData] = useState<ComboType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchAllCombo = async () => {
      try {
        setIsLoading(true);
        const data = await ProductAPI.getDetail(id || "");
        console.log({ data }, "combo detail");
        setData(data);
      } catch (error) {
        console.log("Error get detail Combo: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchAllCombo();
  }, [id]);
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position:"relative"
      }}
    >
       {isLoading && <LoadingComponentVersion2 open={isLoading}/>}
      <Card sx={{ width: "90%" }}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            {" "}
            <CardMedia
              component="img"
              image="https://img5.thuthuatphanmem.vn/uploads/2021/12/27/hinh-nen-thu-cung-chat-luong-cao-2k-cho-may-tinh_050621563.jpg"
              alt="img combo"              
              sx={{ objectFit: "cover", width:"100%", height:"100%" }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                align="center"
                sx={{ mb: 3 }}
              >
                {data?.name}
              </Typography>
              <Grid container spacing={3}>
                {data?.supProducts?.map((item, index) => (
                  <Grid item xs={12} md={6} lg={6} key={item.id}>
                    {" "}
                    <Box
                      sx={{
                        backgroundImage:
                          index === 0 || index % 2 === 0
                            ? "linear-gradient(to right top, #ffab91, #ffbc8e, #ffce8f, #ffe193, #fff59d)"
                            : "linear-gradient(to right, #7ff3fd, #82f6fc, #86f8fb, #8bfbf9, #8ffdf8)",
                        p: 2,
                        borderRadius: 5,
                      }}
                    >
                      <Typography
                        sx={{ lineHeight: 3, fontSize: 16 }}
                        variant="body2"
                        align="center"
                      >
                        Sản phẩm {index + 1}
                      </Typography>
                      <Typography
                        sx={{ lineHeight: 3, fontSize: 14 }}
                        variant="body2"
                      >
                        Tên sản phẩm: {item.name}
                      </Typography>
                      <Typography
                        sx={{ lineHeight: 3, fontSize: 14 }}
                        variant="body2"
                      >
                        Giá gốc sản phẩm: {item.stockPrice.toLocaleString()} VNĐ
                      </Typography>
                      <Typography
                        sx={{ lineHeight: 3, fontSize: 14 }}
                        variant="body2"
                      >
                        Giá bán sản phẩm: {item.stockPrice.toLocaleString()} VNĐ
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Stack
                direction={"row"}
                alignItems={"center"}
                sx={{ mb: 3, mt: 3 }}
                spacing={1}
              >
                <Typography gutterBottom variant="h6">
                  Giá gói gốc:
                </Typography>
                <Chip
                  label={`${data?.stockPrice?.toLocaleString()} VNĐ`}
                  style={{
                    backgroundColor: "#ff6d00",
                  }}
                />
              </Stack>
              <Stack
                direction={"row"}
                alignItems={"center"}
                sx={{ mb: 3, mt: 3 }}
                spacing={1}
              >
                <Typography gutterBottom variant="h6">
                  Giá gói bán:
                </Typography>
                <Chip
                  label={`${data?.sellingPrice?.toLocaleString()} VNĐ`}
                  style={{
                    backgroundColor: "#00e5ff",
                  }}
                />
              </Stack>

              <Stack
                direction={"row"}
                alignItems={"center"}
                sx={{ mb: 3, mt: 3 }}
                spacing={1}
              >
                <Typography gutterBottom variant="h6">
                  Trạng thái:
                </Typography>
                {renderStatusCombo(data?.status || "")}
              </Stack>

              
                <Button
                  sx={{ width: 200, mt: 3 }}
                  style={{
                    backgroundColor: "#ffa733",
                    color: "black",
                  }}
                  variant="contained"
                  onClick={()=>navigate(`/manager-manage-combo/update-combo/${id}`)}
                >
                  Cập nhật
                </Button>
              
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
