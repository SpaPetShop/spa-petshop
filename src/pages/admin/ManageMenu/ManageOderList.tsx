import React, { useState } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface Order {
  id: number;
  customer: string;
  date: string;
  service: string;
  combo: string | null;
  total: number;
  status: string;
}

const mockOrders: Order[] = [
  { id: 1, customer: 'John Doe', date: '2024-08-01', service: 'Full Grooming', combo: 'Basic Combo', total: 75000.0, status: 'Completed' },
  { id: 2, customer: 'Jane Smith', date: '2024-08-02', service: 'Nail Clipping', combo: null, total: 25000.0, status: 'Processing' },
  { id: 3, customer: 'Robert Johnson', date: '2024-08-03', service: 'Haircut', combo: 'Deluxe Combo', total: 100000.0, status: 'Completed' },
  { id: 4, customer: 'Emily Davis', date: '2024-08-04', service: 'Bath', combo: null, total: 40000.0, status: 'Cancelled' },
  { id: 5, customer: 'Michael Brown', date: '2024-08-05', service: 'Teeth Cleaning', combo: 'Premium Combo', total: 120000.0, status: 'Completed' },
];

const ManageOrderList = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);

  const handleDetail = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);

  const columns: GridColDef<Order>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'customer', headerName: 'Customer', width: 150 },
    { field: 'date', headerName: 'Date', width: 130 },
    { field: 'service', headerName: 'Service', width: 180 },
    { field: 'combo', headerName: 'Combo', width: 150 },
    { 
      field: 'total', 
      headerName: 'Total', 
      width: 100, 
      valueFormatter: (params) => {
        const value = params;
        return value !== undefined ? `VND${value}` : 'N/A';
      } 
    },
    { field: 'status', headerName: 'Status', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDetail(params.row as Order)}
        >
          Detail
        </Button>
      ),
      width: 150,
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Total Amount: VND{totalAmount.toFixed(2)}</Typography>
      </Box>

      <DataGrid
        rows={orders}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
      
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography>ID: {selectedOrder.id}</Typography>
              <Typography>Customer: {selectedOrder.customer}</Typography>
              <Typography>Date: {selectedOrder.date}</Typography>
              <Typography>Service: {selectedOrder.service}</Typography>
              {selectedOrder.combo && <Typography>Combo: {selectedOrder.combo}</Typography>}
              <Typography>Total: VND{selectedOrder.total.toFixed(2)}</Typography>
              <Typography>Status: {selectedOrder.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageOrderList;
