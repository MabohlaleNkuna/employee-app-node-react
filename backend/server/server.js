const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { db, bucket } = require('./firebaseAdmin');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

require('dotenv').config();

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
app.put('/employees/:id', upload.single('file'), async (req, res) => {
  const { id } = req.params;
  const { name, surname, email, idNum, position, department, phone, startDate } = req.body;

  try {
    const employeeDoc = await db.collection('employees').doc(id).get();

    if (!employeeDoc.exists) {
      return res.status(404).send({ message: 'Employee not found' });
    }
    
    const employeeData = employeeDoc.data();
    let imageUrl = employeeData.imageUrl; // Corrected to imageUrl

    if (req.file) {
      // Delete the old image if it exists
      if (imageUrl) {
        const oldFileName = imageUrl.split('/').pop(); // Extract the filename from the URL
        const oldFile = bucket.file(oldFileName);
        await oldFile.delete(); // Delete the old file from Firebase Storage
      }

      const newFileName = `${uuidv4()}_${req.file.originalname}`; // Generate new file name
      const newFile = bucket.file(newFileName);

      await newFile.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype },
        public: true,
      });

      imageUrl = `https://storage.googleapis.com/${bucket.name}/${newFileName}`; // Updated image URL
    }
    
    await db.collection('employees').doc(id).update({
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

    res.status(200).send({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).send({ message: 'Error updating employee', error: error.message });
  }
});

app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const employeeDoc = await db.collection('employees').doc(id).get();

    if (!employeeDoc.exists) {
      return res.status(404).send({ message: 'Employee not found' });
    }

    const employeeData = employeeDoc.data();
    const imageUrl = employeeData.imageUrl;
    // Delete the employee document
    await db.collection('employees').doc(id).delete();

    if (imageUrl) {
      const fileName = imageUrl.split('/').pop(); // Extract the file name from the URL
      const file = bucket.file(fileName);
      await file.delete(); // Delete the file from Firebase Storage
    }
    res.status(200).send({ message: 'Employee and image deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error); // Log the error
    res.status(500).send({ message: 'Error deleting employee', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
