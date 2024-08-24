import {
  Box,
  DialogActions,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Field, Form, Formik } from "formik";
import * as React from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import CategoryAPI from "../../../../utils/CategoryAPI";

const validationSchema = Yup.object({
  name: Yup.string().required("*Tên thể loại không được để trống!"),
  description: Yup.string().required("*Mô tả không được để trống!"),
});

type ModalCreateCategoryProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllCategory: () => void;
};
export default function ModalCreateCategory({
  open,
  setOpen,
  fetchAllCategory,
}: ModalCreateCategoryProps) {
  
  const handleClose = () => {
    setOpen(false);
  };
  

  return (
    <>
      <Dialog
        open={open}
      >
        <Formik
          initialValues={{
            name: "",
            description: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const response = await CategoryAPI.create(values);
              console.log({ response });
              setOpen(false);
              toast.success("Tạo thành công !");
              fetchAllCategory();
            } catch (error) {
              toast.error("Tạo thất bại !");
            }
          }}
        >
          {({ values }) => (
            <Form>
              <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
                {"TẠO THỂ LOẠI MỚI"}
              </DialogTitle>
              <DialogContent>
                <Field name={`name`}>
                  {({ field, meta }: any) => (
                    <>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "black", mb: 1 }}
                      >
                        Tên thể loại:
                      </Typography>
                      <TextField
                        {...field}
                        type="text"
                        size="small"
                        placeholder="Nhập tên thể loại ..."
                        fullWidth
                        autoComplete="off"
                        sx={{ minWidth: 400 }}
                        //   label="Name of the product"
                        error={meta.touched && !!meta.error}
                        helperText={
                          meta.touched && meta.error ? meta.error : ""
                        }
                      />
                    </>
                  )}
                </Field>
                <Box mb={3}></Box>
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
                        multiline
                        minRows={3}
                        placeholder="Nhập mô tả..."
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
   
              </DialogContent>
              <DialogActions>
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
                </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}
