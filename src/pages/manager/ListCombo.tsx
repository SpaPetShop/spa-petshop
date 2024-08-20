// import {
//   Box,
//   Button,
//   Grid,
//   InputAdornment,
//   Pagination,
//   Stack,
//   TextField
// } from "@mui/material";
// import * as React from "react";
// import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
// import SingleService from "../../components/manager/SingleService";
// import { ServiceType } from "../../types/ServiceType";
// import ModalCreateService from "../../components/manager/Modal/ModalCreateNewService";

// const dataServices: ServiceType[] = [
//   {
//     id: "1",
//     createdDate: "8/8/2024",
//     name: "Tắm rửa thú cưng",
//     status: "ACTIVE",
//     price:100000
//   },
//   {
//     id: "2",
//     createdDate: "8/8/2024",
//     name: "Cắt móng thú cưng",
//     status: "ACTIVE",
//     price:100000
//   },
//   {
//     id: "3",
//     createdDate: "8/8/2024",
//     name: "Massage thú cưng",
//     status: "ACTIVE",
//     price:100000
//   },
//   {
//     id: "4",
//     createdDate: "8/8/2024",
//     name: "Tỉa lông thú cưng",
//     status: "ACTIVE",
//     price:100000
//   },
//   {
//     id: "5",
//     createdDate: "8/8/2024",
//     name: "Diệt bọ thú cưng",
//     status: "ACTIVE",
//     price:100000
//   }

// ];

// export default function ListCombo() {
//   const [page, setPage] = React.useState(1);
//   const [listService, setListService] = React.useState<ServiceType[] | []>(dataServices);
//   const [showModalCreate, setShowModalCreate] = React.useState(false)

//   const startIndex = (page - 1) * 24;
//   const endIndex = startIndex + 24;

//   const handleChangePage = (event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleSearchName = (name: string) => {
//     if (name) setListService(dataServices.filter((service) => service.name.includes(name)));
//     else setListService(dataServices.slice(startIndex, endIndex));
//   };
  
//   React.useEffect(() => {
//     const newData = dataServices.slice(startIndex, endIndex);
//     setListService(newData);
//   }, [page, startIndex, endIndex]);

//   return (
//     <Box sx={{ p: 2 }}>
//       <Stack
//         direction={"row"}
//         justifyContent={"space-between"}
//         alignItems={"center"}
//         sx={{mb:3}}
//       >
//       <TextField
//         size="small"
//         placeholder="Nhập tên dịch vụ ..."
//         label="Tìm kiếm"
//         onChange={(e) => handleSearchName(e.target.value)}
//         sx={{ width: "345px" }}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <SearchOutlinedIcon />
//             </InputAdornment>
//           ),
//         }}
//       />
//        <Button variant="contained" color="info" startIcon={<SellOutlinedIcon/>}
//         onClick={()=>setShowModalCreate(true)}
//         >
//           Thêm dịch vụ
//         </Button>
//         </Stack>
//       <Grid container spacing={3} sx={{ minHeight: 600 }}>
//         {listService.map((service, index) => (
//           <SingleService key={index} service={service} />
//         ))}
//       </Grid>
//       <Stack
//         spacing={2}
//         direction={"row"}
//         justifyContent={"center"}
//         sx={{ width: "100%", p: 3 }}
//       >
//         <Pagination
//           color="secondary"
//           count={Math.ceil(dataServices.length / 20)}
//           page={page}
//           onChange={handleChangePage}
//         />
//       </Stack>

//       <ModalCreateService
//       open={showModalCreate}
//       setOpen={setShowModalCreate}
//       />
//     </Box>
//   );
// }

import AddIcon from "@mui/icons-material/Add";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField
} from "@mui/material";
import Paper from "@mui/material/Paper";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import SingleCombo from "../../components/manager/SingleCombo";
import useDebounce from "../../hook/useDebounce";
import { ComboType, FilterComboType } from "../../types/Combo/ComboType";
import { PaginationType } from "../../types/CommonType";
import ProductAPI from "../../utils/ProductAPI";

export default function ListProduct() {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = React.useState(false);

  const [listCombo, setListCombo] = React.useState<ComboType[] | []>(
    []
  );

  const [pagination, setPagination] = React.useState<PaginationType>({
    page: 1,
    size: 10,
    total: 10,
    totalPages: 1,
  });

  const [searchName, setSearchName] = React.useState("");

  const [filter, setFilter] = React.useState<FilterComboType>({
    page: 1,
    size: 10,
    Status: "",
  });

  const debouncedInputValue = useDebounce(searchName, 1000); // Debounce with 1000ms delay

  const handleChangePage = (event: unknown, newPage: number) => {
    setFilter((prev) => ({ ...prev, page: newPage }));
  };

  const handleSearchName = (name: string) => {
    setSearchName(name);
  };
  
  const fetchAllCombo = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await ProductAPI.getAll(filter);
      console.log({ data });
      setListCombo(data.items);
      setPagination({
        page: data.page,
        size: data.size,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.log("Error get list Combo: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  React.useEffect(() => {
    fetchAllCombo();
  }, [fetchAllCombo]);
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
            placeholder="Nhập tên gói..."
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
            navigate("/manager-manage-combo/create-combo");
          }}
        >
          Tạo gói
        </Button>
      </Stack>

      <Grid container spacing={3} sx={{ minHeight: 600 }}>
         {listCombo.map((combo, index) => (
           <SingleCombo key={index} data={combo} />
         ))}
       </Grid>
      <Stack
        spacing={2}
        direction={"row"}
        justifyContent={"center"}
        sx={{ width: "100%", p: 3 }}
      >
        <Pagination
          color="standard"
          count={pagination.totalPages}
          page={pagination.page}
          onChange={handleChangePage}
        />
      </Stack>
    </Paper>
  );
}
