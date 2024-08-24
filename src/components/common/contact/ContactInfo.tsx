import CheckIcon from "@mui/icons-material/Check";
import { Box, Card, CardMedia, Grid, Stack, Typography } from "@mui/material";

function ContactInfo() {
  return (
    <Box mt={3}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          mb: 5,
        }}
      >
        <Typography
          align="center"
          sx={{ fontSize: 48, fontWeight: 700 }}
          textTransform="uppercase"
        >
          Thông tin liên hệ
        </Typography>
        <Box
          sx={{ width: "200px", height: "5px", bgcolor: "#00e5ff", mt: 1 }}
        ></Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6}>
          <Card>
            <CardMedia
              image="/background_login.jpg"
              component="img"
              height="600"
              alt="intro"
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Typography align="left" sx={{ color: "#616161", fontSize: 24 }}>
            Địa chỉ:
          </Typography>
          <Stack direction={"row"} alignItems={"center"} gap={2} sx={{ mt: 1 }}>
            <CheckIcon
              color="warning"
              sx={{
                width: 30,
                height: 30,
              }}
            />
            <Typography sx={{ fontSize: 24 }}>
              14.14 Đường số 6, KĐT Hà Quang 2 P. Phước Hải, TP. Nha Trang
            </Typography>
          </Stack>
          <Typography
            align="left"
            sx={{ color: "#616161", fontSize: 24, mt: 3 }}
          >
            Điện Thoại:
          </Typography>
          <Stack direction={"row"} alignItems={"center"} gap={2} sx={{ mt: 1 }}>
            <CheckIcon
              color="warning"
              sx={{
                width: 30,
                height: 30,
              }}
            />
            <Typography sx={{ fontSize: 20 }}>0258.3812077</Typography>
          </Stack>

          <Stack direction={"row"} alignItems={"center"} gap={2} sx={{ mt: 1 }}>
            <CheckIcon
              color="warning"
              sx={{
                width: 30,
                height: 30,
              }}
            />
            <Typography sx={{ fontSize: 20 }}> 0258.3812078</Typography>
          </Stack>    

          <Typography
            align="left"
            sx={{ color: "#616161", fontSize: 24, mt: 3 }}
          >
            Email:
          </Typography>
          <Stack direction={"row"} alignItems={"center"} gap={2} sx={{ mt: 1 }}>
            <CheckIcon
              color="warning"
              sx={{
                width: 30,
                height: 30,
              }}
            />
            <Typography sx={{ fontSize: 24 }}>info@labothanh.com</Typography>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} gap={2} sx={{ mt: 1 }}>
            <CheckIcon
              color="warning"
              sx={{
                width: 30,
                height: 30,
              }}
            />
            <Typography sx={{ fontSize: 24 }}>
              caseinfothanhlab@gmail.com
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ContactInfo;
