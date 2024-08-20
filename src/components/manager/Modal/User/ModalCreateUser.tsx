import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Field, Form, Formik } from "formik";
import * as React from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import UserAPI from "../../../../utils/UserAPI";

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const validationSchema = Yup.object({
    fullName: Yup.string().required("*Tên nhân viên không được để trống!"),
    address: Yup.string().required("*Địa chỉ không được để trống!"),
    email: Yup.mixed().required("*Email không được để trống!"),
   phoneNumber: Yup.string().required("*Số điện thoại không được để trống !").matches(phoneRegExp, '*Số điện thoại không hợp lệ !'),
    username: Yup.string().required("*Tên đăng nhập không được để trống!"),
    password: Yup.string().required("*Mật khẩu không được để trống!"),
    image: Yup.string().required("*Ảnh nhân viên không được thiếu!"),
    yearsOfExperience: Yup.number()
      .required("*Số năm kinh nghiệm không được để trống!")
      .min(0, "*Tối thiểu là 0!"),
  });
  
  type ModalCreateUserProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    fetchAllUser: () => void;
  };
  export default function ModalCreateUser({
    open,
    setOpen,
    fetchAllUser
  }: ModalCreateUserProps) {
    const [gender, setGender] = React.useState("MALE");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setGender((event.target as HTMLInputElement).value);
    };
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <>
        <Dialog
          open={open}
          // onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Formik
            initialValues={{
              fullName: "",
              address: "",
              username: "",
              password: "",
              role: "Staff",
              email: "",
              phoneNumber: "",
              image:  "",
              yearsOfExperience: ""
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
               console.log(values);
               await UserAPI.create({...values, gender})
                setOpen(false);
                toast.success("Tạo thành công !");
                fetchAllUser()
              } catch (error) {
                toast.error("Tạo thất bại !");
              }
            }}
          >
            {({ values }) => (
              <Form>
                <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
                  {"TẠO TÀI KHOẢN NHÂN VIÊN"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <Grid container spacing={3}>
                        {/* Input fullname */}
                        <Grid item xs={12} sx={{mb:1}}>
                          <Field name={`fullName`}>
                            {({ field, meta }: any) => (
                              <>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: "black", mb: 1 }}
                                >
                                  Tên nhân viên:
                                </Typography>
                                <TextField
                                  {...field}
                                  type="text"
                                  size="small"                             
                                  placeholder="Nhập tên nhân viên ..."
                                  fullWidth
                                  autoComplete="off"
                                  //   label="Name of the product"
                                  error={meta.touched && !!meta.error}
                                  helperText={
                                    meta.touched && meta.error ? meta.error : ""
                                  }
                                />
                              </>
                            )}
                          </Field>
                        </Grid>
  
                        {/* Input url image */}
                        <Grid item xs={12} sx={{mb:1}}>
                          <Field name={`image`}>
                            {({ field, meta }: any) => (
                              <>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: "black", mb: 1 }}
                                >
                                  URL ảnh:
                                </Typography>
                                <TextField
                                  {...field}                               
                                  fullWidth
                                  autoComplete="off"
                                  size="small"
                                  placeholder="Nhập URL ảnh..."
                                  error={meta.touched && !!meta.error}
                                  helperText={
                                    meta.touched && meta.error ? meta.error : ""
                                  }
                                />
                              </>
                            )}
                          </Field>
                        </Grid>
  
                        {/* Input email */}
                        <Grid item xs={12} sx={{mb:1}}>
                          <Field name={`email`}>
                            {({ field, meta }: any) => (
                              <>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: "black", mb: 1 }}
                                >
                                  Email:
                                </Typography>
                                <TextField
                                  {...field}
                                  fullWidth
                                  //   label="Length"
                                  autoComplete="off"
                                  size="small"
                                  placeholder="Nhập Email..."
                                  error={meta.touched && !!meta.error}
                                  helperText={
                                    meta.touched && meta.error ? meta.error : ""
                                  }
                                />
                              </>
                            )}
                          </Field>
                        </Grid>
  
                        {/* Input phone number */}
                        <Grid item xs={12}>
                          <Field name={`phoneNumber`}>
                            {({ field, meta }: any) => (
                              <>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: "black", mb: 1 }}
                                >
                                  Số điện thoại:
                                </Typography>
                                <TextField
                                  {...field}                         
                                  fullWidth
                                  size="small"
                                  autoComplete="off"
                                  placeholder="Nhập số điện thoại..."
                                  error={meta.touched && !!meta.error}
                                  helperText={
                                    meta.touched && meta.error ? meta.error : ""
                                  }
                                />
                              </>
                            )}
                          </Field>
                        </Grid>
  
                      <Grid item xs={12}>
                        <Field name={`address`}>
                          {({ field, meta }: any) => (
                            <>
                              <Typography
                                variant="subtitle2"
                                sx={{ color: "black", mb: 1 }}
                              >
                                Địa chỉ:
                              </Typography>
                              <TextField
                                {...field}
                                type="text"
                                minRows={2}
                                multiline
                                fullWidth
                                maxRows={20}
                                autoComplete="off"
                                //   label="Description"
                                placeholder="Địa chỉ của nhân viên..."
                                error={meta.touched && !!meta.error}
                                helperText={
                                  meta.touched && meta.error ? meta.error : ""
                                }
                              />
                            </>
                          )}
                        </Field>
                      </Grid>
  
                      <Grid item xs={6}>
                        <Field name={`username`}>
                          {({ field, meta }: any) => (
                            <>
                              <Typography
                                variant="subtitle2"
                                sx={{ color: "black", mb: 1 }}
                              >
                                Tên tài khoản:
                              </Typography>
                              <TextField
                                {...field}
                                type="text"
                                //   label="Type"
                                size="small"
                                autoComplete="off"
                                fullWidth
                                placeholder="Nhập tài khoản..."
                                error={meta.touched && !!meta.error}
                                helperText={
                                  meta.touched && meta.error ? meta.error : ""
                                }
                              />
                            </>
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={6}>
                        {" "}
                        <Field name={`password`}>
                          {({ field, meta }: any) => (
                            <>
                              <Typography
                                variant="subtitle2"
                                sx={{ color: "black", mb: 1 }}
                              >
                                Mật khẩu:
                              </Typography>
                              <TextField
                                {...field}
                                type="password"
                                //   label="Price"
                                autoComplete="off"
                                size="small"
                                fullWidth
                                placeholder="Nhập mật khẩu..."
                                error={meta.touched && !!meta.error}
                                helperText={
                                  meta.touched && meta.error ? meta.error : ""
                                }
                              />
                            </>
                          )}
                        </Field>
                      </Grid>                   
                    </Grid>
                    <FormControl
                     sx={{mt:2}}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "black", mb: 1 }}
                  >
                    Giới tính
                  </Typography>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={gender}
                    onChange={handleChange}
                  >
                    <Stack direction={"row"} justifyContent={"space-around"}>
                      <FormControlLabel
                        value="FEMALE"
                        control={<Radio />}
                        label="Nữ"
                      />
                      <FormControlLabel
                        value="MALE"
                        control={<Radio />}
                        label="Nam"
                      />
                    </Stack>
                  </RadioGroup>
                </FormControl>
                  <Box mb={2}></Box>
                <Field name={`yearsOfExperience`}>
                            {({ field, meta }: any) => (
                              <>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: "black", mb: 1 }}
                                >
                                  Số năm kinh nghiệm:
                                </Typography>
                                <TextField
                                  {...field}                               
                                  fullWidth
                                  autoComplete="off"
                                  size="small"
                                  type="number"
                                  placeholder="Số năm kinh nghiệm nhân viên..."
                                  error={meta.touched && !!meta.error}
                                  helperText={
                                    meta.touched && meta.error ? meta.error : ""
                                  }
                                />
                              </>
                            )}
                          </Field>
                    <Stack direction={"row"} sx={{ mt: 4 }} spacing={3}>
                      <Button
                        fullWidth
                        color="error"
                        onClick={handleClose}
                        variant="outlined"
                      >
                        Hủy
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        autoFocus
                        color="info"
                        type="submit"
                      >
                        Nộp
                      </Button>
                    </Stack>
                  </DialogContentText>
                </DialogContent>
              </Form>
            )}
          </Formik>
        </Dialog>
      </>
    );
  }
  