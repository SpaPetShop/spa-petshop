import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { Error, Edit, Schedule } from "@mui/icons-material";
import { orange, green, red, grey } from "@mui/material/colors";
import {
  format,
  differenceInMinutes,
  parseISO,
  isBefore,
  addMinutes,
  isToday,
  isPast,
  isSameDay,
} from "date-fns";
import bookingAPI from "../../../utils/BookingAPI";
import petAPI from "../../../utils/PetAPI";
import { toast } from "react-toastify";

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
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reload, setReload] = useState(false);
  const [changesMade, setChangesMade] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<string>("All");

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
        const bookings = response.items;

        // Automatically cancel orders older than 30 minutes that are not PAID and not already canceled
        for (const booking of bookings) {
          const createdDate = parseISO(booking.createdDate);
          const now = new Date();

          if (
            differenceInMinutes(now, createdDate) > 30 &&
            booking.status !== "PAID" &&
            booking.status !== "CANCELED" // Ensure the status is not already CANCELED
          ) {
            // Call the API to cancel the order
            await bookingAPI.updateOrderStatus(booking.orderId, {
              status: "CANCELED",
              note: "Tự động hủy do quá 30 phút không thanh toán.",
              staffId: userData.id,
            });
            toast.info(`Đơn hàng ${booking.orderId} đã bị tự động hủy.`);
          }
        }

        setBookingList(bookings);
        setFilteredBookingList(bookings);
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
    filterBookings();
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

  const handleUpdateOrder = (booking: any) => {
    if (canChangeBookingDate(booking)) {
      setSelectedOrderId(booking.orderId);
      // Set the initial values for the current staff and time
      setSelectedStaffId(booking.staff?.id || "");
      setSelectedTime(format(parseISO(booking.createdDate), "HH:mm"));
      setOpenStaffDialog(true);
    } else {
      toast.info(
        "Bạn chỉ có thể đổi lịch hoặc nhân viên khi trạng thái là 'PAID'."
      );
    }
  };

  const canChangeBookingDate = (booking: any) => {
    const bookingDate = parseISO(booking.createdDate);
    return (
      booking.status === "PAID" &&
      !changesMade[booking.orderId] &&
      (!isPast(bookingDate) || isSameDay(bookingDate, new Date())) // Disable if booking is fully in the past, but allow changes if it's the same day
    );
  };

  const generateTimeSlots = () => {
    const slots = [];
    let start = new Date();
    start.setHours(9, 0, 0, 0); // Start from 09:00 AM

    while (start.getHours() < 21) {
      const slotTime = format(start, "HH:mm");
      const isDisabled =
        isBefore(new Date(), start) ||
        (isToday(new Date()) && isBefore(start, new Date())); // Disable past time slots on the current day
      slots.push({
        label: slotTime,
        value: slotTime,
        disabled: isDisabled,
      });
      start = addMinutes(start, 30); // Increment by 30 minutes
    }

    return slots;
  };

  const handleConfirmChangeStaff = async () => {
    if (selectedOrderId && selectedTime) {
      try {
        await bookingAPI.requestChangeEmployee({
          note: cancelNote,
          exctionDate: `${new Date().toISOString()}`, // Updated field according to the new API
          staffId: selectedStaffId || userData.id,
          orderId: selectedOrderId,
        });
        toast.success("Yêu cầu thay đổi nhân viên đã được gửi!");
        setChangesMade({ ...changesMade, [selectedOrderId]: true });
        setReload(!reload);
        setOpenStaffDialog(false);
      } catch (error) {
        console.error("Error updating order staff:", error);
        toast.error("Yêu cầu thay đổi nhân viên thất bại.");
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
    setSelectedTime("");
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case "UNPAID":
        return (
          <Chip
            label="Chưa thanh toán"
            sx={{ backgroundColor: orange[500], color: "white" }}
          />
        );
      case "PAID":
        return (
          <Chip
            label="Đã thanh toán"
            sx={{ backgroundColor: green[500], color: "white" }}
          />
        );
      case "COMPLETED":
        return (
          <Chip
            label="Đã hoàn thành"
            sx={{ backgroundColor: grey[700], color: "white" }}
          />
        );
      case "CANCELED":
        return (
          <Chip
            label="Đã hủy"
            sx={{ backgroundColor: red[500], color: "white" }}
          />
        );
      default:
        return (
          <Chip
            label="Trạng thái không xác định"
            sx={{ backgroundColor: grey[700], color: "white" }}
          />
        );
    }
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

  return (
    <Container maxWidth="lg" sx={{ marginY: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              backgroundColor: "#f7f7f7",
              p: 2,
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Lọc Đơn Hàng
            </Typography>
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
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          {view === "bookings" && (
            <Box>
              <Typography variant="h4" gutterBottom>
                Đơn hàng của tôi
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ngày tạo</TableCell>
                      <TableCell>Tên Thú Cưng</TableCell>
                      <TableCell>Trạng thái thanh toán</TableCell>
                      <TableCell>Tổng tiền</TableCell>
                      <TableCell>Nhân viên thực hiện</TableCell>
                      <TableCell>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBookingList.map((booking) => (
                      <TableRow key={booking.orderId}>
                        <TableCell>
                          {format(parseISO(booking.createdDate), "dd-MM-yyyy")}
                        </TableCell>
                        <TableCell>{booking.petInfor.name}</TableCell>
                        <TableCell>{getStatusChip(booking.status)}</TableCell>
                        <TableCell>
                          {booking.finalAmount.toLocaleString()} VND
                        </TableCell>
                        <TableCell>
                          {booking?.staff?.fullName || "Mặc định"}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleUpdateOrder(booking)}
                            disabled={
                              booking.status !== "PAID" ||
                              (isPast(parseISO(booking.createdDate)) &&
                                !isSameDay(
                                  parseISO(booking.createdDate),
                                  new Date()
                                ))
                            }
                          >
                            {booking.type === "MANAGERREQUEST" ? (
                              <Schedule />
                            ) : (
                              <Edit />
                            )}
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(booking.orderId)}
                            disabled={
                              booking.status === "CANCELED" ||
                              (isPast(parseISO(booking.createdDate)) &&
                                !isSameDay(
                                  parseISO(booking.createdDate),
                                  new Date()
                                ))
                            }
                          >
                            <Error />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Grid>
      </Grid>

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
          <Button color="error" onClick={handleConfirmDelete}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openStaffDialog} onClose={handleCloseStaffDialog}>
        <DialogTitle>
          {selectedOrderId &&
          bookingList.find((order) => order.orderId === selectedOrderId)
            ?.type === "MANAGERREQUEST"
            ? "Đổi Lịch"
            : "Đổi Nhân Viên và Lịch"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedOrderId &&
            bookingList.find((order) => order.orderId === selectedOrderId)
              ?.type === "MANAGERREQUEST"
              ? "Vui lòng chọn khung giờ mới cho đơn hàng này."
              : "Vui lòng chọn nhân viên và khung giờ mới cho đơn hàng này."}
          </DialogContentText>
          {/* Display current staff and time */}
          <Typography variant="subtitle2" color="textSecondary">
            Lịch hiện tại: {selectedTime || "Chưa xác định"}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Nhân viên hiện tại:{" "}
            {staffList.find((staff) => staff.id === selectedStaffId)
              ?.fullName || "Mặc định"}
          </Typography>
          {selectedOrderId &&
            bookingList.find((order) => order.orderId === selectedOrderId)
              ?.type !== "MANAGERREQUEST" && (
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
            )}
          <FormControl fullWidth margin="normal">
            <InputLabel>Chọn khung giờ</InputLabel>
            <Select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              label="Chọn khung giờ"
            >
              {generateTimeSlots().map((slot) => (
                <MenuItem key={slot.value} value={slot.value}>
                  {slot.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStaffDialog} color="primary">
            Hủy bỏ
          </Button>
          <Button color="primary" onClick={handleConfirmChangeStaff}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
