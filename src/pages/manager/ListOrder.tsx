import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  Box,
  Chip,
  InputAdornment,
  Skeleton,
  Stack,
  TablePagination,
  TextField,
  Typography
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import MuiTab, { TabProps } from '@mui/material/Tab';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import useDebounce from "../../hook/useDebounce";
import { PaginationType } from "../../types/CommonType";
import { FilterOrderType, OrderType } from "../../types/Order/OrderType";
import { TabContext, TabList } from "@mui/lab";
import OrderAPI from "../../utils/OrderAPI";
import moment from "moment";
import MenuActionOrder from "../../components/manager/MenuAction/MenuActionOrder";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f4511e",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: "#81d4fa",
  },
}));
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
}))

export const renderStatusOrder = (status: string) => {
  switch (status) {
    case "UNPAID":
      return <Chip sx={{minWidth:120}} label={"Chưa Thanh Toán"} color="warning" size="small"/>
    case "PAID":
      return <Chip sx={{minWidth:120}}  label={"Đã Thanh Toán"} color="info" size="small"/>
    case "COMPLETED":
      return <Chip sx={{minWidth:120}}  label={"Hoàn Thành"} color="success" size="small"/>
    case "CANCELLED":
      return <Chip sx={{minWidth:120}}  label={"Đã Hủy"} color="error" size="small"/>

  }
}
export default function ListOrder() {
  const [isLoading, setIsLoading] = React.useState(false);

  const [listOrder, setListOrder] = React.useState<OrderType[] | []>(
    []
  );
  const [showModalUpdate, setShowModalUpdate] = React.useState(false);
  const [showModalDelete, setShowModalDelete] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<OrderType | null>(null)

  const [pagination, setPagination] = React.useState<PaginationType>({
    page: 1,
    size: 10,
    total: 10,
    totalPages: 1,
  });
  const [searchName, setSearchName] = React.useState("");
  const [searchPhone, setSearchPhone] = React.useState("");

  const [filter, setFilter] = React.useState<FilterOrderType>({
    page: 1,
    size: 10,

  });
  const debouncedInputValueName = useDebounce(searchName, 500); // Debounce with 500ms delay
  const debouncedInputValuePhone = useDebounce(searchPhone, 500);
  const [value, setValue] = React.useState<string>('ALL')
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const handleChangePage = (event: unknown, newPage: number) => {
    setFilter((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilter((prev) => ({ ...prev, page: 1, size: +event.target.value }));
  };
  const handleSearchName = (name: string) => {
    setSearchName(name);
  };

  const handleSearchPhone = (phone: string) => {
    setSearchPhone(phone);
  };

  const fetchAllOrder = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await OrderAPI.getAll(filter);
      console.log({ data });
      setListOrder(data.items);

      setPagination({
        page: data.page,
        size: data.size,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.log("Error get list Order: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  React.useEffect(() => {
    fetchAllOrder();
  }, [fetchAllOrder]);

  React.useEffect(() => {
    setFilter((prev) => ({ ...prev, FullName: debouncedInputValueName }));
  }, [debouncedInputValueName]);

  React.useEffect(() => {

    setFilter((prev) => ({ ...prev, PhoneNumber: debouncedInputValuePhone }));
  }, [debouncedInputValuePhone]);

  return (
    <Paper sx={{ p: 3 }}>
       <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='account-settings tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          >
            <Tab
              value='ALL'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Tất Cả Đơn Hàng</TabName>
                </Box>
              }
            />       
            <Tab
              value='SELECT'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Nhân Viên Được Chọn</TabName>
                </Box>
              }
            />
            <Tab
              value='RANDOM'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Nhân Viên Ngẫu Nhiên</TabName>
                </Box>
              }
            />
          </TabList>
          </TabContext>
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={3}
          sx={{ mb: 3, mt: 2 }}
        >
          <TextField
            size="small"
            placeholder="Nhập tên khách hàng..."
            label="Tìm kiếm"
            value={searchName}
            onChange={(e) => handleSearchName(e.target.value)}
            sx={{ width: "300px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            size="small"
            placeholder="Nhập số điện thoại..."
            label="Tìm kiếm"
            value={searchPhone}
            onChange={(e) => handleSearchPhone(e.target.value)}
            sx={{ width: "300px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
         <Box></Box>
        </Stack>


      <TableContainer component={Paper} sx={{ minHeight: 600 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">STT</StyledTableCell>

              <StyledTableCell align="center">Tên Khách Hàng</StyledTableCell>
              <StyledTableCell align="center">Ngày Tạo</StyledTableCell>  
              <StyledTableCell align="center">Ngày Hoàn Thành</StyledTableCell>  
              <StyledTableCell align="center">Giá Tiền</StyledTableCell> 
              <StyledTableCell align="center">Loại</StyledTableCell> 
              <StyledTableCell align="center">Trạng thái</StyledTableCell>   
              <StyledTableCell align="center">Thao Tác</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listOrder.length === 0 && isLoading === false && (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="left">

                  <Typography align="center">Không có dữ liệu!</Typography>
                </StyledTableCell>
              </StyledTableRow>
            )}
            {isLoading &&
              Array.from({ length: 10 }).map((data, index) => (
                <StyledTableRow hover={true} key={index}>
                  <StyledTableCell align="left">
                    <Skeleton variant="rectangular" />
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Skeleton variant="rectangular" />
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Skeleton variant="rectangular" />
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Skeleton variant="rectangular" />
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Skeleton variant="rectangular" />
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Skeleton variant="rectangular" />
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Skeleton variant="rectangular" />
                  </StyledTableCell>

                </StyledTableRow>
              ))}
            {listOrder.length > 0 &&
              isLoading === false &&
              listOrder.map((row, index) => (

                <StyledTableRow key={index}>
                  <StyledTableCell align="center" size="small">
                    {(pagination.page - 1) * pagination.size + index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="center" size="small">

                    {row.userInfo.fullName}

                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    size="small"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "250px",
                    }}
                  >

                    {moment(row.createdDate).format("DD/MM/YYYY")}
                  </StyledTableCell>
                  <StyledTableCell align="center" size="small">
                  {row.completedDate ? moment(row.completedDate).format("DD/MM/YYYY") : "-"}
                  </StyledTableCell>
                  <StyledTableCell align="center" size="small">
                    {row.finalAmount.toLocaleString()} VNĐ
                  </StyledTableCell>  
                  <StyledTableCell align="center" size="small">
                    {row.petInfor.typePet.name}
                  </StyledTableCell>    
                  <StyledTableCell align="center" size="small">
                    {renderStatusOrder(row.status)}
                  </StyledTableCell> 
                  <StyledTableCell align="center" size="small"> 
                    <MenuActionOrder
                     data={row}
                     setOpenDelete={setShowModalDelete}
                     setOpenUpdate={setShowModalUpdate}
                     setSelectedOrder={setSelectedOrder}
                  /></StyledTableCell>               

                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={pagination.total}
        rowsPerPage={pagination.size}
        page={pagination.page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Hàng trên trang"
        labelDisplayedRows={({ from, to, count }) => {
          return `${from}–${to} / ${count !== -1 ? count : `nhiều hơn ${to}`}`;
        }}
      />
    </Paper>
  );
}
