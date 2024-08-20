import { Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Page403 = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        backgroundImage: `url('/page403.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh", // Điều chỉnh chiều cao theo nhu cầu
      }}
    >
      <Button
        variant="contained"
        sx={{ mt: "75vh", ml: "48vw" }}
        onClick={() => navigate(-1)}
      >
        Quay trở về
      </Button>
    </Box>
  );
};

export default Page403;
