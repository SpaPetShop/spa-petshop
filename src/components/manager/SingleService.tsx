import { CardActionArea, Chip, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { ServiceType } from '../../types/ServiceType';
import { useNavigate } from 'react-router-dom';

export type SingleCardServiceProps = {
  service: ServiceType
}

export default function SingleService({service}: SingleCardServiceProps) {
  const navigate = useNavigate()
  return (
    <Grid item xs={4} sm={3} md={3} lg={2}>
    <Card sx={{ maxWidth: 345}} onClick={()=>navigate(`/manager-manage-service/${service.id}`)}>
    <CardActionArea>
      <CardMedia
        sx={{ height: 200, objectFit:"cover" }}
        image="/logo.png"
        title="Service Image"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {service.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{mt:1, mb:1}}>
         Giá: {service.price.toLocaleString()} VNĐ
        </Typography>
        <Chip label={service.status === "ACTIVE" ? "Đang hoạt động" : "Ngưng hoạt động"} color={service.status === "ACTIVE" ? "success" : "error"}/>
      </CardContent>
      </CardActionArea>
    </Card>
    </Grid>
  );
}
