export const API_URL = 'http://localhost:5000'; 

// Functio to get the CSRF token from cookies
const getCsrfToken = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; XSRF-TOKEN=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

export const fetchEmployees = async () => {
  const response = await fetch(`${API_URL}/employees`, {
    credentials: 'include', 
    headers: {
      'X-XSRF-TOKEN': getCsrfToken() 
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  return response.json();
};

export const logout = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'GET',
    credentials: 'include', 
    headers: {
      'X-XSRF-TOKEN': getCsrfToken() 
    }
  });
  if (!response.ok) {
    throw new Error('Failed to log out');
  }
  return response.json();
};

// Function to add an employee
export const addEmployee = async (employee) => {
  const formData = new FormData();
  
  for (const key in employee) {
    formData.append(key, employee[key]);
  }
  
  const response = await fetch(`${API_URL}/employees`, {
    method: 'POST',
    body: formData,
    credentials: 'include', 
    headers: {
      'X-XSRF-TOKEN': getCsrfToken() 
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to add employee');
  }
  return response.json();
};

// Function to update an employee
export const updateEmployee = async (id, employee) => {
  const formData = new FormData();
  
  for (const key in employee) {
    formData.append(key, employee[key]);
  }
  
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: 'PUT',
    body: formData,
    credentials: 'include', 
    headers: {
      'X-XSRF-TOKEN': getCsrfToken() 
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to update employee');
  }
  return response.json();
};

// Function to delete an employee
export const deleteEmployee = async (id) => {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: 'DELETE',
    credentials: 'include', 
    headers: {
      'X-XSRF-TOKEN': getCsrfToken()
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete employee');
  }
  return response.json();
};
