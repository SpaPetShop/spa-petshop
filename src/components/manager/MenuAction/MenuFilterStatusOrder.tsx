import FilterListIcon from "@mui/icons-material/FilterList";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";

export default function MenuFilterStatusOrder() {
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
      >
        <FilterListIcon color="info" />
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
        <MenuItem onClick={() => handleClose()} >
          <span>Tất cả</span>
        </MenuItem>
        <MenuItem onClick={() => handleClose()} >
          <span>Đang chờ</span>
        </MenuItem>
        <MenuItem onClick={() => handleClose()}>
          <span>Đã xác nhận</span>
        </MenuItem>
        <MenuItem onClick={() => handleClose()}>
          <span>Đang tiến hành</span>
        </MenuItem>
        <MenuItem onClick={() => handleClose()}>
          <span>Hoàn thành</span>
        </MenuItem>
        <MenuItem onClick={() => handleClose()}>
          <span>Đã hủy</span>
        </MenuItem>
      </Menu>
    </div>
  );
}
