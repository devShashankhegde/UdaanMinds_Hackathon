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
  Avatar,
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
  CircularProgress
} from '@mui/material';
import { Add, Forum, Visibility, ThumbUp } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Question } from '../types';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

interface QuestionFormData {
  title: string;
  question: string;
  category: string;
  tags: string;
}

const CommunityChat: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<QuestionFormData>();

  const { data: questionsData, isLoading, refetch } = useQuery(
    ['questions', category, search],
    async () => {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      
      const response = await api.get(`/community/questions?${params.toString()}`);
      return response.data;
    }
  );

  const onSubmit = async (data: QuestionFormData) => {
    try {
      const questionData = {
        ...data,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      await api.post('/community/questions', questionData);
      toast.success('Question posted successfully!');
      setOpen(false);
      reset();
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to post question');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          Community Chat
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Ask questions, share knowledge, and connect with fellow farmers
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="farming">Farming</MenuItem>
                <MenuItem value="pricing">Pricing</MenuItem>
                <MenuItem value="tools">Tools</MenuItem>
                <MenuItem value="weather">Weather</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Questions List */}
        <Grid container spacing={3}>
          {questionsData?.questions?.map((question: Question) => (
            <Grid item xs={12} key={question._id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Avatar>
                      {question.userId.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="h6" gutterBottom>
                        {question.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {question.question}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Chip 
                          label={question.category} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        {question.tags.map((tag, index) => (
                          <Chip key={index} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>

                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={3}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Forum fontSize="small" />
                            <Typography variant="caption">
                              {question.answers.length} answers
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Visibility fontSize="small" />
                            <Typography variant="caption">
                              {question.views} views
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <ThumbUp fontSize="small" />
                            <Typography variant="caption">
                              {question.votes} votes
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box textAlign="right">
                          <Typography variant="caption" color="text.secondary">
                            Asked by {question.userId.name}
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {formatDate(question.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {questionsData?.questions?.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              No questions found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to ask a question!
            </Typography>
          </Box>
        )}

        {/* Add Question FAB */}
        {user && (
          <Fab
            color="primary"
            aria-label="add question"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={() => setOpen(true)}
          >
            <Add />
          </Fab>
        )}

        {/* Add Question Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Ask a Question</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Question Title"
                fullWidth
                variant="outlined"
                {...register('title', { 
                  required: 'Title is required',
                  minLength: { value: 5, message: 'Title must be at least 5 characters' }
                })}
                error={!!errors.title}
                helperText={errors.title?.message}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Your Question"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                {...register('question', { 
                  required: 'Question is required',
                  minLength: { value: 10, message: 'Question must be at least 10 characters' }
                })}
                error={!!errors.question}
                helperText={errors.question?.message}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  {...register('category', { required: 'Category is required' })}
                  error={!!errors.category}
                >
                  <MenuItem value="farming">Farming</MenuItem>
                  <MenuItem value="pricing">Pricing</MenuItem>
                  <MenuItem value="tools">Tools</MenuItem>
                  <MenuItem value="weather">Weather</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                label="Tags (comma separated)"
                fullWidth
                variant="outlined"
                placeholder="e.g., wheat, irrigation, pest-control"
                {...register('tags')}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Post Question</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
};

export default CommunityChat;
