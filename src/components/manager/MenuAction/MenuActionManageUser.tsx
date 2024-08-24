import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";

export default function MenuActionManageUser() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ width: "20px" }}
      >
        <MoreHorizIcon />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleClose}>
          <VisibilityOutlinedIcon sx={{ mr: "4px" }} color="success" />
          <span>Xem chi tiết</span>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <EditIcon sx={{ mr: "4px" }} color="info" />
          <span>Cập nhật</span>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <DeleteForeverIcon sx={{ mr: "4px" }} color="error" />
          <span>Xóa</span>
        </MenuItem>
      </Menu>
    </div>
  );
}
