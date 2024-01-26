<template>
  <div>
    <div class="row mt-5">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h2 class="mb-4">Patient Information Form</h2>
          </div>
          <form @submit.prevent="submitForm">
            <div class="card-body">
              <!-- ... Other form groups ... -->

              <!-- Family Name -->
              <div class="form-group form-row row mt-3">
                <div class="col-4">
                  <label for="patientFamily">Family Name:</label>
                </div>
                <div class="col">
                  <input
                    v-model="patient.patientFamily"
                    type="text"
                    class="form-control"
                    id="patientFamily"
                    name="patientFamily"
                    placeholder="Enter family name"
                    required
                  />
                </div>
              </div>

              <!-- Given Name -->
              <div class="form-group form-row row mt-3">
                <div class="col-4">
                  <label for="patientGiven">Given Name:</label>
                </div>
                <div class="col">
                  <input
                    v-model="patient.patientGiven"
                    type="text"
                    class="form-control"
                    id="patientGiven"
                    name="patientGiven"
                    placeholder="Enter given name"
                    required
                  />
                </div>
              </div>

              <!-- Gender -->
              <div class="form-group form-row row mt-3">
                <div class="col-4">
                  <label for="patientGender">Gender:</label>
                </div>
                <div class="col">
                  <select
                    v-model="patient.patientGender"
                    class="form-control"
                    id="patientGender"
                    name="patientGender"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <!-- Birth Date -->
              <div class="form-group form-row row mt-3">
                <div class="col-4">
                  <label for="patientBirthDate">Birth Date:</label>
                </div>
                <div class="col">
                  <input
                    v-model="patient.patientBirthDate"
                    type="date"
                    class="form-control"
                    id="patientBirthDate"
                    name="patientBirthDate"
                    placeholder="Select birth date"
                    required
                  />
                </div>
              </div>

              <!-- Phone -->
              <div class="form-group form-row row mt-3">
                <div class="col-4">
                  <label for="patientPhone">Phone:</label>
                </div>
                <div class="col">
                  <input
                    v-model="patient.patientPhone"
                    type="tel"
                    class="form-control"
                    id="patientPhone"
                    name="patientPhone"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="form-group form-row row mt-3">
                <div class="col-4">
                  <label for="patientEmail">Email:</label>
                </div>
                <div class="col">
                  <input
                    v-model="patient.patientEmail"
                    type="email"
                    class="form-control"
                    id="patientEmail"
                    name="patientEmail"
                    placeholder="Enter email address"
                    required
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    title="Enter a valid email address"
                    @input="clearEmailError"
                  />
                  <div v-if="emailError" class="text-danger">{{ emailError }}</div>
                </div>
              </div>

              <!-- Address -->
              <div class="form-group form-row row mt-3">
                <div class="col-4">
                  <label for="patientAddress">Address:</label>
                </div>
                <div class="col">
                  <textarea
                    v-model="patient.patientAddress"
                    class="form-control"
                    id="patientAddress"
                    name="patientAddress"
                    placeholder="Enter patient address"
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>

              <!-- City -->
              <div class="form-group form-row row mt-3">
                <div class="col-4">
                  <label for="city">City:</label>
                </div>
                <div class="col">
                  <input
                    v-model="patient.city"
                    type="text"
                    class="form-control"
                    id="city"
                    name="city"
                    placeholder="Enter city"
                    required
                  />
                </div>
              </div>

              <!-- State -->
              <div class="form-group form-row row mt-3">
                <div class="col-4">
                  <label for="state">State:</label>
                </div>
                <div class="col">
                  <input
                    v-model="patient.state"
                    type="text"
                    class="form-control"
                    id="state"
                    name="state"
                    placeholder="Enter state"
                    required
                  />
                </div>
              </div>

              <!-- Postal Code -->
              <div class="form-group form-row row mt-3">
                <div class="col-4">
                  <label for="postalCode">Postal Code:</label>
                </div>
                <div class="col">
                  <input
                    v-model="patient.postalCode"
                    type="text"
                    class="form-control"
                    id="postalCode"
                    name="postalCode"
                    placeholder="Enter postal code"
                    required
                  />
                </div>
              </div>
            </div>
            <div class="card-footer">
              <button type="submit" class="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h2 class="mb-4">Patient Registration Response</h2>
          </div>
          <div class="card-body">
            <p>{{ jsonData }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      patient: {
        patientGender: "male",
      },
      emailError: "",
      jsonData: null,
    };
  },
  methods: {
   async submitForm() {
      const patientData = {
        resourceType: "Patient",
        name: [
          {
            use: "official",
            family: this.patient.patientFamily,
            given: [this.patient.patientGiven],
          },
        ],
        gender: this.patient.patientGender,
        birthDate: this.patient.patientBirthDate,
        telecom: [
          {
            value: this.patient.patientPhone,
            use: "mobile",
            system: "phone",
          },
          {
            system: "email",
            value: this.patient.patientEmail,
          },
        ],
        address: [
          {
            line: [this.patient.patientAddress],
            city: this.patient.city,
            state: this.patient.state,
            postalCode: this.patient.postalCode,
          },
        ],
      };

      this.jsonData = JSON.stringify(patientData, null, 2);

      // Send POST request to FHIR server

            try {
        await axios
          .post("http://localhost:3000/api/patients", patientData)
        .then((response) => {
          console.log("Successfully posted data:", response.data);
          this.jsonData =  response.data;
          this.patient = {
            patientGender: "male",
          };
        })
          .catch((error) => {
            console.log(error);
            alert(`Error! ${error}`);
          });
      } catch (error) {
        console.error("Error fetching patients:", error.message);
      }
      
      
    },
   
  },
};
</script>
