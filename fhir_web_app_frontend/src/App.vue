<template>
  <div>
    <div class="mb-3">
      <nav class="navbar fixed-top navbar-light bg-light">
        <div class="container">
          <a class="navbar-brand"> PATIENT FHIR</a>
        </div>
      </nav>
    </div>
    <div class="container mt-5 p-3">
      <button class="btn btn-outline-info rounded-pill" @click="fetchPatients">
        Fetch Patients
      </button>
       <a class="btn btn-outline-info rounded-pill" href="#register_patient">
        Register Patient
      </a>
      <div class="row">
        <div class="col-md-6">
          <div class="row">
            <div class="card mt-4">
              <div class="card-header">
                Line Chart showing Patient Trend Over the Years
              </div>
              <div class="card-body">
                <div ref="d3LineChartContainer"></div>
              </div>
            </div>
            <div class="card mt-4">
              <div class="card-header">
                Bar chart for the Distribution of Patients Over the Years
              </div>
              <div class="card-body">
                <div ref="d3BarChartContainer"></div>
              </div>
            </div>
            <div class="card mt-4">
              <div class="card-header">Patients Pie Chart</div>
              <div class="card-body">
                <div ref="d3PieChartContainer"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div v-if="patients.length" class="row mt-4">
            <div class=" col-xl">
              <div class="card">
                <div class="card-header">
                  <h2>Patients</h2>
                </div>
                <div class="card-body">
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">Patient ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Family Name</th>
                        <th scope="col">Year of Birth</th>
                      </tr>
                    </thead>
                    <tbody v-for="patient in patients" :key="patient.resource.id">
                      <tr>
                        <th scope="row">{{ patient.resource.id }}</th>
                        <td>{{ patient.resource.name[0].given[0] }}</td>
                        <td>{{ patient.resource.name[0].family }}</td>
                        <td>
                          {{
                            patient.resource.birthDate
                              ? new Date(patient.resource.birthDate).getFullYear()
                              : "N/A"
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" id="register_patient">
        <register-patient></register-patient>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import * as d3 from "d3";
import RegisterPatient from './components/RegisterPatient.vue';

export default {
  components: {RegisterPatient},
  mounted() {
    this.fetchPatients();
  },
  data() {
    return {
      patients: [],
      searchId: "",
    };
  },
  methods: {
    async fetchPatients() {
      try {
        await axios
          .get("http://localhost:3000/api/patients")
          .then((success) => {
            console.log("Successful request to FHIR server");
            console.log(success);
            this.patients = success.data.entry;
            this.renderD3Charts();
          })
          .catch((error) => {
            console.log(error);
            alert(`Error! ${error}`);
          });
      } catch (error) {
        console.error("Error fetching patients:", error.message);
      }
    },

    renderD3Charts() {
      this.renderLineChart();
      this.renderPieChart();
      this.renderBarChart();
    },
    renderLineChart() {
      // Filter out patients with empty birth dates
      var filteredPatients = this.patients.filter(
        (patient) => patient.resource.birthDate && patient.resource.birthDate.length >= 4
      );

      // Extract birth years and count occurrences
      var birthYearCounts = filteredPatients.reduce((counts, patient) => {
        const birthYear = patient.resource.birthDate.substring(0, 4);

        // Increment the count for the birth year
        counts[birthYear] = (counts[birthYear] || 0) + 1;
        return counts;
      }, {});

      var data = Object.entries(birthYearCounts).map(([birthYear, count]) => ({
        birthYear: parseInt(birthYear), // Convert birthYear to a number
        count: count,
      }));

      var svgWidth = 600,
        svgHeight = 400;
      var margin = { top: 20, right: 20, bottom: 30, left: 50 };
      var width = svgWidth - margin.left - margin.right;
      var height = svgHeight - margin.top - margin.bottom;

      var svg = d3
        .select(this.$refs.d3LineChartContainer)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      var g = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var x = d3.scaleLinear().rangeRound([0, width]);
      var y = d3.scaleLinear().rangeRound([height, 0]);

      var line = d3
        .line()
        .x(function (d) {
          return x(d.birthYear);
        })
        .y(function (d) {
          return y(d.count);
        });

      x.domain(
        d3.extent(data, function (d) {
          return d.birthYear;
        })
      );
      y.domain(
        d3.extent(data, function (d) {
          return d.count;
        })
      );

      g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();

      g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Patient Count");

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    },

    renderPieChart() {
      // Filter out patients with empty birth dates
      var filteredPatients = this.patients.filter(
        (patient) => patient.resource.birthDate && patient.resource.birthDate.length >= 4
      );

      // Extract birth years and count occurrences
      var birthYearCounts = filteredPatients.reduce((counts, patient) => {
        const birthYear = patient.resource.birthDate.substring(0, 4);

        // Increment the count for the birth year
        counts[birthYear] = (counts[birthYear] || 0) + 1;
        return counts;
      }, {});

      var data = Object.entries(birthYearCounts).map(([birthYear, count]) => ({
        birthYear: birthYear,
        count: count,
      }));

      var svgWidth = 500,
        svgHeight = 300,
        radius = Math.min(svgWidth, svgHeight) / 2;

      var svg = d3
        .select(this.$refs.d3PieChartContainer)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      // Create group element to hold pie chart
      var g = svg
        .append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")");

      var color = d3.scaleOrdinal(d3.schemeCategory10);

      var pie = d3.pie().value(function (d) {
        return d.count;
      });

      var path = d3.arc().outerRadius(radius).innerRadius(0);

      var arc = g.selectAll("arc").data(pie(data)).enter().append("g");

      arc
        .append("path")
        .attr("d", path)
        .attr("fill", function (d) {
          return color(d.data.birthYear);
        });

      var label = d3.arc().outerRadius(radius).innerRadius(0);

      arc
        .append("text")
        .attr("transform", function (d) {
          return "translate(" + label.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .text(function (d) {
          return d.data.birthYear + ":" + d.data.count + " patients";
        });
    },

    renderBarChart() {
      // Filter out patients with empty birth dates
      var filteredPatients = this.patients.filter(
        (patient) => patient.resource.birthDate && patient.resource.birthDate.length >= 4
      );

      // Extract birth years and count occurrences
      var birthYearCounts = filteredPatients.reduce((counts, patient) => {
        const birthYear = patient.resource.birthDate.substring(0, 4);

        // Increment the count for the birth year
        counts[birthYear] = (counts[birthYear] || 0) + 1;
        return counts;
      }, {});

      var birthYears = Object.keys(birthYearCounts);
      var counts = Object.values(birthYearCounts);

      var svgWidth = 500,
        svgHeight = 500,
        barPadding = 2,
        yGraphPadding = 20;
      var xGraphPadding = 30;
      var barWidth = svgWidth / birthYears.length;

      var svg = d3
        .select(this.$refs.d3BarChartContainer)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      var yScale = d3
        .scaleLinear()
        .domain([0, d3.max(counts) + yGraphPadding])
        .range([0, svgHeight + yGraphPadding]);

      var barChart = svg
        .selectAll("rect")
        .data(counts)
        .enter()
        .append("rect")
        .attr("y", function (d) {
          return svgHeight - yScale(d) > 0 ? svgHeight - yScale(d) : 0;
        })
        .attr("height", function (d) {
          return yScale(d) - yGraphPadding > 0 ? yScale(d) - yGraphPadding : 0;
        })
        .attr("width", barWidth - barPadding)
        .attr("transform", function (d, i) {
          var translate = [barWidth * i + xGraphPadding, 0];
          return "translate(" + translate + ")";
        });

      svg
        .selectAll("text")
        .data(counts)
        .enter()
        .append("text")
        .text(function (d) {
          return d;
        })
        .attr("y", function (d) {
          return svgHeight - yScale(d) - 2;
        })
        .attr("x", function (d, i) {
          return barWidth * i + xGraphPadding;
        })
        .attr("fill", "red");

      yScale = d3
        .scaleLinear()
        .domain([0, d3.max(counts) + yGraphPadding])
        .range([svgHeight - yGraphPadding, 0]);

      // Update xScale to use d3.scaleBand()
      var xScale = d3
        .scaleBand()
        .domain(birthYears)
        .range([0, svgWidth - xGraphPadding]);

      var xAxis = d3.axisBottom().scale(xScale);

      var yAxis = d3.axisLeft().scale(yScale);
      svg
        .append("g")
        .attr("transform", "translate(" + xGraphPadding + ", 0)")
        .call(yAxis);

      var xAxisTranslate = svgHeight - 20;
      svg
        .append("g")
        .attr("transform", "translate(" + xGraphPadding + ", " + xAxisTranslate + ")")
        .call(xAxis);

      return barChart;
    },
  },
};
</script>
<style>
/* Add your styles here */
</style>
