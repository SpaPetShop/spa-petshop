import { Box, Button, ButtonGroup, Chip, Grid, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import TableTransaction from "../../components/manager/Table/TableTransaction";

export default function DetailCustomer() {
  const { id } = useParams();
  console.log({ id });
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ width: "100%" }}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={5}>
            {" "}
            <CardMedia
              component="img"
              image="https://png.pngtree.com/png-clipart/20231225/original/pngtree-cute-illustration-of-little-girl-and-pet-dog-png-image_13935884.png"
              alt="customer avatar"
              height={400}
            //   width={700}
              sx={{ objectFit: "cover" }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={7}>
            <CardContent sx={{ml: 4}}>
              <Typography gutterBottom variant="h5" component="div">
                Trần Thị Kiều Trang
              </Typography>
              <Typography
                sx={{ lineHeight: 3, fontSize:18 }}
                variant="body2"
                
              >
                Địa chỉ: số nhà 123 khu phố ABC phường XYZ, thành phố Hồ Chí Minh
              </Typography>
              <Typography
                sx={{ lineHeight: 3, fontSize:18 }}
                variant="body2"
                
              >
                Số điện thoại: 0888 666 888
              </Typography>
              <Typography
                sx={{ lineHeight: 3, fontSize:18 }}
                variant="body2"
                
              >
                Email: trangxinh@gmail.com
              </Typography>
              <Typography
                sx={{ lineHeight: 3, fontSize:18 }}
                variant="body2"
                
              >
                Giới tính: Nữ
              </Typography>
              <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Typography
                sx={{lineHeight: 3, fontSize:18  }}
                gutterBottom
                variant="body2"
                
              >
                Trạng thái:
              </Typography>
              <Chip label={"Đang hoạt động"}  style={{                  
                    backgroundColor: "#33eb91",             
                  }} />
              </Stack>
             
              
            </CardContent>
          </Grid>
        </Grid>
        <Box
          sx={{  height: "5px", bgcolor: "#00e5ff" }}
        ></Box>
        <Typography variant="h6" sx={{mt: 5, ml: 5}}>Lịch sử thanh toán</Typography>
        <TableTransaction/>
        <Box
          sx={{  height: "5px", bgcolor: "#00e5ff" }}
        ></Box>
        <Typography variant="h6" sx={{mt: 5, ml: 5}}>Lịch sử dùng dịch vụ</Typography>
        <TableTransaction/>
      </Card>
    </Box>
  );
}
