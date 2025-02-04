import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Container, Typography, Box, Link } from '@mui/material';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required')
});

const Login = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await axios.post('http://localhost:5000/api/login', {
          email: values.email,
          password: values.password
        });
        
        // Handle successful login (you can add redirect logic here)
        alert('Login successful!');
        console.log('Login response:', response.data);
        
      } catch (err) {
        setFieldError('email', err.response?.data?.message || 'Login failed. Please try again.');
      }
      setSubmitting(false);
    }
  });

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        
        <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            margin="normal"
            autoComplete="email"
            {...formik.getFieldProps('email')}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            margin="normal"
            autoComplete="current-password"
            {...formik.getFieldProps('password')}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/signup" variant="body2">
              Don't have an account? Sign Up
            </Link>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Login;