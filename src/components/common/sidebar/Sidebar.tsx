import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonAdd from "@mui/icons-material/PersonAdd";
import { Stack } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/AuthContext";
import { adminSidebarItems, managerSidebarItems } from "./ListItemSidebar";
import { ROLES } from "../../../routes/roles";

const drawerWidth: number = 270;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Sidebar() {
  const [open, setOpen] = React.useState(true);
  const location = useLocation(); // Sử dụng useLocation để lấy thông tin về URL hiện tại
  const navigate = useNavigate();
  const isActive = (path: string) => {
    return location.pathname.includes(path); // So sánh URL hiện tại với path của mỗi thẻ
  };
  const [titleSelected, setTitleSelected] = React.useState("PET SPA");
  const currentUser = React.useContext(UserContext);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
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
  console.log(location.pathname);
  React.useEffect(() => {
    if (location.pathname && currentUser.user?.role === "ADMIN") {
      const filterItem = adminSidebarItems.filter(
        (item) => item.path === location.pathname
      );
      console.log({ filterItem });
      setTitleSelected(filterItem[0]?.title || "PET SPA");
    }

    if (location.pathname && currentUser.user?.role === "MANAGER") {
      const filterItem = managerSidebarItems.filter(
        (item) => item.path === location.pathname
      );
      console.log({ filterItem });
      setTitleSelected(filterItem[0]?.title || "PET SPA");
    }
  }, [location, currentUser]);
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
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
              bgcolor: "white",
            }}
          >
            <IconButton
              edge="start"
              color="primary"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="black"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {titleSelected}
            </Typography>
            <Stack direction={"row"}>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon color="secondary" />
                </Badge>
              </IconButton>
              <Box>
                <Box>
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleClick}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={open ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                    >
                      <Avatar
                        sx={{ width: 32, height: 32 }}
                        src={currentUser.user?.avatarUrl || "/logo.png"}
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
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        spacing={1}
                      >
                        {role?.icon}
                        <Typography sx={{ color: "#dd2c00", fontWeight: 600 }}>
                          {role?.name}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                  <Divider />
                  {(currentUser.user?.role === ROLES.STAFF ||
                    currentUser.user?.role === ROLES.CUSTOMER) && (
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                        <PersonAdd fontSize="small" />
                      </ListItemIcon>
                      Thông tin cá nhân
                    </MenuItem>
                  )}
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
            </Stack>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          PaperProps={{
            sx: {
              backgroundImage:
                "linear-gradient(to right top, #ffab91, #ffbc8e, #ffce8f, #ffe193, #fff59d)",
            },
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: [1],
            }}
          >
            <img src="/logo.png" alt="logo" style={{ width: "40px" }} />
            <Typography
              textAlign={"center"}
              sx={{ width: 250, fontWeight: 600 }}
            >
              Pet World
            </Typography>

            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {currentUser.user?.role === "MANAGER" &&
              managerSidebarItems.map((item, index) => (
                <Link
                  to={item.path}
                  style={{ textDecoration: "none" }}
                  key={item.path}
                >
                  <ListItemButton
                    sx={{
                      fontSize: "11px",
                      fontWeight: 600,
                      backgroundImage: isActive(item.path)
                        ? "linear-gradient(to right, #7ff3fd, #82f6fc, #86f8fb, #8bfbf9, #8ffdf8)"
                        : "transparent",
                      color: "black",
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </Link>
              ))}

            {currentUser.user?.role === "ADMIN" &&
              adminSidebarItems.map((item, index) => (
                <Link
                  to={item.path}
                  style={{ textDecoration: "none" }}
                  key={item.path}
                >
                  <ListItemButton
                    sx={{
                      fontSize: "11px",
                      fontWeight: 600,
                      backgroundImage: isActive(item.path)
                        ? "linear-gradient(to right, #7ff3fd, #82f6fc, #86f8fb, #8bfbf9, #8ffdf8)"
                        : "transparent",
                      // color: isActive(item.path) ? "black" : "black",
                      color: "black",
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>

                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </Link>
              ))}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          {/* <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}> */}
          <Box sx={{ p: 3 }}>
            <Outlet />
          </Box>

          {/* </Container> */}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
