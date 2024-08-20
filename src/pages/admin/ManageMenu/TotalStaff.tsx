import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Chip,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  TablePagination,
  tableCellClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import moment from 'moment';
import AdminManageStaffAPI from '../../../utils/AdminMangeStaffAPI';
import ModalCreateStaff from '../../../components/manager/Modal/ModalCreateStaff';
import MenuActionManageStaff from '../../../components/manager/MenuAction/MenuActionManageStaff';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f4511e',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: '#81d4fa',
  },
}));

interface Staff {
  id: string;
  username: string;
  role: string;
  fullName: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address?: string | null;
  status: string;
  image?: string | null;
}

export default function TotalStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModalCreate, setShowModalCreate] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response:any = await AdminManageStaffAPI.getAll({ role: 'Staff' });
        setStaff(response.items);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
      }
    };

    fetchStaff();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchName = (name: string) => {
    setSearchTerm(name);
  };

  const filteredStaff = staff.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedStaff = filteredStaff.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <TextField
          size="small"
          placeholder="Nhập tên nhân viên ..."
          label="Tìm kiếm"
          onChange={(e) => handleSearchName(e.target.value)}
          sx={{ mt: 2, mb: 3, ml: 3, width: '345px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="info"
          startIcon={<PersonAddAltIcon />}
          onClick={() => setShowModalCreate(true)}
        >
          Tạo nhân viên
        </Button>
      </Stack>
      <TableContainer component={Paper} sx={{ minHeight: 600 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">STT</StyledTableCell>
              <StyledTableCell align="center">Tên nhân viên</StyledTableCell>
              <StyledTableCell align="center">Số điện thoại</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Gioi tinh</StyledTableCell>
              <StyledTableCell align="center">Trạng thái</StyledTableCell>
              <StyledTableCell align="center">Thao tác</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStaff.map((row, index) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell align="center" size="small">
                  {page * rowsPerPage + index + 1}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" size="small">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar src={row.image || '/default-avatar.png'} />
                    <Typography>{row.fullName}</Typography>
                  </Stack>
                </StyledTableCell>
                <StyledTableCell align="center" size="small">
                  {row.phoneNumber}
                </StyledTableCell>
                <StyledTableCell align="center" size="small">
                  {row.email}
                </StyledTableCell>
                <StyledTableCell align="center" size="small">
                  {row.gender}
                </StyledTableCell>
                {/* <StyledTableCell align="center" size="small">
                  {row.address}
                </StyledTableCell>
                */}
                <StyledTableCell align="center" size="small">
                  {row.status === 'Activate' ? (
                    <Chip label="Đang hoạt động" color="success" />
                  ) : (
                    <Chip label="Ngưng hoạt động" color="error" />
                  )}
                </StyledTableCell>
                <StyledTableCell align="center" size="small">
                  <MenuActionManageStaff />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredStaff.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <ModalCreateStaff open={showModalCreate} setOpen={setShowModalCreate} />
    </Paper>
  );
}
