// src/api.js
export const API_URL = 'http://localhost:5000'; 
// Function to fetch employees
export const fetchEmployees = async () => {
  const response = await fetch(`${API_URL}/employees`);
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  return response.json();
};

export const addEmployee = async (employee) => {
  const formData = new FormData();
  
  console.log(employee)
  for (const key in employee) {
    formData.append(key, employee[key]);
  }
  
  const response = await fetch(`${API_URL}/employees`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to add employee');
  }
  return response.json();
};

// Function to update an employee
export const updateEmployee = async (id, employee) => {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employee),
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
  });
  if (!response.ok) {
    throw new Error('Failed to delete employee');
  }
  return response.json();
};
