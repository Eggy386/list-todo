export const isAuthenticated = () => {
    return !!localStorage.getItem('userId'); // Aquí 'user' representa tu dato de sesión
  };