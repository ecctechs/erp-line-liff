<template>
  <div class="container mt-4">
    <h3>Vue + DataTables.js</h3>
    <table id="example" class="table table-striped" style="width:100%">
      <thead>
        <tr>
          <th>ชื่อ</th>
          <th>ตำแหน่ง</th>
          <th>ออฟฟิศ</th>
          <th>อายุ</th>
          <th>วันที่เริ่ม</th>
          <th>เงินเดือน</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in employees" :key="index">
          <td>{{ item.name }}</td>
          <td>{{ item.position }}</td>
          <td>{{ item.office }}</td>
          <td>{{ item.age }}</td>
          <td>{{ item.start }}</td>
          <td>{{ item.salary }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// ต้องติดตั้ง datatables.net + jquery ก่อน
// npm install jquery datatables.net datatables.net-dt

import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";

export default {
  data() {
    return {
      product:[],
      customer:[],
      company:[],
      employees: [
        { name: "Tiger Nixon", position: "System Architect", office: "Edinburgh", age: 61, start: "2011/04/25", salary: "$320,800" },
        { name: "Garrett Winters", position: "Accountant", office: "Tokyo", age: 63, start: "2011/07/25", salary: "$170,750" },
        { name: "Ashton Cox", position: "Junior Technical Author", office: "San Francisco", age: 66, start: "2009/01/12", salary: "$86,000" },
        { name: "Cedric Kelly", position: "Senior Javascript Developer", office: "Edinburgh", age: 22, start: "2012/03/29", salary: "$433,060" },
      ],
    };
  },
  methods: {
    async get_product() {
        const res = await fetch("https://erp-backend-staging.onrender.com/auth/get_product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bus_id: "96" })
        });
        const data = await res.json();

        this.product = data;
    },
    async get_customer() {
        const res = await fetch("https://erp-backend-staging.onrender.com/auth/get_customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bus_id: "96" })
        });
        const data = await res.json();

        this.customer = data;
    },
    async get_company() {
        const res = await fetch("https://erp-backend-staging.onrender.com/auth/get_company", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bus_id: "96" })
        });
        const data = await res.json();

        this.company = data;
    },
  },
  mounted() {
    this.get_product();
    this.get_customer();
    this.get_company();
    // initialize datatable หลัง render เสร็จ
    this.$nextTick(() => {
      $("#example").DataTable();
    });
  },
};
</script>
