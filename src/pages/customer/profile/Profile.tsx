import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { orange, green, red, grey } from "@mui/material/colors";
import petAPI from "../../../utils/PetAPI";
import bookingAPI from "../../../utils/BookingAPI";
import { toast } from "react-toastify";
import { differenceInHours, parseISO } from "date-fns";

const Profile: React.FC = () => {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const [view, setView] = useState<"pets" | "bookings">("bookings");
  const [petList, setPetList] = useState<any[]>([]);
  const [bookingList, setBookingList] = useState<any[]>([]);
  const [filteredBookingList, setFilteredBookingList] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openStaffDialog, setOpenStaffDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [cancelNote, setCancelNote] = useState("");
  const [cancelDescription, setCancelDescription] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [reload, setReload] = useState(false);
  const [changesMade, setChangesMade] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<string>("All"); // Add state for filter

  useEffect(() => {
    const fetchPetList = async () => {
      try {
        const response = await petAPI.getPetsByCustomerId(userData.id);
        setPetList(response.items);
      } catch (error) {
        console.error("Error fetching pet list:", error);
      }
    };
    fetchPetList();
  }, [userData.id]);

  useEffect(() => {
    const fetchBookingList = async () => {
      try {
        const response: any = await bookingAPI.getBookingsByCustomerId(
          userData.id
        );
        setBookingList(response.items);
        setFilteredBookingList(response.items); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching booking list:", error);
      }
    };
    fetchBookingList();
  }, [userData.id, reload]);

  useEffect(() => {
    if (openStaffDialog) {
      const fetchStaffList = async () => {
        try {
          const response = await bookingAPI.getStaffList();
          setStaffList(
            response.items.filter((staff: any) => staff.status === "ACTIVE")
          );
        } catch (error) {
          console.error("Error fetching staff list:", error);
        }
      };
      fetchStaffList();
    }
  }, [openStaffDialog]);

  useEffect(() => {
    filterBookings(); // Apply filter whenever filter state or booking list changes
  }, [filter, bookingList]);

  const filterBookings = () => {
    if (filter === "All") {
      setFilteredBookingList(bookingList);
    } else {
      setFilteredBookingList(
        bookingList.filter((booking) => booking.status === filter)
      );
    }
  };

  const handleDeleteClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedOrderId) {
      try {
        await bookingAPI.updateOrderStatus(selectedOrderId, {
          status: "CANCELED",
          note: cancelNote,
          description: cancelDescription,
          staffId: userData.id,
        });
        toast.success("Order canceled successfully!");
        setReload(!reload);
        setBookingList((prev) =>
          prev.filter((booking) => booking.orderId !== selectedOrderId)
        );
        setOpenDialog(false);
      } catch (error) {
        console.error("Error canceling order:", error);
        toast.error("Failed to cancel order.");
      }
    }
  };

  const canChangeBooking = (booking: any) => {
    if (!booking.excutionDate) {
      console.error("Execution date is undefined for booking:", booking);
      return false;
    }

    let bookingDate;
    try {
      bookingDate = parseISO(booking.excutionDate);
    } catch (error) {
      console.error(
        "Failed to parse execution date:",
        booking.excutionDate,
        error
      );
      return false;
    }

    const hoursUntilBooking = differenceInHours(bookingDate, new Date());
    const hasMadeChange = changesMade[booking.orderId] || false;

    return (
      booking.status === "PAID" && hoursUntilBooking >= 24 && !hasMadeChange
    );
  };

  const handleUpdateOrder = (booking: any) => {
    if (canChangeBooking(booking)) {
      setSelectedOrderId(booking.orderId);
      setOpenStaffDialog(true);
    } else {
      toast.info(
        "Bạn chỉ có thể đổi nhân viên và lịch trong vòng 24 giờ trước giờ đặt hoặc nếu đã thực hiện đổi."
      );
    }
  };

  const handleConfirmChangeStaff = async () => {
    if (selectedOrderId && selectedStaffId) {
      try {
        await bookingAPI.updateOrderStatus(selectedOrderId, {
          status: "PAID", // or keep the existing status if you're only updating the staff
          note: cancelNote,
          description: cancelDescription,
          staffId: selectedStaffId,
        });
        toast.success("Nhân viên đã được đổi thành công!");
        setChangesMade({ ...changesMade, [selectedOrderId]: true });
        setReload(!reload);
        setOpenStaffDialog(false);
      } catch (error) {
        console.error("Error updating order staff:", error);
        toast.error("Nhân viên đã cập nhật thất bại!");
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrderId(null);
    setCancelNote("");
    setCancelDescription("");
  };

  const handleCloseStaffDialog = () => {
    setOpenStaffDialog(false);
    setSelectedStaffId("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNPAID":
        return orange[500];
      case "PAID":
        return green[500];
      case "COMPLETED":
        return grey[700];
      case "CANCELED":
        return red[500];
      default:
        return grey[700];
    }
  };

  const convertTypeToText = (type: string) => {
    switch (type) {
      case "UNPAID":
        return "Chưa thanh toán";
      case "PAID":
        return "Đã thanh toán";
      case "COMPLETED":
        return "Đã hoàn thành";
      case "CANCELED":
        return "Đã hủy";
      default:
        return type;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginY: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Box sx={{ backgroundColor: "#e89305", p: 2, borderRadius: 1 }}>
            <Typography variant="h6" color="white">
              Danh mục
            </Typography>
            <List component="nav">
              <ListItem button onClick={() => setView("bookings")}>
                <ListItemText
                  sx={{ color: "white" }}
                  primary="Đơn hàng của tôi"
                />
              </ListItem>
            </List>
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          {view === "bookings" && (
            <Box>
              <Typography variant="h4" gutterBottom>
                Đơn hàng của tôi
              </Typography>
              {/* Filter Dropdown */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Lọc theo trạng thái</InputLabel>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  label="Lọc theo trạng thái"
                >
                  <MenuItem value="All">Tất cả</MenuItem>
                  <MenuItem value="UNPAID">Chưa thanh toán</MenuItem>
                  <MenuItem value="PAID">Đã thanh toán</MenuItem>
                  <MenuItem value="COMPLETED">Đã hoàn thành</MenuItem>
                  <MenuItem value="CANCELED">Đã hủy</MenuItem>
                </Select>
              </FormControl>

              <List>
                {filteredBookingList.map((booking) => (
                  <React.Fragment key={booking.orderId}>
                    <ListItem alignItems="flex-start">
                      <Avatar
                        alt={booking.petInfor.name}
                        src={booking.petInfor.image}
                        sx={{ mr: 2 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">
                          {booking.petInfor.name} - {booking.invoiceCode}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Ghi chú: {booking.description}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: getStatusColor(booking.status) }}
                        >
                          Trạng thái: {convertTypeToText(booking.status)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Nhân viên chăm sóc: {booking?.staff?.fullName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Tổng tiền: {booking.finalAmount.toLocaleString()} VND
                        </Typography>
                      </Box>
                      {/* Render buttons only if the status is not "CANCELED" */}
                      {booking.status !== "CANCELED" && (
                        <Box>
                          <Button
                            variant="outlined"
                            color="error"
                            sx={{ mr: 1 }}
                            onClick={() => handleDeleteClick(booking.orderId)}
                          >
                            Hủy
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleUpdateOrder(booking)}
                            disabled={
                              booking.status !== "PAID" ||
                              !canChangeBooking(booking)
                            }
                          >
                            Đổi nhân viên
                          </Button>
                        </Box>
                      )}
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Dialog for Canceling Order */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Hủy Đơn Hàng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn hủy đơn hàng này? Vui lòng nhập ghi chú và mô
            tả lý do hủy.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Ghi chú"
            fullWidth
            variant="standard"
            value={cancelNote}
            onChange={(e) => setCancelNote(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            variant="standard"
            value={cancelDescription}
            onChange={(e) => setCancelDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy bỏ
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Changing Staff */}
      <Dialog open={openStaffDialog} onClose={handleCloseStaffDialog}>
        <DialogTitle>Đổi Nhân Viên</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vui lòng chọn nhân viên mới cho đơn hàng này.
          </DialogContentText>
          <RadioGroup
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
          >
            {staffList.map((staff) => (
              <FormControlLabel
                key={staff.id}
                value={staff.id}
                control={<Radio />}
                label={staff.fullName}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStaffDialog} color="primary">
            Hủy bỏ
          </Button>
          <Button onClick={handleConfirmChangeStaff} color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
