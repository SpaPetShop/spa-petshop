import { CardActionArea, Chip, Grid, Stack, Tooltip } from "@mui/material";
import PetsIcon from '@mui/icons-material/Pets';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { ComboType } from "../../types/Combo/ComboType";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import Carousel from "react-material-ui-carousel";
export type SingleComboProps = {
  data: ComboType;
};
 export const renderStatusCombo = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return ( 
        <Tooltip title={"Đang hoạt động"}>
            <CheckCircleOutlinedIcon fontSize="small" style={{color:"#00e676", marginTop:"4px"}}/>
        </Tooltip>
      );
    case "UNAVAILABLE":
      return (
        <Tooltip title={"Ngưng hoạt động"}>
        <HighlightOffIcon fontSize="small" style={{color:"#ffd600", marginTop:"4px"}}/>
    </Tooltip>
      );
    case "OUTOFSTOCK":
      return ( <Tooltip title={"Hết hàng"}>
        <DoNotDisturbIcon fontSize="small" style={{color:"#ff1744", marginTop:"4px"}}/>
    </Tooltip>);
    default:
      return (
        <Chip sx={{ minWidth: 120 }} label={"Chưa xác định"} color="error" />
      );
  }
};
export default function SingleCombo({ data }: SingleComboProps) {
  const navigate = useNavigate();
  

  return (
    <Grid item xs={4} sm={3} md={3} lg={3}>
      <Card
        sx={{ maxWidth: 400 }}
        onClick={() => navigate(`/manager-manage-combo/${data.id}`)}
      >
        <CardActionArea>

        <Carousel sx={{ margin: 'auto', border: 'none' }}
					indicatorContainerProps={{
						style: {
							zIndex: 1,
							marginTop: '-24px',
							position: 'relative'
						}
					}}>
          {data.image.length > 0 ?
            data.image.map((i, index) => (
              <CardMedia key={index} component='img' height={200} image={i.imageURL} alt='combo img' sx={{ objectFit: 'cover' }} />
            ))
            :
            <CardMedia component='img' height={200} image={"/logo.png"} alt='combo img' sx={{ objectFit: 'cover' }} />
          }
        </Carousel>
          <CardContent>
            <Stack direction={"row"} alignItems={"flex-start"} spacing={1}>
          {renderStatusCombo(data.status)} 

            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{height: 60, overflow: "hidden", fontSize: 18 }}
            >
              {data.name}
            </Typography>
            </Stack>


            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={{ mb: 3, mt: 3 }}
              spacing={1}
            >
              <Typography gutterBottom variant="h6" sx={{fontSize:16}}>
                Loại:
              </Typography>
              <Chip
              size="small"
              icon={<PetsIcon
              color="disabled"
              />}
                label={data.category.name}
                style={{
                  backgroundColor: "#00e676",
                }}
              />
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={{ mb: 3, mt: 3 }}
              spacing={1}
            >
              <Typography gutterBottom variant="h6" sx={{fontSize:16}}>
                Giá gốc:
              </Typography>
              <Chip
                label={`${data?.stockPrice?.toLocaleString()} VNĐ`}
                 size="small"
                style={{
                  backgroundColor: "#ff6d00",
                }}
              />
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}

              sx={{ mt: 3 }}

              spacing={1}
            >
              <Typography gutterBottom variant="h6" sx={{fontSize:16}}>
                Giá bán:
              </Typography>
              <Chip
              size="small"
                label={`${data?.sellingPrice?.toLocaleString()} VNĐ`}
                style={{
                  backgroundColor: "#00e5ff",
                }}
              />
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
