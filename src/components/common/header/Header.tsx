import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  Badge,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Logout from "@mui/icons-material/Logout";
import PersonAdd from "@mui/icons-material/PersonAdd";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
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

  const [serviceMenuAnchor, setServiceMenuAnchor] =
    useState<null | HTMLElement>(null);
  const openServiceMenu = Boolean(serviceMenuAnchor);

  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    // Fetch cart data from localStorage
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
          icon: <AdminPanelSettingsIcon fontSize="small" />,
        };
      case ROLES.MANAGER:
        return {
          name: "Quản lý",
          icon: <AdminPanelSettingsIcon fontSize="small" />,
        };
      case ROLES.CUSTOMER:
        return {
          name: "Khách hàng",
          icon: <PersonOutlineIcon fontSize="small" />,
        };
      case ROLES.STAFF:
        return { name: "Nhân viên", icon: <AccountBoxIcon fontSize="small" /> };
    }
  };
  const role = renderRole();

  return (
    <header className="header-container">
      <div className="logo">
        <Link to="/">
          <img src={logoImage} alt="Pet Station" />
        </Link>
      </div>
      <nav>
        <ul>
          <li>
            <Link to={"/"}>Trang chủ</Link>
          </li>
          <li>
            <Link to={"/"}>Giới thiệu</Link>
          </li>
          <li
            onMouseEnter={(e) => setServiceMenuAnchor(e.currentTarget)}
            onMouseLeave={() => setServiceMenuAnchor(null)}
          >
            <Link to={"/"} className="dropdown-link">
              Dịch vụ
            </Link>
            {openServiceMenu && (
              <ul className="dropdown-menu">
                <li>
                  <Link to={"/spa-services"}>Dịch vụ spa</Link>
                </li>
                <li>
                  <Link to={"/"}>Dịch vụ đơn lẻ</Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link to={"/contact"}>Liên hệ</Link>
          </li>
          {currentUser.user ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Giỏ hàng">
                <IconButton
                  aria-label="cart"
                  onClick={() => navigate("/my-cart")}
                >
                  <Badge
                    badgeContent={cartCount}
                    color="error"
                    invisible={cartCount === 0}
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Box>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={openMenu ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? "true" : undefined}
                  >
                    <Avatar
                      sx={{ width: 32, height: 32 }}
                      src={"/logo.png"}
                    ></Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
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
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
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
                  alignItems={"cenetr"}
                  spacing={1}
                  sx={{ p: 1 }}
                >
                  <img
                    src={"/logo.png"}
                    alt="Avatar"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "contain",
                    }}
                  />
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
                  <Link to={"/profile"} className="link">
                    <ListItemIcon>
                      <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    Thông tin cá nhân
                  </Link>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleLogout();
                    handleClose();
                  }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Đăng xuất
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Link to={"/login"}>Đăng nhập</Link>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
