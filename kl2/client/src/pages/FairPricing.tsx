import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Avatar
} from '@mui/material';
import { Add, LocationOn, Phone, Email } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Listing } from '../types';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

interface ListingFormData {
  cropType: string;
  variety: string;
  quantity: number;
  unit: string;
  quality: string;
  expectedPrice: number;
  negotiable: boolean;
  description: string;
  harvestDate: string;
  location: {
    state: string;
    district: string;
    village: string;
  };
}

const FairPricing: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [contactDialog, setContactDialog] = useState<{ open: boolean; listing: Listing | null }>({
    open: false,
    listing: null
  });
  const [filters, setFilters] = useState({
    cropType: '',
    quality: '',
    state: ''
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ListingFormData>();

  const { data: listingsData, isLoading, refetch } = useQuery(
    ['listings', filters],
    async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/listings?${params.toString()}`);
      return response.data;
    }
  );

  const onSubmit = async (data: ListingFormData) => {
    try {
      await api.post('/listings', data);
      toast.success('Listing created successfully!');
      setOpen(false);
      reset();
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create listing');
    }
  };

  const handleContactSeller = async (listing: Listing) => {
    try {
      const response = await api.post(`/listings/${listing._id}/contact`);
      setContactDialog({ open: true, listing });
      toast.success('Contact information retrieved!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to get contact info');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Fair Pricing Marketplace
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Buy and sell crops at fair prices with transparent marketplace
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search crop type..."
              value={filters.cropType}
              onChange={(e) => setFilters({ ...filters, cropType: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Quality</InputLabel>
              <Select
                value={filters.quality}
                label="Quality"
                onChange={(e) => setFilters({ ...filters, quality: e.target.value })}
              >
                <MenuItem value="">All Qualities</MenuItem>
                <MenuItem value="Grade A">Grade A</MenuItem>
                <MenuItem value="Grade B">Grade B</MenuItem>
                <MenuItem value="Grade C">Grade C</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="State"
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            />
          </Grid>
        </Grid>

        {/* Listings Grid */}
        <Grid container spacing={3}>
          {listingsData?.listings?.map((listing: Listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    backgroundColor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h4" color="white">
                    🌾
                  </Typography>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {listing.cropType}
                    {listing.variety && ` - ${listing.variety}`}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Chip label={listing.quality} size="small" color="primary" />
                    <Chip 
                      label={listing.negotiable ? 'Negotiable' : 'Fixed Price'} 
                      size="small" 
                      variant="outlined" 
                    />
                  </Box>

                  <Typography variant="h5" color="primary" gutterBottom>
                    ₹{listing.expectedPrice.toLocaleString('en-IN')}
                    <Typography component="span" variant="body2" color="text.secondary">
                      /{listing.unit}
                    </Typography>
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Quantity: {listing.quantity} {listing.unit}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {listing.location.village}, {listing.location.district}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {listing.sellerId.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {listing.sellerId.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Listed on {formatDate(listing.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  {listing.description && (
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {listing.description}
                    </Typography>
                  )}
                </CardContent>
                
                {user && user.userType !== 'seller' && (
                  <Box p={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleContactSeller(listing)}
                    >
                      Contact Seller
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        {listingsData?.listings?.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              No listings found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or be the first to list your crops!
            </Typography>
          </Box>
        )}

        {/* Add Listing FAB */}
        {user && (user.userType === 'seller' || user.userType === 'both') && (
          <Fab
            color="primary"
            aria-label="add listing"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={() => setOpen(true)}
          >
            <Add />
          </Fab>
        )}

        {/* Add Listing Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create New Listing</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Crop Type"
                    fullWidth
                    variant="outlined"
                    {...register('cropType', { required: 'Crop type is required' })}
                    error={!!errors.cropType}
                    helperText={errors.cropType?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    label="Variety (Optional)"
                    fullWidth
                    variant="outlined"
                    {...register('variety')}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    margin="dense"
                    label="Quantity"
                    type="number"
                    fullWidth
                    variant="outlined"
                    {...register('quantity', { 
                      required: 'Quantity is required',
                      min: { value: 0.1, message: 'Quantity must be positive' }
                    })}
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Unit</InputLabel>
                    <Select
                      label="Unit"
                      {...register('unit', { required: 'Unit is required' })}
                      error={!!errors.unit}
                    >
                      <MenuItem value="kg">Kg</MenuItem>
                      <MenuItem value="quintal">Quintal</MenuItem>
                      <MenuItem value="ton">Ton</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Quality</InputLabel>
                    <Select
                      label="Quality"
                      {...register('quality', { required: 'Quality is required' })}
                      error={!!errors.quality}
                    >
                      <MenuItem value="Grade A">Grade A</MenuItem>
                      <MenuItem value="Grade B">Grade B</MenuItem>
                      <MenuItem value="Grade C">Grade C</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    label="Expected Price (₹)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    {...register('expectedPrice', { 
                      required: 'Price is required',
                      min: { value: 1, message: 'Price must be positive' }
                    })}
                    error={!!errors.expectedPrice}
                    helperText={errors.expectedPrice?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    label="Harvest Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    {...register('harvestDate')}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    margin="dense"
                    label="State"
                    fullWidth
                    variant="outlined"
                    {...register('location.state', { required: 'State is required' })}
                    error={!!errors.location?.state}
                    helperText={errors.location?.state?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    margin="dense"
                    label="District"
                    fullWidth
                    variant="outlined"
                    {...register('location.district', { required: 'District is required' })}
                    error={!!errors.location?.district}
                    helperText={errors.location?.district?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    margin="dense"
                    label="Village"
                    fullWidth
                    variant="outlined"
                    {...register('location.village', { required: 'Village is required' })}
                    error={!!errors.location?.village}
                    helperText={errors.location?.village?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    label="Description (Optional)"
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                    {...register('description')}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Create Listing</Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Contact Seller Dialog */}
        <Dialog 
          open={contactDialog.open} 
          onClose={() => setContactDialog({ open: false, listing: null })}
        >
          <DialogTitle>Contact Seller</DialogTitle>
          <DialogContent>
            {contactDialog.listing && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {contactDialog.listing.sellerId.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Phone fontSize="small" />
                  <Typography>{contactDialog.listing.sellerId.phone}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <LocationOn fontSize="small" />
                  <Typography>
                    {contactDialog.listing.sellerId.location.village}, {contactDialog.listing.sellerId.location.district}, {contactDialog.listing.sellerId.location.state}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  You can now contact the seller directly using the phone number above.
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setContactDialog({ open: false, listing: null })}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default FairPricing;
