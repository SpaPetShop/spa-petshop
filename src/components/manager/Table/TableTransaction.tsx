
// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
// import {
//     Avatar,
//     Box,
//     Chip,
//     InputAdornment,
//     Stack,
//     TablePagination,
//     TextField,
//     Typography,
// } from "@mui/material";
// import Paper from "@mui/material/Paper";
// import { styled } from "@mui/material/styles";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import moment from "moment";
// import * as React from "react";
// import { OrderType } from "../../../types/Order/OrderType";
// import MenuActionManageOrder from "../MenuAction/MenuActionManageOrder";
// import MenuFilterStatusOrder from "../MenuAction/MenuFilterStatusOrder";


// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: "#f4511e",
//     color: theme.palette.common.white,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
//   "&:hover": {
//     backgroundColor: "#81d4fa",
//   },
// }));

// const dataOrders: OrderType[] = [
//   {
//     id: "1",
//     avatar: "/",
//     createdDate: "8/8/2024",
//     userName: "Hà Thành Đạt 1",
//     phone: "0123456789",
//     status: "PENDING",
//     service:{
//       id:"sv1",
//       createdDate:"8/8/2024",
//       name:"Tắm thú cưng",
//       status:"ACTIVE",
//       price:100000
//     }
//   },
//   {
//     id: "2",
//     avatar: "/",
//     createdDate: "8/8/2024",
//     userName: "Hà Thành Đạt 2",
//     phone: "0123456789",
//     status: "PROCESSING",
//     service:{
//       id:"sv2",
//       createdDate:"8/8/2024",
//       name:"Cắt móng cưng",
//       status:"ACTIVE",
//       price:100000
//     }
//   },
//   {
//     id: "3",
//     avatar: "/",
//     createdDate: "8/8/2024",
//     userName: "Hà Thành Đạt 3",
//     phone: "0123456789",
//     status: "CONFIRMED",
//     service:{
//       id:"sv3",
//       createdDate:"8/8/2024",
//       name:"Chải lông thú cưng",
//       status:"ACTIVE",
//       price:100000
//     }
//   },
//   {
//     id: "4",
//     avatar: "/",
//     createdDate: "8/8/2024",
//     userName: "Hà Thành Đạt 4",
//     phone: "0123456789",
//     status: "COMPLETED",
//     service:{
//       id:"sv4",
//       createdDate:"8/8/2024",
//       name:"Massage thú cưng",
//       status:"ACTIVE",
//       price:100000
//     }
//   },
//   {
//     id: "5",
//     avatar: "/",
//     createdDate: "8/8/2024",
//     userName: "Hà Thành Đạt 5",
//     phone: "0123456789",
//     status: "CANCELLED",
//     service:{
//       id:"sv5",
//       createdDate:"8/8/2024",
//       name:"Diệt bọ thú cưng",
//       status:"ACTIVE",
//       price:100000
//     }
//   },
// ];

// export default function TableTransaction() {
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);
//   const [listOrders, setListOrders] = React.useState<OrderType[] | []>(dataOrders);
//   const startIndex = page * rowsPerPage;
//   const endIndex = startIndex + rowsPerPage;
//   const handleChangePage = (event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const handleSearchName = (name: string) => {
//     if (name) setListOrders(dataOrders.filter((order) => order.userName.includes(name)));
//     else setListOrders(dataOrders.slice(startIndex, endIndex));
//   };

//   const renderStatus = (status: string) => {
//     switch (status) {
//       case "PENDING":
//         return <Chip sx={{minWidth:120}} label={"Đang chờ"} color="warning"/>
//       case "CONFIRMED":
//         return <Chip sx={{minWidth:120}}  label={"Đã xác nhận"} color="info"/>
//       case "PROCESSING":
//         return <Chip  sx={{minWidth:120}} label={"Đang tiến hành"} color="secondary"/>
//       case "COMPLETED":
//         return <Chip sx={{minWidth:120}}  label={"Hoàn thành"} color="success"/>
//       case "CANCELLED":
//         return <Chip sx={{minWidth:120}}  label={"Đã hủy"} color="error"/>
//     }
//   }
//   React.useEffect(() => {
//     const newData = dataOrders.slice(startIndex, endIndex);
//     setListOrders(newData);
//   }, [page, rowsPerPage, startIndex, endIndex]);

//   return (
//     <Box sx={{ p: 5 }}>
//       <TextField
//         size="small"
//         placeholder="Nhập tên người dùng ..."
//         label="Tìm kiếm"
//         onChange={(e) => handleSearchName(e.target.value)}
//         sx={{ mb: 3, width: "345px" }}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <SearchOutlinedIcon />
//             </InputAdornment>
//           ),
//         }}
//       />
//       <TableContainer component={Paper} sx={{ minHeight: 600 }}>
//         <Table sx={{ minWidth: 700 }} aria-label="customized table">
//           <TableHead>
//             <TableRow>
//               <StyledTableCell align="center" size="small">
//                 STT
//               </StyledTableCell>
//               <StyledTableCell align="center" size="small">
//                 Tên khách hàng
//               </StyledTableCell>
//               <StyledTableCell align="center" size="small">
//                 Số điện thoại
//               </StyledTableCell>
//               <StyledTableCell align="center" size="small">
//                 Ngày tham gia
//               </StyledTableCell>
//               <StyledTableCell align="center" size="small">
//                 Tên dịch vụ
//               </StyledTableCell>
//               <StyledTableCell align="center" size="small">
//                 Tổng giá tiền
//               </StyledTableCell>
//               <StyledTableCell align="center" size="small">
//                 <Stack
//                   direction={"row"}
//                   alignItems={"center"}
//                   justifyContent={"center"}
//                 >
//                   Trạng thái <MenuFilterStatusOrder />
//                 </Stack>
//               </StyledTableCell>
//               <StyledTableCell align="center" size="small">
//                 Thao tác
//               </StyledTableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {listOrders.map((row, index) => (
//               <StyledTableRow key={index}>
//                 <StyledTableCell align="center" size="small">
//                   {page * rowsPerPage + index + 1}
//                 </StyledTableCell>
//                 <StyledTableCell component="th" scope="row" size="small">
//                   <Stack direction={"row"} alignItems={"center"} spacing={2}>
//                     <Avatar src={row.avatar} />
//                     <Typography>{row.userName}</Typography>
//                   </Stack>
//                 </StyledTableCell>
//                 <StyledTableCell align="center" size="small">
//                   {row.phone}
//                 </StyledTableCell>
//                 <StyledTableCell align="center" size="small">
//                   {moment(row.createdDate).format("DD/MM/YYYY")}
//                 </StyledTableCell>
//                 <StyledTableCell align="center" size="small">
//                   {row.service.name}
//                 </StyledTableCell>
//                 <StyledTableCell align="center" size="small">
//                   {row.service.price.toLocaleString()} VNĐ
//                 </StyledTableCell>
//                 <StyledTableCell align="center" size="small">
//                  {renderStatus(row.status)}
//                 </StyledTableCell>
//                 <StyledTableCell align="center" size="small">
//                   <MenuActionManageOrder/>
//                 </StyledTableCell>
//               </StyledTableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={dataOrders.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Box>
//   );
// }

import React from 'react'

const TableTransaction = () => {
  return (
    <div>TableTransaction</div>
  )
}

export default TableTransaction
