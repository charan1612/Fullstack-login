import React, { useState } from 'react';
import { 
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ setIsAuthenticated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setError('');
      const response = await axios.get(
        `http://localhost:5000/api/recipes?q=${searchTerm}`
      );
      setRecipes(response.data);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Typography variant="h3" gutterBottom sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        Recipe Finder
      </Typography>

      <Paper component="form" onSubmit={handleSearch} sx={{ p: 2, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search Recipes"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading}
              >
                Search
              </Button>
            )
          }}
        />
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={4}>
        {recipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={recipe.image}
                alt={recipe.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {recipe.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {recipe.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Origin: {recipe.area}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button 
                    size="small" 
                    color="primary" 
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {recipes.length === 0 && !loading && !error && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          {searchTerm ? 'No recipes found' : 'Search for recipes to get started!'}
        </Typography>
      )}

      {selectedRecipe && (
        <Dialog open={!!selectedRecipe} onClose={() => setSelectedRecipe(null)}>
          <DialogTitle>{selectedRecipe.title}</DialogTitle>
          <DialogContent dividers>
            <Typography variant="h6" gutterBottom>Category:</Typography>
            <Typography gutterBottom>{selectedRecipe.category}</Typography>
            
            <Typography variant="h6" gutterBottom>Origin:</Typography>
            <Typography gutterBottom>{selectedRecipe.area}</Typography>
            
            <Typography variant="h6" gutterBottom>Instructions:</Typography>
            <Typography 
              style={{ whiteSpace: 'pre-line' }}
            >
              {selectedRecipe.instructions}
            </Typography>
            
            {selectedRecipe.youtube && (
              <Button 
              variant="contained" 
              color="primary" 
              onClick={() => window.open(selectedRecipe.youtube, '_blank')}
            >
              Watch on YouTube
            </Button>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedRecipe(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Dashboard;