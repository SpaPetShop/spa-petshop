import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { UserType } from "../../../types/User/UserType";

interface MenuProps {
    setOpenUpdate: React.Dispatch<React.SetStateAction<boolean>>
    setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedUser: React.Dispatch<React.SetStateAction<UserType | null>>
    data:UserType
}

export default function MenuActionUser({data, setOpenUpdate, setSelectedUser, setOpenDelete}: MenuProps) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickUpdate = () => {
    console.log(data,"update");
    setAnchorEl(null);
    setSelectedUser(data)
    setOpenUpdate(true);
  };
  const handleClickDelete = () => {
    setAnchorEl(null);
    setSelectedUser(data)
    setOpenDelete(true);
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
        <MenuItem onClick={handleClickUpdate}>
          <EditIcon sx={{ mr: "4px" }} color="info" />
          <span>Cập nhật</span>
        </MenuItem>

        <MenuItem onClick={handleClickDelete}>
          <DeleteForeverIcon sx={{ mr: "4px" }} color="error" />
          <span>Xóa</span>
        </MenuItem>
      </Menu>
    </div>
  );
}
