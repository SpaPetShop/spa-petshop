import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import PetsIcon from "@mui/icons-material/Pets";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Field, Form, Formik } from "formik";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  LoadingComponentVersion2
} from "../../../components/common/loading/Backdrop";
import { UserContext } from "../../../context/AuthContext";
import { ROLES } from "../../../routes/roles";
import AuthAPI from "../../../utils/AuthAPI";

const validationSchema = Yup.object({
  username: Yup.string()
    .required("*Tên đăng nhập không được để trống !"),
  password: Yup.string()
    .required("*Mật khẩu không được để trống !"),
});

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useContext(UserContext);
  const handleNavigateByRole = (role: string) => {
    switch (role) {
      case ROLES.ADMIN:
        return navigate("/admin-dashboard");
      case ROLES.MANAGER:
        return navigate("/manager-manage-order");
      case ROLES.CUSTOMER:
        return navigate("/");
      case ROLES.STAFF:
        return navigate("/");
    }
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
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
                setIsLoading(true);           
                const response = await AuthAPI.login(values);
                localStorage.setItem(
                  "userData",
                  JSON.stringify({
                    accessToken: response.tokenModel.accessToken,
                    avatarUrl: response.image,
                    email: "",
                    id: response.id,
                    name: response.fullName,
                    role: response.role?.toUpperCase(),
                    status: response.status?.toUpperCase()
                  })
                );
                currentUser.setUser({
                  accessToken: response.tokenModel.accessToken,
                  avatarUrl: response.image,
                  email: "",
                  id: response.id,
                  name: response.fullName,
                  role: response.role?.toUpperCase(),
                  status: response.status?.toUpperCase()
                });
                handleNavigateByRole(response.role?.toUpperCase());
                toast.success("Đăng nhập thành công !");
              } catch (error: any) {
                if(error?.response?.data){
                  toast.error(error?.response?.data?.error || "Đăng nhập thất bại !");
                }else{
                  toast.error("Đăng nhập thất bại !");
                }
                
              } finally {
                setIsLoading(false);
              }
            }}
          >
            {({ values }) => (
              <Form>
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
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    sx={{ mt: 1 }}
                    label="Ghi nhớ tôi"
                  />
                  <Box
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/register")}
                  >
                    <Typography
                      align="center"
                      sx={{ fontSize: 16, color: "#4a148c" }}
                      variant="body2"
                    >
                      Đăng kí tài khoản
                    </Typography>
                  </Box>
                </Stack>

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
                  Đăng nhập
                </Button>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  spacing={1}
                  sx={{ mt: 2, cursor: "pointer" }}
                  onClick={() => navigate("/")}
                >
                  <KeyboardBackspaceIcon fontSize="small" />
                  <Typography align="center" variant="body2">
                    Trang chủ
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
