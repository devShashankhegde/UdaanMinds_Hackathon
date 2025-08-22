import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
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
  Avatar,
  Tabs,
  Tab
} from '@mui/material';
import { Add, LocationOn, Build, Agriculture } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Tool } from '../types';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

interface ToolFormData {
  toolName: string;
  category: string;
  toolType: string;
  price: number;
  priceUnit: string;
  description: string;
  condition: string;
  location: {
    state: string;
    district: string;
    village: string;
  };
  specifications: {
    brand: string;
    model: string;
    year: number;
    power: string;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Services: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState({
    category: '',
    toolType: '',
    state: ''
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ToolFormData>();

  const { data: toolsData, isLoading, refetch } = useQuery(
    ['tools', filters],
    async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/services/tools?${params.toString()}`);
      return response.data;
    }
  );

  const onSubmit = async (data: ToolFormData) => {
    try {
      await api.post('/services/tools', data);
      toast.success('Tool listing created successfully!');
      setOpen(false);
      reset();
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create tool listing');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
          Agricultural Services
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Rent tools, find labor, and access storage facilities
        </Typography>

        {/* Service Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Tools & Equipment" />
            <Tab label="Labor Services" />
            <Tab label="Storage & Land" />
          </Tabs>
        </Box>

        {/* Tools Tab */}
        <TabPanel value={tabValue} index={0}>
          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="tractor">Tractor</MenuItem>
                  <MenuItem value="harvester">Harvester</MenuItem>
                  <MenuItem value="plough">Plough</MenuItem>
                  <MenuItem value="sprayer">Sprayer</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.toolType}
                  label="Type"
                  onChange={(e) => setFilters({ ...filters, toolType: e.target.value })}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="rent">For Rent</MenuItem>
                  <MenuItem value="sale">For Sale</MenuItem>
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

          {/* Tools Grid */}
          <Grid container spacing={3}>
            {toolsData?.tools?.map((tool: Tool) => (
              <Grid item xs={12} sm={6} md={4} key={tool._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      height: 200,
                      backgroundColor: 'secondary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Build sx={{ fontSize: 60, color: 'white' }} />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {tool.toolName}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Chip 
                        label={tool.category} 
                        size="small" 
                        color="primary" 
                      />
                      <Chip 
                        label={tool.toolType === 'rent' ? 'For Rent' : 'For Sale'} 
                        size="small" 
                        variant="outlined"
                        color={tool.toolType === 'rent' ? 'success' : 'warning'}
                      />
                    </Box>

                    <Typography variant="h5" color="primary" gutterBottom>
                      ₹{tool.price.toLocaleString('en-IN')}
                      <Typography component="span" variant="body2" color="text.secondary">
                        /{tool.priceUnit.replace('_', ' ')}
                      </Typography>
                    </Typography>

                    <Chip 
                      label={tool.condition} 
                      size="small" 
                      color={tool.condition === 'new' ? 'success' : 'default'}
                      sx={{ mb: 2 }}
                    />

                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {tool.location.village}, {tool.location.district}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {tool.ownerId.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {tool.ownerId.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Listed on {formatDate(tool.createdAt)}
                        </Typography>
                      </Box>
                    </Box>

                    {tool.specifications.brand && (
                      <Typography variant="body2" color="text.secondary">
                        {tool.specifications.brand} {tool.specifications.model}
                        {tool.specifications.year && ` (${tool.specifications.year})`}
                      </Typography>
                    )}

                    {tool.description && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {tool.description}
                      </Typography>
                    )}
                  </CardContent>
                  
                  {user && (
                    <Box p={2}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<LocationOn />}
                      >
                        Contact Owner
                      </Button>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>

          {toolsData?.tools?.length === 0 && (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary">
                No tools found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or be the first to list your tools!
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Labor Services Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box textAlign="center" py={8}>
            <Agriculture sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Labor Services Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find skilled agricultural workers and labor services in your area.
            </Typography>
          </Box>
        </TabPanel>

        {/* Storage & Land Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box textAlign="center" py={8}>
            <Build sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Storage & Land Services Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find storage facilities and land lease options for your farming needs.
            </Typography>
          </Box>
        </TabPanel>

        {/* Add Tool FAB */}
        {user && (
          <Fab
            color="primary"
            aria-label="add tool"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={() => setOpen(true)}
          >
            <Add />
          </Fab>
        )}

        {/* Add Tool Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>List Your Tool</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Tool Name"
                    fullWidth
                    variant="outlined"
                    {...register('toolName', { required: 'Tool name is required' })}
                    error={!!errors.toolName}
                    helperText={errors.toolName?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Category</InputLabel>
                    <Select
                      label="Category"
                      {...register('category', { required: 'Category is required' })}
                      error={!!errors.category}
                    >
                      <MenuItem value="tractor">Tractor</MenuItem>
                      <MenuItem value="harvester">Harvester</MenuItem>
                      <MenuItem value="plough">Plough</MenuItem>
                      <MenuItem value="sprayer">Sprayer</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Type</InputLabel>
                    <Select
                      label="Type"
                      {...register('toolType', { required: 'Type is required' })}
                      error={!!errors.toolType}
                    >
                      <MenuItem value="rent">For Rent</MenuItem>
                      <MenuItem value="sale">For Sale</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Condition</InputLabel>
                    <Select
                      label="Condition"
                      {...register('condition', { required: 'Condition is required' })}
                      error={!!errors.condition}
                    >
                      <MenuItem value="new">New</MenuItem>
                      <MenuItem value="good">Good</MenuItem>
                      <MenuItem value="fair">Fair</MenuItem>
                      <MenuItem value="poor">Poor</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    label="Price (₹)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 1, message: 'Price must be positive' }
                    })}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Price Unit</InputLabel>
                    <Select
                      label="Price Unit"
                      {...register('priceUnit', { required: 'Price unit is required' })}
                      error={!!errors.priceUnit}
                    >
                      <MenuItem value="per_hour">Per Hour</MenuItem>
                      <MenuItem value="per_day">Per Day</MenuItem>
                      <MenuItem value="total">Total Price</MenuItem>
                    </Select>
                  </FormControl>
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    label="Brand (Optional)"
                    fullWidth
                    variant="outlined"
                    {...register('specifications.brand')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    label="Model (Optional)"
                    fullWidth
                    variant="outlined"
                    {...register('specifications.model')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    label="Year (Optional)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    {...register('specifications.year')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    label="Power (Optional)"
                    fullWidth
                    variant="outlined"
                    placeholder="e.g., 50 HP"
                    {...register('specifications.power')}
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
              <Button type="submit" variant="contained">List Tool</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Services;
