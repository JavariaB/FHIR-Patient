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
                    required
                  />
                </div>
              </div>

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
                    required
                  />
                </div>
              </div>

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
                    required
                  />
                </div>
              </div>

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
                    required
                  />
                </div>
              </div>

              <div class="form-group form-row row mt-3">
                <div class="col-4"><label for="patientEmail">Email:</label></div>
                <div class="col">
                  <input
                    v-model="patient.patientEmail"
                    type="email"
                    class="form-control"
                    id="patientEmail"
                    name="patientEmail"
                    required
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    title="Enter a valid email address"
                    @input="clearEmailError"
                  />
                  <div v-if="emailError" class="text-danger">{{ emailError }}</div>
                </div>
              </div>

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
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>
              <div class="form-group form-row row mt-3">
                <div class="col-4">
                  <label for="city">city:</label>
                </div>
                <div class="col">
                  <input
                    v-model="patient.city"
                    type="tel"
                    class="form-control"
                    id="city"
                    name="city"
                    required
                  />
                </div>
              </div>

              <div class="form-group form-row row mt-3">
                <div class="col-4">
                  <label for="state">state:</label>
                </div>
                <div class="col">
                  <input
                    v-model="patient.state"
                    type="tel"
                    class="form-control"
                    id="state"
                    name="state"
                    required
                  />
                </div>
              </div>

              <div class="form-group form-row row mt-3">
                <div class="col-4">
                  <label for="postalCode">postalCode:</label>
                </div>
                <div class="col">
                  <input
                    v-model="patient.postalCode"
                    type="tel"
                    class="form-control"
                    id="postalCode"
                    name="postalCode"
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
