import React, { useState, useEffect } from "react";
import styles from "./Booking.module.css"; // Import CSS Module
import FeaturedTitle from "../../../components/common/highlight/FeaturedTitle";
import PetAPI from "../../../utils/PetAPI";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { addDays, format } from "date-fns"; // Import format
import { Pet, PetType } from "../../../types/PetType/PetType";
import { StaffMember } from "../../../types/User/Staff";
import { useNavigate } from "react-router-dom";
import BookingAPI from "../../../utils/BookingAPI";

import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  TextField,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const minDate = addDays(new Date(), -1);

const petValidationSchema = Yup.object({
  petName: Yup.string().required("Tên boss không được để trống!"),
  petWeight: Yup.number()
    .required("Số kg của boss không được để trống!")
    .min(1, "Số kg phải là số dương!"),
  petAge: Yup.number()
    .required("Tuổi của boss không được để trống!")
    .min(0, "Tuổi phải là số dương!"),
  petTypeId: Yup.string().required("Vui lòng chọn loại boss!"),
});

const bookingValidationSchema = Yup.object({
  date: Yup.date()
    .required("Chọn ngày không được để trống!")
    .min(minDate, "Ngày đặt lịch không hợp lệ!"),
  time: Yup.string().required("Chọn giờ không được để trống!"),
  staffSelection: Yup.string().required("Chọn hình thức chọn nhân viên!"),
  staffId: Yup.string().when("staffSelection", {
    is: (value: string) => value === "manual",
    then: (schema) => schema.required("Chọn nhân viên không được để trống!"),
    otherwise: (schema) => schema.notRequired(),
  }),
});


