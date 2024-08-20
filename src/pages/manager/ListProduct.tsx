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

  Typography

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
import MenuActionProduct from "../../components/manager/MenuAction/MenuActionProduct";
import ModalCreateProduct from "../../components/manager/Modal/Product/ModalCreateNewProduct";
import ModalDeleteProduct from "../../components/manager/Modal/Product/ModalDeleteProduct";
import ModalUpdateProduct from "../../components/manager/Modal/Product/ModalUpdateProduct";
import useDebounce from "../../hook/useDebounce";
import { PaginationType } from "../../types/CommonType";
import {
  FilterProductType,
  ProductType,
} from "../../types/Product/ProductType";
import SubProductAPI from "../../utils/SubProductAPI";


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

export default function ListProduct() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showModalCreate, setShowModalCreate] = React.useState(false);
  const [showModalUpdate, setShowModalUpdate] = React.useState(false);
  const [showModalDelete, setShowModalDelete] = React.useState(false);
  const [listProduct, setListProduct] = React.useState<ProductType[] | []>([]);

  const [pagination, setPagination] = React.useState<PaginationType>({
    page: 1,
    size: 10,
    total: 10,
    totalPages: 1,
  });
  const [searchName, setSearchName] = React.useState("");
  const [filter, setFilter] = React.useState<FilterProductType>({
    page: 1,
    size: 10,
    Status: "",
  });
  const [selectedProduct, setSelectedProduct] =
    React.useState<ProductType | null>(null);
  const debouncedInputValue = useDebounce(searchName, 1000); // Debounce with 1000ms delay
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
  const renderStatus = (status: string) => {
    switch (status) {

      case "AVAILABLE":
        return (
          <Chip
            sx={{ minWidth: 120 }}
            label={"Đang hoạt động"}
            color="success"
            size="small"
          />
        );
      case "UNAVAILABLE":
        return (
          <Chip
            sx={{ minWidth: 120 }}
            label={"Ngưng hoạt động"}
            color="warning"
            size="small"
          />
        );
      case "OUTOFSTOCK":
        return <Chip sx={{ minWidth: 120 }} label={"Hết hàng"} color="error" size="small"/>;
      default:
        return (
          <Chip sx={{ minWidth: 120 }} label={"Chưa xác định"} color="error" />
        );
    }
  };

  const fetchAllProduct = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await SubProductAPI.getAll(filter);
      console.log({ data });
      setListProduct(data.items);
      setPagination({
        page: data.page,
        size: data.size,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.log("Error get list SubProduct: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);
  React.useEffect(() => {
    fetchAllProduct();
  }, [fetchAllProduct]);
  React.useEffect(() => {
    setFilter((prev) => ({ ...prev, Name: debouncedInputValue }));
  }, [debouncedInputValue]);
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
            placeholder="Nhập tên sản phẩm..."
            label="Tìm kiếm"
            value={searchName}
            onChange={(e) => handleSearchName(e.target.value)}
            sx={{ width: "345px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ minWidth: 120 }}>
            <FormControl sx={{ width: "345px" }} size="small">
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

                <MenuItem value={"AVAILABLE"}>Đang Hoạt động</MenuItem>
                <MenuItem value={"UNAVAILABLE"}>Ngưng hoạt động</MenuItem>
                <MenuItem value={"OUTOFSTOCK"}>Hết hàng</MenuItem>

              </Select>
            </FormControl>
          </Box>
        </Stack>
        <Button
          variant="contained"
          color="info"
          startIcon={<AddIcon />}
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
              <StyledTableCell align="center">Tên</StyledTableCell>
              <StyledTableCell align="center">Mô tả</StyledTableCell>
              <StyledTableCell align="center">Giá gốc</StyledTableCell>
              <StyledTableCell align="center">Giá bán</StyledTableCell>
              <StyledTableCell align="center">Thể loại</StyledTableCell>
              <StyledTableCell align="center">Trạng thái</StyledTableCell>
              <StyledTableCell align="center">Thao tác</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listProduct.length === 0 && isLoading === false && (
              <StyledTableRow>
                <StyledTableCell colSpan={8} align="left">
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
                  <StyledTableCell align="left">
                    <Skeleton variant="rectangular" />
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Skeleton variant="rectangular" />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            {listProduct.length > 0 &&
              isLoading === false &&
              listProduct.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell align="center" size="small">
                    {(pagination.page - 1) * pagination.size + index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="center" size="small">
                    {row.name}
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

                  {row.description}

                  </StyledTableCell>
                  <StyledTableCell align="center" size="small">
                    {row.stockPrice.toLocaleString()} VNĐ
                  </StyledTableCell>
                  <StyledTableCell align="center" size="small">

                    {row.sellingPrice.toLocaleString()} VNĐ
                  </StyledTableCell>
                  <StyledTableCell align="center" size="small">
                    {row.category.name}
                  </StyledTableCell>
                  <StyledTableCell align="center" size="small">
                    {renderStatus(row.status)}
                  </StyledTableCell>
                  <StyledTableCell align="center" size="small">
                    <MenuActionProduct
                      setOpenUpdate={setShowModalUpdate}

                      setOpenDelete={setShowModalDelete}
                      setSelectedProduct={setSelectedProduct}
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

      <ModalCreateProduct
        open={showModalCreate}
        setOpen={setShowModalCreate}
        fetchAllProduct={fetchAllProduct}
      />


      {selectedProduct && (
        <ModalUpdateProduct
          open={showModalUpdate}
          setOpen={setShowModalUpdate}
          fetchAllProduct={fetchAllProduct}
          data={selectedProduct}
        />
      )}
      {selectedProduct && (
        <ModalDeleteProduct
          open={showModalDelete}
          setOpen={setShowModalDelete}
          fetchAllProduct={fetchAllProduct}
          data={selectedProduct}
        />
      )}

    </Paper>
  );
}
