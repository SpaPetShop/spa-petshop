import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import PetsIcon from "@mui/icons-material/Pets";
import {
  Box,
  Button,
  FormControl,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { LoadingComponentVersion2 } from "../../../components/common/loading/Backdrop";
import AuthAPI from "../../../utils/AuthAPI";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object({
  username: Yup.string()
    .required("*Tên đăng nhập không được để trống !"),
  password: Yup.string()
    .required("*Mật khẩu không được để trống !")
    .min(6, "*Mật khẩu phải có ít nhất 6 kí tự !")
    .max(20, "*Mật khẩu tối đa 20 kí tự !"),
  fullName: Yup.string()
  .required("*Họ và tên không được để trống !"),
  phoneNumber: Yup.string().required("*Số điện thoại không được để trống !").matches(phoneRegExp, '*Số điện thoại không hợp lệ !'),
  email: Yup.string().email("*Địa chỉ Email không hợp lệ !"),
});

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [gender, setGender] = useState("MALE");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender((event.target as HTMLInputElement).value);
  };

  return (
    <Box
      style={{
        width: "100vw",
        height: "100vh",
        // paddingTop: "20vh",
        backgroundImage: 'url("/background_login.jpg")',
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
      }}
    >
      <LoadingComponentVersion2 open={isLoading} />
      <Container
        component="main"
        maxWidth="xs"
        sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", p: 5 }}
      >
        <Box
          sx={{
            // m: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: "#ff5722",
            }}
          >
            <PetsIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Chào mừng bạn đến với PET SPA
          </Typography>
          <Formik
            initialValues={{
              username: "",
              password: "",
              fullName: "",
              phoneNumber: "",
              email: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
                setIsLoading(true);
                console.log({...values, gender});
                await AuthAPI.customerRegistAccount({...values, gender})
                toast.success("Đăng kí tài khoản thành công !");
                navigate("/login")
              } catch (error) {
                toast.error("Đăng kí tài khoả thất bại !");
              } finally {
                setIsLoading(false);
              }
            }}
          >
            {({ values }) => (
              <Form>
                <Field name={`fullName`}>
                  {({ field, meta }: any) => (
                    <>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "black", mb: 1 }}
                      >
                        Họ và tên:
                      </Typography>
                      <TextField
                        {...field}
                        type="text"
                        size="small"
                        placeholder="Nhập họ và tên..."
                        fullWidth
                        autoComplete="off"
                        sx={{ minWidth: 400 }}
                        error={meta.touched && !!meta.error}
                        helperText={
                          meta.touched && meta.error ? meta.error : ""
                        }
                      />
                    </>
                  )}
                </Field>
                <Box mb={2}></Box>
                <Field name={`username`}>
                  {({ field, meta }: any) => (
                    <>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "black", mb: 1 }}
                      >
                        Tên đăng nhập:
                      </Typography>
                      <TextField
                        {...field}
                        type="text"
                        size="small"
                        placeholder="Nhập tên đăng nhập..."
                        fullWidth
                        autoComplete="off"
                        sx={{ minWidth: 400 }}
                        error={meta.touched && !!meta.error}
                        helperText={
                          meta.touched && meta.error ? meta.error : ""
                        }
                      />
                    </>
                  )}
                </Field>
                <Box mb={2}></Box>
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
                        size="small"
                        placeholder="Nhập mật khẩu..."
                        fullWidth
                        autoComplete="off"
                        sx={{ minWidth: 400 }}
                        error={meta.touched && !!meta.error}
                        helperText={
                          meta.touched && meta.error ? meta.error : ""
                        }
                      />
                    </>
                  )}
                </Field>
                <Box mb={2}></Box>
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
                        type="text"
                        size="small"
                        placeholder="Nhập số điện thoại..."
                        fullWidth
                        autoComplete="off"
                        sx={{ minWidth: 400 }}
                        error={meta.touched && !!meta.error}
                        helperText={
                          meta.touched && meta.error ? meta.error : ""
                        }
                      />
                    </>
                  )}
                </Field>
                <Box mb={2}></Box>
                <Field name={`email`}>
                  {({ field, meta }: any) => (
                    <>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "black", mb: 1 }}
                      >
                        Địa chỉ Email:
                      </Typography>
                      <TextField
                        {...field}
                        type="text"
                        size="small"
                        placeholder="Nhập địa chỉ Email..."
                        fullWidth
                        autoComplete="off"
                        sx={{ minWidth: 400 }}
                        error={meta.touched && !!meta.error}
                        helperText={
                          meta.touched && meta.error ? meta.error : ""
                        }
                      />
                    </>
                  )}
                </Field>
                <Box mb={2}></Box>
                <FormControl>
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

                <Button
                  type="submit"
                  fullWidth
                  style={{
                    borderRadius: 35,
                    backgroundColor: "#ff5722",
                    // padding: "18px 36px",
                    fontSize: "18px",
                  }}
                  sx={{ mt: 2 }}
                  variant="contained"
                >
                  Đăng kí tài khoản
                </Button>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  spacing={1}
                  sx={{ mt: 2, cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  <KeyboardBackspaceIcon fontSize="small" />
                  <Typography align="center" variant="body2">
                    Đăng nhập
                  </Typography>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </Box>
  );
}
