import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { OrderType } from "../../../types/Order/OrderType";
import { useNavigate } from "react-router-dom";

interface MenuProps {
    setOpenUpdate: React.Dispatch<React.SetStateAction<boolean>>
    setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedOrder: React.Dispatch<React.SetStateAction<OrderType | null>>
    data:OrderType
}

export default function MenuActionOrder({data, setOpenUpdate, setSelectedOrder, setOpenDelete}: MenuProps) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate()
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // const handleClickUpdate = () => {
  //   console.log(data,"update");
  //   setAnchorEl(null);
  //   setSelectedOrder(data)
  //   setOpenUpdate(true);
  // };
  const handleClickDelete = () => {
    setAnchorEl(null);
    setSelectedOrder(data)
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
        <MenuItem onClick={()=>{
          navigate(`/manager-manage-order/${data.orderId}`)
          handleClose()
        }}>
          <VisibilityOutlinedIcon sx={{ mr: "4px" }} color="success" />
          <span>Xem chi tiết</span>
        </MenuItem>

        {/* <MenuItem onClick={handleClickUpdate}>
          <EditIcon sx={{ mr: "4px" }} color="info" />
          <span>Cập nhật</span>
        </MenuItem> */}

        <MenuItem onClick={handleClickDelete}>
          <CancelOutlinedIcon sx={{ mr: "4px" }} color="error" />
          <span>Hủy Đơn</span>
        </MenuItem>
      </Menu>
    </div>
  );
}
