import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Alert, Box } from '@mui/material';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.userType)) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Access denied. You don't have permission to view this page.
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
