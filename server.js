const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// CORS middleware to allow requests from the front-end
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // Update with your Vue.js app's URL
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Endpoint to fetch patients from the FHIR server
app.get('/api/patients', async (req, res) => {
  try {
    const response = await axios.get('http://hapi.fhir.org/baseR4/Patient');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching patients:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint to create a new patient on the FHIR server
app.post('/api/patients', async (req, res) => {
    try {
      const newPatient = req.body;
  
      // Assuming the FHIR server supports creating patients via POST
      const response = await axios.post('http://hapi.fhir.org/baseR4/Patient', newPatient);
  
      res.json(response.data);
    } catch (error) {
      console.error('Error creating patient:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
