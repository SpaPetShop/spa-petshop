import {
  Avatar,
  Box,
  Card,
  CardMedia,
  Checkbox,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Field, Form, Formik } from "formik";
import * as React from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  name: Yup.string().required("Tên nhân viên không được để trống!"),
  description: Yup.string().required("Mô tả không được để trống!"),
  dateOfBirth: Yup.mixed().required("Ngày sinh không được để trống!"),
  hometown: Yup.string().required("Quê quán không được để trống!"),
  phone: Yup.number()
    .required("Số diện thoại không được để trống!")
    .min(10, "Số điện thoại phải có ít nhất 10 số!"),
  username: Yup.string().required("Tên đăng nhập không được để trống!"),
  password: Yup.mixed().required("Mật khẩu không được để trống!"),
  fileImg: Yup.mixed().required("Ảnh nhân viên không được thiếu!"),
});

type ModalCreateStaffProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ModalCreateStaff({
  open,
  setOpen,
}: ModalCreateStaffProps) {
  const [imgSrc, setImgSrc] = React.useState<any>("");
  const [checkedMorning, setCheckedMorning] = React.useState(false);
  const [checkedAfternoon, setCheckedAfternoon] = React.useState(false);
  const [checkedAllday, setCheckedAllday] = React.useState(false);

  const handleCheckMorning = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedMorning(event.target.checked);
    if (event.target.checked) {
      setCheckedAfternoon(false);
      setCheckedAllday(false);
    }
  };
  const handleCheckAfternoon = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedAfternoon(event.target.checked);
    if (event.target.checked) {
      setCheckedMorning(false);
      setCheckedAllday(false);
    }
  };
  const handleCheckAllday = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedAllday(event.target.checked);
    if (event.target.checked) {
      setCheckedMorning(false);
      setCheckedAfternoon(false);
    }
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
            name: "",
            description: "",
            hometown: "",
            username: "",
            password: "",
            dateOfBirth: "",
            phone: "",
            fileImg: null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const submitValues = new FormData();
              if (values.fileImg)
                submitValues.append("fileImg", values.fileImg);
              // call api here
              setOpen(false);
              toast.success("Tạo thành công !");
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
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        {/* {imgSrc && (
                          <Card sx={{ mb: 2 }}>
                            <CardMedia
                              component="img"
                              height="200"
                              image={imgSrc}
                              //sx={{ objectFit: "contain" }}
                              alt="Product Image"
                            />
                          </Card>
                        )} */}
                        <Avatar
                          src={imgSrc}
                          sx={{
                            objectFit: "contain",
                            width: 250,
                            height: 250,
                            border: "1px solid",
                            mb: 2,
                          }}
                        />

                        <Field name="fileImg">
                          {({ field, form, meta }: any) => (
                            <>
                              <Button
                                component="label"
                                color="info"
                                variant="outlined"
                                htmlFor="fileImg"
                                size="small"
                              >
                                Chọn ảnh nhân viên
                                <input
                                  hidden
                                  multiple
                                  type="file"
                                  id="fileImg"
                                  accept="image/png, image/jpeg"
                                  onChange={(event) => {
                                    const reader = new FileReader();
                                    const files = event.currentTarget.files;
                                    if (files && files.length !== 0) {
                                      reader.onload = () =>
                                        setImgSrc(reader.result);
                                      reader.readAsDataURL(files[0]);
                                    }
                                    if (event.currentTarget.files) {
                                      form.setFieldValue(
                                        field.name,
                                        event.currentTarget.files[0]
                                      );
                                    }
                                  }}
                                />
                              </Button>
                              {meta.touched && !!meta.error && (
                                <div
                                  style={{
                                    color: "red",
                                    fontSize: "13px",
                                    marginLeft: "12px",
                                    marginTop: "5px",
                                  }}
                                >
                                  {meta.error}
                                </div>
                              )}
                            </>
                          )}
                        </Field>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      {/* Input name */}
                      <Grid item xs={12} sx={{mb:1}}>
                        <Field name={`name`}>
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

                      {/* Input date of birth */}
                      <Grid item xs={12} sx={{mb:1}}>
                        <Field name={`dateOfBirth`}>
                          {({ field, meta }: any) => (
                            <>
                              <Typography
                                variant="subtitle2"
                                sx={{ color: "black", mb: 1 }}
                              >
                                Ngày sinh:
                              </Typography>
                              <TextField
                                {...field}
                                type="date"
                                fullWidth
                                autoComplete="off"
                                size="small"
                                placeholder="Chọn ngày sinh..."
                                error={meta.touched && !!meta.error}
                                helperText={
                                  meta.touched && meta.error ? meta.error : ""
                                }
                              />
                            </>
                          )}
                        </Field>
                      </Grid>

                      {/* Input hometown */}
                      <Grid item xs={12} sx={{mb:1}}>
                        <Field name={`hometown`}>
                          {({ field, meta }: any) => (
                            <>
                              <Typography
                                variant="subtitle2"
                                sx={{ color: "black", mb: 1 }}
                              >
                                Quê quán:
                              </Typography>
                              <TextField
                                {...field}
                                fullWidth
                                //   label="Length"
                                autoComplete="off"
                                size="small"
                                placeholder="Nhập quê quán..."
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
                        <Field name={`phone`}>
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
                                type="number"
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
                    </Grid>

                    <Grid item xs={12}>
                      <Field name={`description`}>
                        {({ field, meta }: any) => (
                          <>
                            <Typography
                              variant="subtitle2"
                              sx={{ color: "black", mb: 1 }}
                            >
                              Mô tả:
                            </Typography>
                            <TextField
                              {...field}
                              type="text"
                              minRows={3}
                              multiline
                              fullWidth
                              maxRows={20}
                              autoComplete="off"
                              //   label="Description"
                              placeholder="Mô tả về nhân viên..."
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
                    <Grid item xs={12}>
                      <Typography  variant="subtitle2"
                              sx={{ color: "black" }}>Chọn ca làm việc: </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Checkbox
                        checked={checkedMorning}
                        onChange={handleCheckMorning}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                      Ca sáng
                    </Grid>
                    <Grid item xs={4}>
                      <Checkbox
                        checked={checkedAfternoon}
                        onChange={handleCheckAfternoon}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                      Ca chiều
                    </Grid>
                    <Grid item xs={4}>
                      <Checkbox
                        checked={checkedAllday}
                        onChange={handleCheckAllday}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                      Cả ngày
                    </Grid>
                  </Grid>

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
