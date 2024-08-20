import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

function ContactForm() {
  const [data, setData] = useState<any>();
  return (
    <Box sx={{ mt: 20 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          mb: 5,
        }}
      >
        <Typography align="center" sx={{ fontSize: 48, fontWeight: 700 }}>
          Liên Hệ Với Chúng Tôi
        </Typography>
        <Box
          sx={{ width: "200px", height: "5px", bgcolor: "#00e5ff", mt: 1 }}
        ></Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography
          variant="body1"
          align="center"
          sx={{ fontSize: 26, maxWidth: "800px" }}
        >
          Vui lòng nhập thông tin liên lạc của bạn và gửi tin nhắn cho chúng
          tôi. Chúng tôi sẽ trả lời ngay lập tức.
        </Typography>
      </Box>
      <Box
        component="form"
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
          mt: 10,
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-controlled"
          label="Họ Tên *"
          onChange={(event) => {
            setData(event.target.value);
          }}
          value={data}
          sx={{ width: { md: "600px" } }}
          color="secondary"
        />
        <TextField
          id="outlined-controlled"
          label="E-mail *"
          onChange={(event) => {
            setData(event.target.value);
          }}
          value={data}
          sx={{ width: { md: "600px" } }}
          color="secondary"
        />
        <TextField
          id="outlined-controlled"
          label="Điện Thoại *"
          onChange={(event) => {
            setData(event.target.value);
          }}
          value={data}
          sx={{ width: { md: "600px" } }}
          color="secondary"
        />
        <TextField
          id="outlined-controlled"
          label="Mô Tả *"
          onChange={(event) => {
            setData(event.target.value);
          }}
          value={data}
          sx={{ width: { md: "600px" } }}
          color="secondary"
          multiline
          minRows={5}
        />
        <Button
          variant="contained"
          color="info"
          sx={{ pt: 1.5, pb: 1.5, pl: 5, pr: 5 }}
        >
          Gửi
        </Button>
      </Box>
    </Box>
  );
}

export default ContactForm;
