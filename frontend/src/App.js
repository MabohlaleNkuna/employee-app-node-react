import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee } from './api'; 
import HeaderComp from './components/HeaderComp';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import SearchBar from './components/SearchBar';
import Modal from './components/Modal';
import Button from './components/Button';
import Loader from './components/Loader';
import Register from './components/Register'; 
import Login from './components/Login'; 
import Navbar from './components/Navbar'; // Import Navbar
import { auth } from './firebase'; // Import Firebase auth
import './App.css';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [user, setUser] = useState(null); // State to store logged-in user

  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true); 
      try {
        const employeeList = await fetchEmployees();
        setEmployees(employeeList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  // Firebase Auth state observer to check for logged-in user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Set user if logged in
      } else {
        setUser(null); // Set user to null if not logged in
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddOrUpdateEmployee = async (employee) => {
    setLoading(true); 
    try {
      if (employee.id) {
        await updateEmployee(employee.id, employee);
        alert('Employee updated successfully!');
      } else {
        await addEmployee(employee);
        alert('Employee added successfully!');
      }
      setSelectedEmployee(null);
      setIsModalOpen(false);

      const employeeList = await fetchEmployees();
      setEmployees(employeeList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); 
    }
  };

  const handleDelete = async (id) => {
    setLoading(true); 
    try {
      await deleteEmployee(id);
      alert('Employee deleted successfully!');
     
      const employeeList = await fetchEmployees();
      setEmployees(employeeList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Hide loader after action
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAddEmployeeClick = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const filteredEmployees = employees.filter((employee) => {
    const term = searchTerm.toLowerCase();
    return (
      employee.name.toLowerCase().includes(term) ||
      employee.surname.toLowerCase().includes(term) ||
      employee.idNum.includes(term) ||
      employee.position.includes(term) ||
      employee.department.toLowerCase().includes(term)
    );
  });

  return (
    <Router>
      <div className="app">
        <Navbar user={user} /> {/* Pass user to Navbar */}
        <HeaderComp />
        <Routes>
          <Route path="/" element={<Navigate to="/employees" />} />
          <Route path="/employees" element={
            <>
              <SearchBar onSearch={handleSearch} />
              <Button className="custom-button" onClick={handleAddEmployeeClick}>Add New Employee</Button>
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <EmployeeForm
                  selectedEmployee={selectedEmployee}
                  onSave={handleAddOrUpdateEmployee}
                />
              </Modal>
              {loading && <Loader />} 
              <EmployeeList
                employees={filteredEmployees}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
