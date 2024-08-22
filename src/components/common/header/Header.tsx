import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  Badge,
  Button,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { UserContext } from "../../../context/AuthContext";
import { ROLES } from "../../../routes/roles";
import logoImage from "../../../assets/images/home/logo.png";
import "./Header.css";

const Header: React.FC = () => {
  const currentUser = useContext(UserContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    currentUser.setUser(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("UserInfo");
    localStorage.removeItem("petId");
    localStorage.removeItem("selectedPet");
    navigate("/");
  };

  const renderRole = () => {
    switch (currentUser.user?.role?.toUpperCase()) {
      case ROLES.ADMIN:
        return {
          name: "Quản trị viên",
          icon: <Typography fontWeight="bold">ADMIN</Typography>,
        };
      case ROLES.MANAGER:
        return {
          name: "Quản lý",
          icon: <Typography fontWeight="bold">MANAGER</Typography>,
        };
      case ROLES.CUSTOMER:
        return {
          name: "Khách hàng",
          icon: <Typography fontWeight="bold">CUSTOMER</Typography>,
        };
      case ROLES.STAFF:
        return {
          name: "Nhân viên",
          icon: <Typography fontWeight="bold">STAFF</Typography>,
        };
    }
  };
  const role = renderRole();

  return (
    <header
      style={{
        padding: "16px 32px",
        backgroundColor: "#fff7e6",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={logoImage} alt="Pet Station" style={{ height: "50px" }} />
        </Link>

        <Box
          component="nav"
          sx={{ display: "flex", alignItems: "center", gap: 4 }}
        >
          <Link
            to={"/"}
            style={{
              textDecoration: "none",
              color: "#333",
              fontWeight: 600,
              fontSize: "18px",
            }}
          >
            Trang chủ
          </Link>
          <Link
            to={"/about"}
            style={{
              textDecoration: "none",
              color: "#333",
              fontWeight: 600,
              fontSize: "18px",
            }}
          >
            Giới thiệu
          </Link>
          <Link
            to={"/spa-services"}
            style={{
              textDecoration: "none",
              color: "#333",
              fontWeight: 600,
              fontSize: "18px",
            }}
          >
            Dịch vụ
          </Link>
          <Link
            to={"/contact"}
            style={{
              textDecoration: "none",
              color: "#333",
              fontWeight: 600,
              fontSize: "18px",
            }}
          >
            Liên hệ
          </Link>
        </Box>

        {currentUser.user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              aria-label="cart"
              onClick={() => navigate("/my-cart")}
              sx={{ color: "#333" }}
            >
              <Badge
                badgeContent={cartCount}
                color="error"
                invisible={cartCount === 0}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2, color: "#333" }}
            >
              <Avatar sx={{ width: 32, height: 32 }} src={logoImage}></Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={openMenu}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                sx={{ p: 1 }}
              >
                <Avatar sx={{ width: 50, height: 50 }} src={logoImage} />
                <Box>
                  <Typography sx={{ color: "black", fontWeight: 700 }}>
                    {currentUser.user?.name}
                  </Typography>
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    {role?.icon}
                    <Typography sx={{ color: "#dd2c00", fontWeight: 600 }}>
                      {role?.name}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
              <Divider />
              <MenuItem onClick={handleClose}>
                <Link
                  to={"/profile"}
                  className="link"
                  style={{ textDecoration: "none", color: "#333" }}
                >
                  Thông tin cá nhân
                </Link>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleLogout();
                  handleClose();
                }}
                sx={{ color: "#333" }}
              >
                Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Link
            to={"/login"}
            style={{
              textDecoration: "none",
              color: "#333",
              fontWeight: 600,
              fontSize: "18px",
            }}
          >
            Đăng nhập
          </Link>
        )}
      </Box>
    </header>
  );
};

export default Header;
