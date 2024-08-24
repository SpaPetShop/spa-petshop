import DeleteIcon from "@mui/icons-material/Delete";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Box, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Field, FieldArray, Form, Formik } from "formik";
import * as React from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Tên dịch vụ không được để trống!"),
  price: Yup.number()
    .required("Giá tiền không được để trống!")
    .min(1000, "Giá tiền không được thấp hơn 1.000 VNĐ!"),
  description: Yup.string().required("Mô tả không được để trống!"),
  listSubService: Yup.array().of(
    Yup.string().required("Dịch vụ con không được để trống!")
  ),
});

type ModalCreateServiceProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ModalCreateService({
  open,
  setOpen,
}: ModalCreateServiceProps) {
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
            listSubService: [""],
            price: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            try {
              console.log(values);
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
                {"TẠO DỊCH VỤ MỚI"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <Field name={`name`}>
                    {({ field, meta }: any) => (
                      <>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "black", mb: 1 }}
                        >
                          Tên Combo:
                        </Typography>
                        <TextField
                          {...field}
                          type="text"
                          size="small"
                          placeholder="Nhập tên dịch vụ..."
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
                  <Box mb={1}></Box>
                  <Field name={`description`}>
                    {({ field, meta }: any) => (
                      <>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "black", mb: 1 }}
                        >
                          Mô tả Combo:
                        </Typography>
                        <TextField
                          {...field}
                          type="text"
                          size="small"
                          placeholder="Nhập mô tả..."
                          fullWidth
                          multiline
                          minRows={3}
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
                  <Box mb={1}></Box>
                  <Field name={`price`}>
                    {({ field, meta }: any) => (
                      <>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "black", mb: 1 }}
                        >
                          Giá tiền:
                        </Typography>
                        <TextField
                          {...field}
                          type="number"
                          fullWidth
                          size="small"
                          autoComplete="off"
                          placeholder="Nhập giá tiền..."
                          sx={{ minWidth: 400 }}
                          error={meta.touched && !!meta.error}
                          helperText={
                            meta.touched && meta.error ? meta.error : ""
                          }
                        />
                      </>
                    )}
                  </Field>
                  <Divider sx={{mt:3, borderBottomWidth: '5px', mb:1, bgcolor:"#00e5ff"}}/>
                  <Typography variant="h6" sx={{mt:1, mb:2, color:"black"}}>Danh sách các dịch vụ trong combo:</Typography>
                  <FieldArray name="listSubService">
                    {({ push, remove }) => (
                      <Box>
                        {values.listSubService.map(
                          (subService: any, index: any) => (
                            <Stack
                              direction={"row"}
                              alignItems={"center"}                            
                              spacing={1}
                              sx={{mb:3}}
                            >
                              <Field name={`listSubService.${index}`}>
                                {({ field, meta }: any) => (
                                  <Box>
                                    {/* <Typography
                                      variant="subtitle2"
                                      sx={{ color: "black", mb: 1 }}
                                    >
                                      Tên dịch vụ {index + 1}:
                                    </Typography> */}
                                    <TextField
                                      {...field}
                                      label={`Dịch vụ ${index + 1}`}
                                      type="text"
                                      size="small"
                                      placeholder="Nhập tên dịch vụ..."
                                      fullWidth
                                      autoComplete="off"
                                      sx={{ minWidth: 400 }}
                                      error={meta.touched && !!meta.error}
                                      helperText={
                                        meta.touched && meta.error
                                          ? meta.error
                                          : ""
                                      }
                                    />
                                  </Box>
                                )}
                              </Field>
                              {/* hiển thị nút delete cho phần tử thứ 2 trở đi */}
                              {index > 0 && (
                                <
                                >
                                  <IconButton
                                    aria-label="delete"
                                    size="small"
                                    onClick={() => remove(index)}
                                  >
                                    <DeleteIcon
                                      fontSize="inherit"
                                      color="error"
                                    />
                                  </IconButton>
                                </>
                                //   <Button onClick={()=>remove(index)}> delete {index + 1}</Button>
                              )}
                            </Stack>
                          )
                        )}

                        <Box>
                          <Button
                            startIcon={<AddOutlinedIcon />}
                            variant="outlined"
                            size="small"
                            onClick={() => push("")}     
                            color="info"
                          >
                            Thêm
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </FieldArray>

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
                      Tạo
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
