// import { Navigate } from 'react-router-dom';
// import '../index.css';
// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const storedUser = localStorage.getItem('user');
//   const user = storedUser ? JSON.parse(storedUser) : null;

//   // if not logged in hen redirect
//   if (!user) return <Navigate to="/login" replace />;

//   //  if role is not allowed also redirect
//   if (allowedRoles.length && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