const Booking: React.FC = () => {
  const selectedPet = JSON.parse(localStorage.getItem("selectedPet") || "{}");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const cartItems = JSON.parse(localStorage.getItem("bookingData") || "[]");
  const finalAmount = parseFloat(localStorage.getItem("finalAmount") || "0");
  const navigate = useNavigate();

  const [showServiceForm, setShowServiceForm] = useState<boolean>(false);
  const [isBookingSuccess, setIsBookingSuccess] = useState<boolean>(false);
  const [petList, setPetList] = useState<Pet[]>([]);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [staffTasks, setStaffTasks] = useState<any[]>([]);
  const [selectedStaffTasks, setSelectedStaffTasks] = useState<any[]>([]);

  const formik = useFormik({
    initialValues: {
      petName: "",
      petWeight: "",
      petAge: "",
      petTypeId: "",
      selectedPetId: "",
      serviceCategory: selectedPet.name || "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "",
      delivery: false,
      staffSelection: "auto",
      staffId: "",
      quantity: 1,
      note: "",
      description: "",
    },
    validationSchema: showServiceForm
      ? bookingValidationSchema
      : petValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!showServiceForm) {
        await handlePetSubmit(values);
      } else {
        const orderId = await handleBookingSubmit(values);
        if (orderId) {
          const stringOrderId = orderId.toString();
          await handlePayment(stringOrderId);
        }
        resetForm();
        localStorage.removeItem("petId");
        localStorage.removeItem("selectedPet");
        localStorage.removeItem("bookingData");
        localStorage.removeItem("finalAmount");
      }
    },
  });

  useEffect(() => {
    const fetchPetTypes = async () => {
      try {
        const response = await BookingAPI.getPetTypes();
        setPetTypes(response.items);
      } catch (error) {
        console.error("Error fetching pet types:", error);
      }
    };

    const fetchStaffList = async () => {
      try {
        const response = await BookingAPI.getStaffList();
        setStaffList(
          response.items.filter((staff: any) => staff.status === "ACTIVE")
        );
      } catch (error) {
        console.error("Error fetching staff list:", error);
      }
    };

    const fetchStaffTasks = async () => {
      try {
        const response = await BookingAPI.getStaffTasks();
        setStaffTasks(response);
      } catch (error) {
        console.error("Error fetching staff list:", error);
      }
    };

    fetchStaffList();
    fetchPetTypes();
    fetchStaffTasks();
  }, []);

  useEffect(() => {
    const fetchPetList = async () => {
      try {
        const response = await PetAPI.getPetsByCustomerId(userData.id);
        setPetList(response.items);
      } catch (error) {
        console.error("Error fetching pet list:", error);
      }
    };
    fetchPetList();
  }, [userData.id]);

  useEffect(() => {
    if (formik.values.staffId) {
      const tasks = staffTasks.filter(
        (task) => task.staff.id === formik.values.staffId
      );
      setSelectedStaffTasks(tasks);
    }
  }, [formik.values.staffId, staffTasks]);

  const checkTimeSlotAvailability = (slot: Date) => {
    const slotTime = format(slot, "yyyy-MM-dd'T'HH:mm:ss");
    console.log("slotTime", slotTime);

    console.log("selectedStaffTasks", ...selectedStaffTasks);
    if (formik.values.staffSelection === "manual" && formik.values.staffId) {
      return !selectedStaffTasks.some(
        (task) => task.excutionDate === slotTime || (
          //disable slot if between estimatedCompletionDate and excutionDate
          task?.estimatedCompletionDate &&
          new Date(task?.excutionDate) < slot &&
          new Date(task?.estimatedCompletionDate) > slot
        )
      );
    } else if (formik.values.staffSelection === "auto") {
      // Check availability for all staff members
      return staffList.some((staff) => {
        const staffTasksForSlot = staffTasks.filter(
          (task) => task.staff.id === staff.id
        );
        console.log(
          staffTasksForSlot.map((task) => {
            return task?.estimatedCompletionDate &&
              new Date(task?.excutionDate) < slot &&
              new Date(task?.estimatedCompletionDate) > slot
          })
        )
        return !staffTasksForSlot.some(
          (task) => task.excutionDate === slotTime 
        );
      });
    }

    return true;
  };

  const generateFilteredTimeSlots = () => {
    const slots = [];
    //start is selected date
    const start = new Date(formik.values.date);
    start.setHours(9, 0, 0, 0);

    while (start.getHours() < 21) {
      slots.push(new Date(start));
      start.setMinutes(start.getMinutes() + 30);
    }

    return slots;
  };

  const handlePetSubmit = async (values: any) => {
    try {
      const existingPet = petList.find((pet) => pet.name === values.petName);
      if (existingPet) {
        localStorage.setItem("petId", existingPet.id);
        setShowServiceForm(true);
      } else {
        const petId: any = await BookingAPI.createPet({
          name: values.petName,
          weight: values.petWeight,
          age: values.petAge,
          image:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          typePetId: values.petTypeId,
        });
        localStorage.setItem("petId", petId);
        setShowServiceForm(true);
      }
    } catch (error) {
      console.error("Error creating pet:", error);
      toast.error("Tên boss đã tồn tại, vui lòng chọn tên khác!");
    }
  };
  console.log(cartItems, localStorage.getItem("bookingData"))
      console.log(selectedPet, localStorage.getItem("selectedPet"))

  const handleBookingSubmit = async (values: any) => {
    try {
      const petId = localStorage.getItem("petId");
      

      const productList =
        cartItems.length > 0
          ? cartItems.map((item: any) => ({
              productId: item.id,
              quantity: 1,
              sellingPrice: item.sellingPrice,
              timeWork: item?.timeWork || 0,
            }))
          : [
              {
                productId: selectedPet.id,
                quantity: values.quantity,
                sellingPrice: selectedPet.sellingPrice,
                timeWork: selectedPet?.timeWork || 0,
              },
            ];
            const bookingResponse = await BookingAPI.createBooking({
              productList,
              excutionDate: `${values.date}T${values.time}`,
              note: values.note,
              description: values.description,
              type:
                values.staffSelection == "auto"
                  ? "MANAGERREQUEST"
                  : "CUSTOMERREQUEST",
              petId: petId,
              staffId: values.staffSelection === "auto" ? null : values.staffId,
            });
      
            setIsBookingSuccess(true);
      
      return bookingResponse || null;
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Lỗi khi đặt lịch!");
      return null;
    }
  };

  const handlePayment = async (orderId: string) => {
    try {
      const amount =
        cartItems.length > 0
          ? finalAmount * 0.2
          : selectedPet.sellingPrice * 0.2;

      const paymentResponse = (await BookingAPI.createPayment({
        orderId: orderId,
        amount: amount,
        paymentType: "VNPAY",
        callbackUrl:
          process.env.REACT_APP_URL_CLIENT || "https://spa-petshop.vercel.app/",
        accountId: userData.id,
      })) as any;

      if (paymentResponse) {
        localStorage.setItem("orderId", orderId);
        window.location.href = paymentResponse.url;
      } else {
        toast.error("Thanh toán thất bại!");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Lỗi khi thực hiện thanh toán!");
    }
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleNavigateProfile = () => {
    navigate("/profile");
  };

  const timeSlots = generateFilteredTimeSlots();
  const isToday = formik.values.date === format(new Date(), "yyyy-MM-dd");
  const currentTime = new Date();

  const formatCurrency = (value: number) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <>
      <FeaturedTitle title="ĐĂNG KÝ DỊCH VỤ" />
      {!showServiceForm ? (
        <form className={styles.bookingForm} onSubmit={formik.handleSubmit}>
          <h2>THÔNG TIN CỦA BOSS</h2>

          <TextField
            fullWidth
            label="Tên Boss"
            name="petName"
            value={formik.values.petName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.petName && Boolean(formik.errors.petName)}
            helperText={formik.touched.petName && formik.errors.petName}
            margin="normal"
          />

          <FormControl component="fieldset" margin="normal">
            <label>Boss là:</label>
            <RadioGroup
              name="petTypeId"
              value={formik.values.petTypeId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              row
            >
              {petTypes.map((petType) => (
                <FormControlLabel
                  key={petType.id}
                  value={petType.id}
                  control={<Radio />}
                  label={petType.name}
                />
              ))}
            </RadioGroup>
            {formik.touched.petTypeId && formik.errors.petTypeId && (
              <div className={styles.error}>{formik.errors.petTypeId}</div>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="Cân nặng của boss"
            name="petWeight"
            type="number"
            value={formik.values.petWeight}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.petWeight && Boolean(formik.errors.petWeight)}
            helperText={formik.touched.petWeight && formik.errors.petWeight}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Tuổi của boss"
            name="petAge"
            type="number"
            value={formik.values.petAge}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.petAge && Boolean(formik.errors.petAge)}
            helperText={formik.touched.petAge && formik.errors.petAge}
            margin="normal"
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            style={{
              marginTop: "30px",
              backgroundColor: "#FF914D",
              color: "white",
            }}
          >
            Tiếp theo
          </Button>
        </form>
      ) : (
        <form className={styles.bookingForm} onSubmit={formik.handleSubmit}>
          <h3>DỊCH VỤ ĐÃ CHỌN</h3>

          <h4>Bạn đã đặt cho BOSS {formik.values.petName} đã đặt gói dịch vụ sau:</h4>

          <div className={styles.serviceInfo}>
  <label htmlFor="serviceCategory">Tên dịch vụ:</label>
  <p>
    {cartItems.length > 0 ? "Thanh toán giỏ hàng" : selectedPet.name}
  </p>
</div>

<p>
  <strong> Số tiền đặt cọc:  </strong> 
  {formatCurrency(
    cartItems.length > 0
      ? finalAmount * 0.2
      : selectedPet.sellingPrice * 0.2
  )}
</p>
<p style={{ color: 'red', fontWeight: 'bold', fontStyle: 'italic' }}>
    *Bạn sẽ không thể thay đổi lịch và nhân viên nếu khoảng cách từ thời gian thực đến thời gian đặt dịch vụ NHỎ HƠN 24 giờ
  </p>


          <TextField
            fullWidth
            label="Chọn ngày"
            name="date"
            type="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

         

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel shrink>Hình thức chọn nhân viên</InputLabel>
            <Select
              name="staffSelection"
              value={formik.values.staffSelection}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Hình thức chọn nhân viên"
              style={{ padding: "10px 14px", fontSize: "16px" }}
              inputProps={{ style: { padding: "10px 14px", fontSize: "16px" } }}
            >
              <MenuItem value="auto">Tiệm đề xuất thợ</MenuItem>
              <MenuItem value="manual">Khách chọn thợ</MenuItem>
            </Select>
            {formik.touched.staffSelection && formik.errors.staffSelection && (
              <div className={styles.error}>{formik.errors.staffSelection}</div>
            )}
          </FormControl>

          {formik.values.staffSelection === "manual" && (
  <FormControl fullWidth margin="normal" variant="outlined">
    <InputLabel shrink>Chọn nhân viên</InputLabel>
    <Select
      name="staffId"
      value={formik.values.staffId}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      label="Chọn nhân viên"
      style={{
        padding: "10px 10px",
        fontSize: "16px",
      }}
      inputProps={{
        style: { padding: "10px 10px", fontSize: "16px" },
      }}
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 200,
            overflowY: "auto", 
          },
        },
      }}
    >
      <MenuItem value="">Chọn nhân viên</MenuItem>
      {staffList.map((staff) => (
        <MenuItem key={staff.id} value={staff.id}>
          {staff.fullName}
        </MenuItem>
      ))}
    </Select>
    {formik.touched.staffId && formik.errors.staffId && (
      <div className={styles.error}>{formik.errors.staffId}</div>
    )}
  </FormControl>
)}

          <div className={styles.timeSlotContainer}>
            <label>Chọn khung giờ dịch vụ</label>
            <div className={styles.timeSlots}>
              {timeSlots.map((slot) => {
                const slotTime = format(slot, "HH:mm");
                const isDisabled = slot < new Date()

                const isAvailable = checkTimeSlotAvailability(slot);

                return (
                  <Button
                    key={slotTime}
                    variant={formik.values.time === slotTime ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => formik.setFieldValue("time", slotTime)}
                    disabled={isDisabled || !isAvailable} // Disable button if time slot is not available
                    style={{ margin: "5px" }}
                  >
                    {slotTime}
                  </Button>
                );
              })}
            </div>
            {formik.touched.time && formik.errors.time && (
              <div className={styles.error}>{formik.errors.time}</div>
            )}
          </div>  

          <TextField
            fullWidth
            label="Ghi chú"
            name="note"
            multiline
            rows={4}
            value={formik.values.note}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            style={{
              marginTop: "30px",
              backgroundColor: "#FF914D",
              color: "white",
            }}
          >
            Thanh Toán Tiển Cọc
          </Button>

          {/* {isBookingSuccess && (
            <div className={styles.actionButtons}>
              <Button
                variant="contained"
                onClick={handleNavigateHome}
                style={{ backgroundColor: "#FF914D", color: "white" }}
              >
                Trở về trang chủ
              </Button>
              <Button
                variant="contained"
                onClick={handleNavigateProfile}
                style={{
                  backgroundColor: "#FF914D",
                  color: "white",
                  marginLeft: "10px",
                }}
              >
                Xem đơn hàng của tôi
              </Button>
            </div>
          )} */}
        </form>
      )}
    </>
  );
};

export default Booking;