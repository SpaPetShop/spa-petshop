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
} from "@mui/material";
import { Error, Edit, Visibility } from "@mui/icons-material";
import { orange, green, red, grey, blue } from "@mui/material/colors";
import { format, parseISO, isPast, addHours, addMinutes, isSameDay } from "date-fns";
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
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [cancelNote, setCancelNote] = useState("");
  const [cancelDescription, setCancelDescription] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reload, setReload] = useState(false);
  const [filter, setFilter] = useState<string>("All");

  const [orderRequests, setOrderRequests] = useState<any[]>([]);

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

  

  const generateTimeSlots = () => {
    const slots = [];
    let start = new Date();
    start.setHours(9, 0, 0, 0);

    while (start.getHours() < 21) {
      const slotTime = format(start, "HH:mm");
      const isDisabled = start < new Date();

      slots.push({
        label: slotTime,
        value: slotTime,
        disabled: isDisabled,
      });
      start = addMinutes(start, 30);
    }

    return slots;
  };

  useEffect(() => {
    const fetchBookingList = async () => {
      try {
        const response: any = await bookingAPI.getBookingsByCustomerId(
          userData.id
        );
        const bookings = response.items;
        setBookingList(bookings);
        setFilteredBookingList(bookings);
      } catch (error) {
        console.error("Error fetching booking list:", error);
      }
    };
    
    fetchBookingList();
  }, [userData.id, reload]);

  useEffect(() => {
    const fetchRequest = async (orderId: string) => {
      try {
        const response = await bookingAPI.getRequestByOrderId(orderId);
        setOrderRequests(response?.items || []);
      } catch (error) {
        console.error("Error fetching request:", error);
      }
    }
    fetchRequest(selectedOrder?.orderId);
  }, [selectedOrder]);

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

  const handleDeleteClick = (order: any) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleUpdateOrder = (booking: any) => {
    if (canChangeBookingDate(booking)) {
      setSelectedOrder(booking);
      setSelectedStaffId(booking.staff?.id || "");
      setSelectedDate(format(parseISO(booking.excutionDate), "yyyy-MM-dd"));
      setSelectedTime(format(parseISO(booking.excutionDate), "HH:mm"));
      setOpenStaffDialog(true);
    } else {
      toast.info(
        "Bạn chỉ có thể đổi lịch hoặc nhân viên khi trạng thái là 'PAID' và trong vòng 24 giờ trước lịch hẹn."
      );
    }
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setOpenDetailsDialog(true);
  };

  const canChangeBookingDate = (booking: any) => {
    const executionDate = parseISO(booking.excutionDate);
    return booking.status === "PAID" && !isPast(addHours(executionDate, -24));
  };

  const handleConfirmChangeStaff = async () => {
    if (selectedOrder?.orderId && selectedDate && selectedTime) {
      const updatedExecutionDate = `${selectedDate}T${selectedTime}:00`;
      try {
        await bookingAPI.requestChangeEmployee({
          note: cancelNote,
          exctionDate: updatedExecutionDate,
          staffId: selectedStaffId || userData.id,
          orderId: selectedOrder.orderId,
        });
        toast.success("Yêu cầu thay đổi nhân viên đã được gửi!");
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
    setSelectedOrder(null);
    setCancelNote("");
    setCancelDescription("");
  };

  const handleCloseStaffDialog = () => {
    setOpenStaffDialog(false);
    setSelectedStaffId("");
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedOrder(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedOrder?.orderId) {
      try {
        await bookingAPI.updateOrderStatus(selectedOrder.orderId, {
          status: "CANCELED",
          note: cancelNote,
          description: cancelDescription,
          staffId: userData.id,
        });
        toast.success("Order canceled successfully!");
        setReload(!reload);
        setBookingList((prev) =>
          prev.filter((booking) => booking.orderId !== selectedOrder.orderId)
        );
        setOpenDialog(false);
      } catch (error) {
        console.error("Error canceling order:", error);
        toast.error("Failed to cancel order.");
      }
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case "UNPAID":
        return (
          <Chip
            label="Chưa đặt cọc"
            sx={{ backgroundColor: orange[500], color: "white" }}
          />
        );
      case "PAID":
        return (
          <Chip
            label="Đã đặt cọc"
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
                <MenuItem value="UNPAID">Chưa đặt cọc</MenuItem>
                <MenuItem value="PAID">Đã đặt cọc</MenuItem>
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
              <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: blue[50] }}>
                    <TableRow>
                      <TableCell>Ngày tạo</TableCell>
                      <TableCell>Tên Thú Cưng</TableCell>
                      <TableCell>Trạng thái thanh toán</TableCell>
                      <TableCell>Tổng tiền</TableCell>
                      <TableCell>Ngày làm</TableCell>
                      <TableCell>Giờ làm</TableCell>
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
                        <TableCell>{booking.petInfor?.name || "N/A"}</TableCell>
                        <TableCell>{getStatusChip(booking.status)}</TableCell>
                        <TableCell>
                          {booking.finalAmount?.toLocaleString() || 0} VND
                        </TableCell>
                        <TableCell>
                          {format(parseISO(booking.excutionDate), "dd-MM-yyyy HH:mm")}
                        </TableCell>
                        <TableCell>{booking.timeWork} giờ</TableCell>
                        <TableCell>
                          {booking.staff?.fullName || ""}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleViewDetails(booking)}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="primary"
                            onClick={() => handleUpdateOrder(booking)}
                            disabled={
                              booking.status !== "PAID" ||
                              isPast(addHours(parseISO(booking.excutionDate), -24))
                            }
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(booking)}
                            disabled={
                              booking.status === "CANCELED" ||
                              booking.status === "COMPLETED" ||
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
      
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: red[100], fontWeight: "bold" }}>Hủy Đơn Hàng</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn hủy đơn hàng này? Vui lòng nhập lý do hủy.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Ghi chú"
            fullWidth
            variant="outlined"
            value={cancelNote}
            onChange={(e) => setCancelNote(e.target.value)}
          />
          {/* <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            variant="outlined"
            value={cancelDescription}
            onChange={(e) => setCancelDescription(e.target.value)}
          /> */}
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
      
      <Dialog open={openStaffDialog} onClose={handleCloseStaffDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: blue[100], fontWeight: "bold" }}>
          {selectedOrder?.type === "MANAGERREQUEST"
            ? "Đổi Lịch"
            : "Đổi Nhân Viên và Lịch"}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Đổi nhân viên</InputLabel>
            <Select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              label="Đổi nhân viên"
              disabled={selectedOrder?.type === "MANAGERREQUEST"}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200, // Set the maximum height for the dropdown
                    overflowY: "auto", // Enable vertical scrolling
                  },
                },
              }}
            >
              {staffList.map((staff) => (
                <MenuItem key={staff.id} value={staff.id}>
                  {staff.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Chọn ngày"
            name="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          
          <div>
            <label>Chọn khung giờ dịch vụ</label>
            <div>
            {generateTimeSlots().map((slot) => {
              const slotTime = slot.value;
              const selectedDateTime = new Date(`${selectedDate}T${slotTime}`);
              
              const isDisabled = selectedDateTime < new Date();

              return (
                <Button
                  key={slotTime}
                  variant={selectedTime === slotTime ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setSelectedTime(slotTime)}
                  disabled={isDisabled}
                  style={{ margin: "5px" }}
                >
                  {slot.label}
                </Button>
              );
            })}
            </div>
          </div>
          <TextField
              fullWidth
              label="Ghi chú"
              name="note"
              multiline
              rows={4}
              value={cancelNote}
              onChange={(e) => setCancelNote(e.target.value)}
              margin="normal"
            />
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

      <Dialog open={openDetailsDialog} onClose={handleCloseDetailsDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: grey[200], fontWeight: "bold" }}>Chi Tiết Đơn Hàng</DialogTitle>
        <DialogContent>
          {selectedOrder ? (
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Mã Hóa Đơn: {selectedOrder.invoiceCode}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Ngày Tạo: {format(parseISO(selectedOrder.createdDate), "dd-MM-yyyy HH:mm:ss")}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Trạng Thái: {selectedOrder.status}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Tổng Tiền: {selectedOrder.finalAmount?.toLocaleString()} VND
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Ngày Làm: {format(parseISO(selectedOrder.excutionDate), "dd-MM-yyyy HH:mm")}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Giờ Làm: {selectedOrder.timeWork} giờ
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Nhân Viên: {selectedOrder.staff?.fullName || ""}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Khách Hàng: {selectedOrder.userInfo?.fullName || "N/A"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Số Điện Thoại: {selectedOrder.userInfo?.phoneNumber || "N/A"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Tên Thú Cưng: {selectedOrder.petInfor?.name || "N/A"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Loại Thú Cưng: {selectedOrder.petInfor?.typePet?.name || "N/A"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Ghi Chú: {selectedOrder.note?.map((note: any) => note.description).join(', ') || "N/A"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Danh Sách Dịch Vụ:
                {selectedOrder.productList?.map((product: any) => (
                  <Box key={product.orderDetailId} sx={{ ml: 2 }}>
                    Dịch vụ: {product.supProductName} - {product.quantity} x {product.sellingPrice?.toLocaleString()} VND
                  </Box>
                )) || "N/A"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
  Danh Sách Yêu Cầu:
  {orderRequests?.length > 0 ? (
    orderRequests.map((request: any) => (
      <Box key={request.id} sx={{ ml: 2, mb: 1, padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Ghi chú: {request.note}
        </Typography>
        <Typography variant="body2" sx={{ display: "inline-block", marginRight: "8px", fontSize: "16px", color: "#555" }}>
          Trạng thái:
          <span
            style={{
              color: request.status === "APPROVED" ? "green" : request.status === "REJECTED" ? "red" : "gray",
              backgroundColor: request.status === "APPROVED" ? "lightgreen" : request.status === "REJECTED" ? "lightcoral" : "lightgray",
              padding: "4px 12px",
              borderRadius: "15px",
              fontSize: "14px",
              marginLeft: "8px",
            }}
          >
            {request.status}
          </span>
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "14px", color: "#777" }}>
          Ngày tạo: {format(parseISO(request.createDate), "dd-MM-yyyy HH:mm")}
        </Typography>
      </Box>
    ))
  ) : (
    "Không có yêu cầu nào."
  )}
</Typography>

            </Box>
          ) : (
            <DialogContentText>Không tìm thấy thông tin đơn hàng.</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      
    </Container>
  );
};

export default Profile;
