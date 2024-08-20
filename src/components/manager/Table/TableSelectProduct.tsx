import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { PaginationType } from "../../../types/CommonType";
import {
  FilterProductType,
  ProductType,
} from "../../../types/Product/ProductType";
import SubProductAPI from "../../../utils/SubProductAPI";
import { FormikProps, FormikValues } from "formik";

interface HeadCell {
  disablePadding: boolean;
  id: keyof ProductType;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Tên sản phẩm",
  },
  {
    id: "description",
    numeric: true,
    disablePadding: false,
    label: "Mô tả",
  },
  {
    id: "stockPrice",
    numeric: true,
    disablePadding: false,
    label: "Giá gốc",
  },
  {
    id: "sellingPrice",
    numeric: true,
    disablePadding: false,
    label: "Giá bán",
  },
  {
    id: "category",
    numeric: true,
    disablePadding: false,
    label: "Loại",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "center" : "center"}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}
interface TableSelectProductProps {
  listProductSelected: [] | string[];
  setListProductSelected: React.Dispatch<React.SetStateAction<[] | string[]>>;
  setTotalSellingPriceOfSubProuducts: React.Dispatch<
    React.SetStateAction<number>
  >;
  formikRef: React.RefObject<FormikProps<FormikValues>>;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          Đã chọn {numSelected} sản phẩm
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Danh sách sản phẩm
        </Typography>
      )}
      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
}
export default function TableSelectProduct({
  listProductSelected,
  setListProductSelected,
  setTotalSellingPriceOfSubProuducts,
  formikRef,
}: TableSelectProductProps) {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [listProduct, setListProduct] = React.useState<ProductType[] | []>([]);
  const [pagination, setPagination] = React.useState<PaginationType>({
    page: 1,
    size: 10,
    total: 1,
    totalPages: 1,
  });
  const [filter, setFilter] = React.useState<FilterProductType>({
    page: 1,
    size: 10,
    Status: "Available",
  });
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = listProduct.map((n) => n.id);
      setSelected(newSelected);
      setListProductSelected(newSelected);
      const commonElements = listProduct.filter((element) =>
        newSelected.includes(element.id)
      );
      let totalSubPrice = 0;
      commonElements.forEach((element) => {
        totalSubPrice = totalSubPrice + element.sellingPrice;
      });
      setTotalSellingPriceOfSubProuducts(totalSubPrice);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    setListProductSelected(newSelected);
    const commonElements = listProduct.filter((element) =>
      newSelected.includes(element.id)
    );
    let totalSubPrice = 0;
    commonElements.forEach((element) => {
      totalSubPrice = totalSubPrice + element.sellingPrice;
    });
    setTotalSellingPriceOfSubProuducts(totalSubPrice);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setFilter((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilter((prev) => ({ ...prev, page: 1, size: +event.target.value }));
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;
  React.useEffect(() => {
    if (listProductSelected.length > 0) {
      setSelected(listProductSelected);
    }
  }, [listProductSelected]);
  React.useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        const data = await SubProductAPI.getAll(filter);
        setListProduct(data.items);
        setPagination({
          page: data.page,
          size: data.size,
          total: data.total,
          totalPages: data.totalPages,
        });
      } catch (error) {
        console.log("Error get list Product: ", error);
      }
    };
    fetchAllProduct();
  }, [filter]);

  React.useEffect(() => {
    if (formikRef.current?.values.categoryId) {
      setSelected([]);
      setFilter((prev) => ({
        ...prev,
        CategoryId: formikRef.current?.values.categoryId,
      }));
    }
  }, [formikRef.current?.values.categoryId, formikRef]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ width: "100%", mb: 2, border: "1px solid" }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 500 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={pagination.total}
            />
            <TableBody>
              {listProduct.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>

                    <TableCell align="center">{row.description}</TableCell>
                    <TableCell align="center">
                      {row.stockPrice.toLocaleString()} VNĐ
                    </TableCell>
                    <TableCell align="center">
                      {row.sellingPrice.toLocaleString()} VNĐ
                    </TableCell>
                    <TableCell align="center">{row.category.name}</TableCell>
                  </TableRow>
                );
              })}
              {listProduct.length === 0 && (
                <TableCell colSpan={6} align="center">
                  Không có dữ liệu
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 30]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.size}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Hàng trên trang"
          labelDisplayedRows={({ from, to, count }) => {
            return `${from}–${to} / ${
              count !== -1 ? count : `nhiều hơn ${to}`
            }`;
          }}
        />
      </Box>
    </Box>
  );
}
