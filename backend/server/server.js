const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { db, bucket } = require('./firebaseAdmin');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });


app.post('/employees', upload.single('file'), async (req, res) => {
  console.log(req.body); 
  console.log(req.file); 
  
  const { name, surname, email, idNum, position, department, phone, startDate } = req.body;
  
  try {
    let imageUrl = '';

    if (req.file) {
      const fileName = `${uuidv4()}_${req.file.originalname}`;
      const file = bucket.file(fileName);

      await file.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype },
        public: true,
      });

      imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

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
    console.error('Error adding employee:', error); // Log the error
    res.status(500).send({ message: 'Error adding employee', error: error.message });
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
