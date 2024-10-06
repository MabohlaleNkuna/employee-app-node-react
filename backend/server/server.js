const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { db, bucket } = require('./firebaseAdmin');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Add an employee
app.post('/employees', async (req, res) => {
  const { name, surname, email, idNum, position, department, phone, startDate, imageUrl } = req.body;

  try {
    const docRef = await db.collection('employees').add({
      name,
      surname,
      email,
      idNum,
      position,
      department,
      phone,
      startDate,
      imageUrl
    });
    res.status(201).send({ message: 'Employee added successfully', id: docRef.id });
  } catch (error) {
    res.status(500).send({ message: 'Error adding employee', error });
  }
});

// Fetch all employees
app.get('/employees', async (req, res) => {
  try {
    const employeesSnapshot = await db.collection('employees').get();
    const employees = employeesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching employees', error });
  }
});

// Update an employee
app.put('/employees/:id', async (req, res) => {
  const { id } = req.params;
  const employeeData = req.body;

  try {
    await db.collection('employees').doc(id).update(employeeData);
    res.status(200).send({ message: 'Employee updated successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error updating employee', error });
  }
});

// Delete an employee
app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('employees').doc(id).delete();
    res.status(200).send({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting employee', error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
