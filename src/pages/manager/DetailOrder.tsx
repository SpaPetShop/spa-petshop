import {
  Avatar,
  Box,
  CardMedia,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponentVersion2 from "../../components/common/loading/Backdrop";
import { OrderType } from "../../types/Order/OrderType";
import OrderAPI from "../../utils/OrderAPI";
import { renderStatusOrder } from "./ListOrder";

export default function DetailOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log({ id });
  const [data, setData] = useState<OrderType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleSelectStaff = async ()=> {
    console.log("abc");
  }
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const data = await OrderAPI.getDetail(id || "");
        console.log({ data }, "Order detail");
        setData(data);
      } catch (error) {
        console.log("Error get detail Order: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);
  return (
    <Paper sx={{ p: 5 }}>
      {isLoading && <LoadingComponentVersion2 open={isLoading} />}
      {data && (
        <Box>
          <Grid container spacing={2} sx={{ mb: 5 }}>
            <Grid
              item
              xs={12}
              sm={12}
              md={8}
              lg={8}
              sx={{
                border: "2px solid #e0e0e0",
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
                p: 2,
              }}
            >
              <Typography variant="h5" align="center" sx={{ mb: 3 }}>
                THÔNG TIN KHÁCH HÀNG & NHÂN VIÊN
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: 19, mb: 2 }}
                    align="center"
                  >
                    Khách hàng
                  </Typography>
                  <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Avatar
                      src={"/logo.png"}
                      sx={{ width: 50, height: 50 }}
                      alt="avatar"
                    />
                    <Box>
                      <Typography sx={{ fontSize: 17, mb: 1 }}>
                        Họ tên: <strong>{data.userInfo.fullName}</strong>
                      </Typography>
                      <Typography sx={{ fontSize: 17 }}>
                        Số điện thoại:{" "}
                        <strong>
                          {data.userInfo.phoneNumber || "0123456789"}
                        </strong>
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: 19, mb: 2 }}
                    align="center"
                  >
                    Nhân viên
                  </Typography>
                  {data.staff ? (
                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                      <Avatar
                        src={"/logo.png"}
                        sx={{ width: 50, height: 50 }}
                        alt="avatar"
                      />
                      <Box>
                        <Typography sx={{ fontSize: 17, mb: 1 }}>
                          Họ tên: <strong>{data?.staff?.fullName}</strong>
                        </Typography>
                        <Typography sx={{ fontSize: 17 }}>
                          Số điện thoại:{" "}
                          <strong>{data?.staff?.fullName}</strong>
                        </Typography>
                      </Box>
                    </Stack>
                  ) : (
                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                      <Typography
                        sx={{ fontSize: 17, mb: 2, textAlign: "center" }}
                      >
                        Hiện chưa có nhân viên nhận đơn hàng này!
                      </Typography>
                      <Box
                        sx={{
                          textDecoration: "underline",
                          "&:hover": {
                            color: "blue",
                          },
                          cursor:"pointer",                         
                        }}
                       onClick={handleSelectStaff}
                      >
                        Chỉ định nhân viên
                      </Box>
                    </Box>
                  )}
                </Grid>
              </Grid>

              <Box sx={{ height: "3px", bgcolor: "#00e5ff", mt: 1 }}></Box>
              {/* render ttin pet */}
              <Typography
                variant="h6"
                sx={{ fontSize: 19, mb: 2, mt: 1 }}
                align="center"
              >
                Thông tin thú cưng
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  {" "}
                  <CardMedia
                    image="https://img5.thuthuatphanmem.vn/uploads/2021/12/27/hinh-nen-thu-cung-chat-luong-cao-2k-cho-may-tinh_050621563.jpg"
                    component={"img"}
                    alt="img pet"
                    sx={{ width: "100%", height: 180, borderRadius: 2.5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  {" "}
                  <Typography variant="h5" sx={{ fontSize: 16, mb: 5, mt: 4 }}>
                    Tên Thú Cưng: <strong>{data.petInfor.name}</strong>
                  </Typography>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    sx={{ mb: 3, mt: 3 }}
                    spacing={1}
                  >
                    <Typography gutterBottom variant="h6" sx={{ fontSize: 16 }}>
                      Loại Thú Cưng:
                    </Typography>
                    <Chip
                      size="small"
                      icon={<PetsIcon color="disabled" />}
                      label={data.petInfor.typePet.name}
                      style={{
                        backgroundColor: "#00e676",
                        color: "#fff",
                      }}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              lg={4}
              sx={{
                border: "2px solid #e0e0e0",
                borderTopRightRadius: 12,
                borderBottomRightRadius: 12,
                p: 2,
              }}
            >
              {/* render ttin order */}
              <Box>
                <Typography variant="h5" align="center" sx={{ mb: 3 }}>
                  THÔNG TIN ĐƠN HÀNG
                </Typography>
                <Typography variant="h6" sx={{ fontSize: 17, mb: 1 }}>
                  Mã hóa đơn: <strong>{data.invoiceCode}</strong>
                </Typography>
                <Typography variant="h6" sx={{ fontSize: 17, mb: 1 }}>
                  Ngày tạo đơn:{" "}
                  <strong>
                    {moment(data.createdDate).format("DD/MM/YYYY - hh:mm")}
                  </strong>
                </Typography>
                {data.completedDate && (
                  <Typography>
                    Ngày hoàn thành đơn:{" "}
                    <strong>
                      {moment(data.completedDate).format("DD/MM/YYYY - hh:mm")}
                    </strong>
                  </Typography>
                )}
                <Typography variant="h6" sx={{ fontSize: 17, mb: 1 }}>
                  Mô tả: <strong>{data.description}</strong>
                </Typography>

                <Typography variant="h6" sx={{ fontSize: 17, mb: 1 }}>
                  Tổng giá tiền:{" "}
                  <strong>{data.totalAmount.toLocaleString()} VNĐ</strong>
                </Typography>
                <Typography variant="h6" sx={{ fontSize: 17, mb: 1 }}>
                  Tổng giá tiền:{" "}
                  <strong>{data.finalAmount.toLocaleString()} VNĐ</strong>
                </Typography>
                <Typography variant="h6" sx={{ fontSize: 17, mb: 1 }}>
                  Trạng thái: {renderStatusOrder(data.status)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* render note */}
          {data.note.length > 0 && <Typography>Các ghi chú</Typography>}
          {data.note.length > 0 &&
            data.note.map((note, index) => (
              <Box key={index}>
                <Typography>
                  Ngày tạo:{" "}
                  {moment(note.createDate).format("DD/MM/YYYY - hh:mm")}
                </Typography>
                <Typography>Nội dung: {note.description}</Typography>
              </Box>
            ))}

          {/* render list combo */}
          <Typography variant="h5" align="center" sx={{ mb: 3 }}>
            Thông tin sản gói/sản phẩm
          </Typography>
          <Grid container>
            {data.productList.map((product, index) =>
              product.productId ? (
                <Grid key={product.productId} item xs={12} md={6} lg={6}>
                  <Box
                    sx={{
                      backgroundImage:
                        "linear-gradient(to right, #7ff3fd, #82f6fc, #86f8fb, #8bfbf9, #8ffdf8)",
                      p: 2,
                      borderRadius: 5,
                    }}
                  >
                    <Typography sx={{ fontSize: 17, mb: 1 }}>
                      Tên gói: <strong>{product.productName}</strong>
                    </Typography>
                    <Typography sx={{ fontSize: 17 }}>
                      Giá bán:{" "}
                      <strong>
                        {product.sellingPrice.toLocaleString()} VNĐ
                      </strong>
                    </Typography>
                    <Typography></Typography>
                    <Typography></Typography>
                  </Box>
                </Grid>
              ) : (
                <Grid key={product.supProductId} item xs={12} md={6} lg={6}>
                  <Box
                    sx={{
                      backgroundImage:
                        "linear-gradient(to right top, #ffab91, #ffbc8e, #ffce8f, #ffe193, #fff59d)",
                      p: 2,
                      borderRadius: 5,
                    }}
                    key={product.supProductId}
                  >
                    <Typography>
                      Tên sản phẩm: {product.supProductName}
                    </Typography>
                    <Typography>
                      Giá bán: {product.sellingPrice.toLocaleString()} VNĐ
                    </Typography>
                    <Typography></Typography>
                    <Typography></Typography>
                  </Box>
                </Grid>
              )
            )}
          </Grid>
        </Box>
      )}
    </Paper>
  );
}
