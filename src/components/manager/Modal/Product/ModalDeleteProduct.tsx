import {
    DialogActions,
    Stack,
    Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import { toast } from "react-toastify";
import { ProductType } from "../../../../types/Product/ProductType";
import SubProductAPI from "../../../../utils/SubProductAPI";
import LoadingComponentVersion2 from "../../../common/loading/Backdrop";
  
  type ModalDeleteProductProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    fetchAllProduct: () => void;
    data: ProductType | null;
  };
  export default function ModalDeleteProduct({
    open,
    setOpen,
    fetchAllProduct,
    data,
  }: ModalDeleteProductProps) {
    const handleClose = () => {
      setOpen(false);
    };
    const handleDelete = async() => {
        setOpen(false);
        try {
          const response = await SubProductAPI.delete(data?.id || "")  
          console.log({response});
          toast.success("Xóa thành công")
          fetchAllProduct() 
        } catch (error: any) {
          toast.error(error?.response?.data ? error?.response?.data?.error : "Xóa thất bại")  
        }
    }
    if (data)
      return (
        <>
          <Dialog open={open}>
      
                  <DialogTitle
                    id="alert-dialog-title"
                    sx={{ textAlign: "center" }}
                  >
                    {"XÁC NHẬN XÓA!"}
                  </DialogTitle>
                  <DialogContent>
                   <Typography>Bạn muốn xóa sản phẩm <strong>{data.name}</strong> này ?</Typography>
                  </DialogContent>
                  <DialogActions>
                    <Stack direction={"row"} sx={{ mt: 2 }} spacing={1}>
                      <Button
                        fullWidth
                        color="info"
                        onClick={handleClose}
                        variant="outlined"
                      >
                        Hủy
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        autoFocus
                        color="error"
                        type="submit"
                        onClick={handleDelete}
                      >
                        Xóa
                      </Button>
                    </Stack>
                  </DialogActions>
          </Dialog>
        </>
      );
    else return <LoadingComponentVersion2 open={data ? false : true} />;
  }
  