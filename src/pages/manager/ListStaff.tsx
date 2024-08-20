import AddIcon from "@mui/icons-material/Add";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import MenuActionUser from "../../components/manager/MenuAction/MenuActionUser";

import useDebounce from "../../hook/useDebounce";
import {
  UserType,
  FilterUserType,
} from "../../types/User/UserType";
import { PaginationType } from "../../types/CommonType";
import UserAPI from "../../utils/UserAPI";
import ModalCreateUser from "../../components/manager/Modal/User/ModalCreateUser";
import ModalUpdateUser from "../../components/manager/Modal/User/ModalUpdateUser";
import ModalDeleteUser from "../../components/manager/Modal/User/ModalDeleteUser";

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

export default function ListStaff() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showModalCreate, setShowModalCreate] = React.useState(false);
  const [showModalUpdate, setShowModalUpdate] = React.useState(false);
  const [showModalDelete, setShowModalDelete] = React.useState(false);
  const [listUser, setListUser] = React.useState<UserType[] | []>(
    []
  );
  const [pagination, setPagination] = React.useState<PaginationType>({
    page: 1,
    size: 10,
    total: 10,
    totalPages: 1,
  });
  const [searchName, setSearchName] = React.useState("");
  const [searchPhone, setSearchPhone] = React.useState("");
  const [filter, setFilter] = React.useState<FilterUserType>({
    page: 1,
    size: 10,
    Role:"Staff"
  });
  const [selectedUser, setSelectedUser] = React.useState<UserType | null>(null);

    const debouncedInputValueName = useDebounce(searchName, 500); // Debounce with 500ms delay
    const debouncedInputValuePhone = useDebounce(searchPhone, 500);

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
  const fetchAllUser = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await UserAPI.getAll(filter);
      console.log({ data });
      setListUser(data.items);
      setPagination({
        page: data.page,
        size: data.size,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.log("Error get list User: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);
  React.useEffect(() => {
    fetchAllUser();
  }, [fetchAllUser]);

  React.useEffect(() => {
    setFilter((prev) => ({ ...prev, FullName: debouncedInputValueName }));
  }, [debouncedInputValueName]);

  React.useEffect(() => {
    setFilter((prev) => ({ ...prev, PhoneNumber: debouncedInputValuePhone }));
  }, [debouncedInputValuePhone]);
  return (
    <Paper sx={{ p: 3 }}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={3}
          sx={{ mb: 3, mt: 2 }}
        >
          <TextField
            size="small"
            placeholder="Nhập tên nhân viên..."
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
          <Box sx={{ minWidth: 120 }}>
            <FormControl sx={{ width: "300px" }} size="small">
              <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filter.Status}
                label="Trạng thái"
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    Status: e.target.value as string,
                  }))
                }
              >
                <MenuItem value={""}>Tất cả</MenuItem>
                <MenuItem value={"ACTIVE"}>Đang hoạt động</MenuItem>
                <MenuItem value={"DEACTIVE"}>Ngưng hoạt động</MenuItem>

              </Select>
            </FormControl>
          </Box>
        </Stack>
        <Button
          variant="contained"
          color="info"
          startIcon={<AddIcon />}
          sx={{mb: 3, mt: 2 }}
          onClick={() => {
            setShowModalCreate(true);
          }}
        >
          Thêm
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ minHeight: 600 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">STT</StyledTableCell>
              <StyledTableCell align="center">Họ Và Tên</StyledTableCell>
              <StyledTableCell align="center">Tên Đăng Nhập</StyledTableCell>  
              <StyledTableCell align="center">Số Điện Thoại</StyledTableCell>  
              <StyledTableCell align="center">Email</StyledTableCell>   
              <StyledTableCell align="center">Trạng thái</StyledTableCell> 
              <StyledTableCell align="center">Thao tác</StyledTableCell>   
            </TableRow>
          </TableHead>
          <TableBody>
            {listUser.length === 0 && isLoading === false && (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="left">
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
                </StyledTableRow>
              ))}
            {listUser.length > 0 &&
              isLoading === false &&
              listUser.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell align="center" size="small">
                    {(pagination.page - 1) * pagination.size + index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="center" size="small">
                    {row.fullName}
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
                    {row.username}
                  </StyledTableCell>
                  <StyledTableCell align="center" size="small">
                    {row.phoneNumber}
                  </StyledTableCell>
                  <StyledTableCell align="center" size="small">
                    {row.email ? row.email : "-"}
                  </StyledTableCell>           
                  <StyledTableCell align="center" size="small">

                    {row.status === "ACTIVE" ? (
                      <Chip label={"Đang hoạt động"} color="success" size="small"/>
                    ) : (
                      <Chip label={"Ngưng hoạt động"} color="error" size="small"/>

                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center" size="small">
                    <MenuActionUser
                     setOpenUpdate={setShowModalUpdate}                  
                     setOpenDelete={setShowModalDelete}
                     setSelectedUser={setSelectedUser}
                     data={row}
                    />
                  </StyledTableCell>
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
      <ModalCreateUser
        open={showModalCreate}
        setOpen={setShowModalCreate}
        fetchAllUser={fetchAllUser}
      />

      {selectedUser && <ModalUpdateUser
        open={showModalUpdate}
        setOpen={setShowModalUpdate}
        fetchAllUser={fetchAllUser}
        data={selectedUser}
      />}
      {selectedUser && <ModalDeleteUser
        open={showModalDelete}
        setOpen={setShowModalDelete}
        fetchAllUser={fetchAllUser}
        data={selectedUser}
      />}
    </Paper>
  );
}
