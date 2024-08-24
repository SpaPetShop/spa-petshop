import { Backdrop } from "@mui/material";
import Loader from "./Loader";

interface BackdropProps{
    open: boolean;
}
const LoadingComponentVersion1 = ({ open }: BackdropProps) => {
  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", backdropFilter: "blur(8px)", zIndex: 1000 }}
        open={open}
      >
        <Loader />
      </Backdrop>
    </div>
  );
};


export default function LoadingComponentVersion2({ open }: BackdropProps) {

  return (
    <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open={open} id='loading-progress'>
      <GiftLoading/>
    </Backdrop>
  )
}

export const GiftLoading = () => {
  return <img src='/gif_loading_no_background.gif' alt='Loading' width={400} />
}

export {LoadingComponentVersion1, LoadingComponentVersion2};