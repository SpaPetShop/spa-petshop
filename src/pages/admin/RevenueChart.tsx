import React from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data
const data = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 2000 },
  { month: 'Apr', revenue: 2780 },
  { month: 'May', revenue: 1890 },
  { month: 'Jun', revenue: 2390 },
  { month: 'Jul', revenue: 3490 },
  { month: 'Aug', revenue: 2000 },
  { month: 'Sep', revenue: 2780 },
  { month: 'Oct', revenue: 1890 },
  { month: 'Nov', revenue: 2390 },
  { month: 'Dec', revenue: 3490 },
];

const RevenueChart = () => {
  return (
    <Box sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" gutterBottom>
        Revenue by Month
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RevenueChart;
