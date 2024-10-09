import React, { useState, useEffect } from 'react';
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee } from './api'; 
import HeaderComp from './components/HeaderComp';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import SearchBar from './components/SearchBar';
import Modal from './components/Modal';
import Button from './components/Button';
import Loader from './components/Loader';
import './App.css';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state

  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true); // Show loader while fetching employees
      try {
        const employeeList = await fetchEmployees();
        setEmployees(employeeList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Hide loader after fetch
      }
    };

    loadEmployees();
  }, []);

  const handleAddOrUpdateEmployee = async (employee) => {
    setLoading(true); // Show loader during add/update
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

      // Re-fetch employees after add/update
      const employeeList = await fetchEmployees();
      setEmployees(employeeList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Hide loader after action
    }
  };

  const handleDelete = async (id) => {
    setLoading(true); // Show loader during delete
    try {
      await deleteEmployee(id);
      alert('Employee deleted successfully!');
      // Re-fetch employees after delete
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
    <div className="app">
      <HeaderComp />
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
    </div>
  );
};

export default App;
