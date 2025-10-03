<template>
  <div class="container mt-4">
    <h3>Vue + DataTables.js (Dynamic + Re-render)</h3>

    <!-- ปุ่มสลับ dataset -->
    <div class="mb-3">
      <button class="btn btn-primary me-2" @click="switchTable('product')">Product</button>
      <button class="btn btn-success me-2" @click="switchTable('customer')">Customer</button>
      <button class="btn btn-info" @click="switchTable('company')">Company</button>
    </div>

    <table id="example" class="table table-striped" style="width:100%">
      <thead>
        <tr>
          <th v-for="(col, index) in tableConfig[currentTable]" :key="index">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in dataMap[currentTable]" :key="rowIndex">
          <td v-for="(col, colIndex) in tableConfig[currentTable]" :key="colIndex">
            {{ row[col.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";

export default {
  data() {
    return {
      currentTable: "product", // default
      product: [],
      customer: [],
      company: [],
      table: null, // เก็บ instance ของ DataTable

      // header config
      tableConfig: {
        product: [
          { label: "รหัสสินค้า", key: "productID" },
          { label: "ชื่อสินค้า", key: "productname" },
          { label: "รายละเอียด", key: "productdetail" },
          { label: "จำนวนคงเหลือ", key: "amount" },
          { label: "ราคา", key: "price" },
          { label: "วันที่เพิ่ม", key: "product_date" },
          { label: "สถานะ", key: "Status" },
        ],
        company: [
          { label: "รหัสลูกค้า", key: "company_person_id" },
          { label: "ชื่อลูกค้า", key: "company_person_name" },
          { label: "เบอร์โทร", key: "company_person_tel" },
          { label: "อีเมล", key: "company_person_email" },
          { label: "สถานะ", key: "company_person_status" },
        ],
        customer: [
          { label: "รหัสลูกค้า", key: "cus_id" },
          { label: "ชื่อลูกค้า", key: "cus_name" },
          { label: "ที่อยู่", key: "cus_address" },
          { label: "เบอร์โทร", key: "cus_tel" },
          { label: "อีเมล", key: "cus_email" },
          { label: "เลขผู้เสียภาษี", key: "cus_tax" },
          { label: "สถานะ", key: "Status" },
        ],
      },
    };
  },
  computed: {
    dataMap() {
      return {
        product: this.product,
        customer: this.customer,
        company: this.company,
      };
    },
  },
  methods: {
    async get_product() {
      const res = await fetch("https://erp-backend-staging.onrender.com/auth/get_product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bus_id: "96" }),
      });
      const result = await res.json();
      this.product = result.data || [];
      this.updateDataTable();
    },
    async get_customer() {
      const res = await fetch("https://erp-backend-staging.onrender.com/auth/get_customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bus_id: "96" }),
      });
      const result = await res.json();
      this.customer = result.data || [];
      this.updateDataTable();
    },
    async get_company() {
      const res = await fetch("https://erp-backend-staging.onrender.com/auth/get_company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bus_id: "96" }),
      });
      const result = await res.json();
      this.company = result.data || [];
      this.updateDataTable();
    },

    switchTable(table) {
      this.currentTable = table;
      this.$nextTick(() => {
        this.updateDataTable();
      });
    },

    // 🔑 update DataTable
    updateDataTable() {
      if (this.table) {
        // destroy ก่อนเพื่อสร้างใหม่
        this.table.destroy();
      }
      this.$nextTick(() => {
        this.table = $("#example").DataTable();
      });
    },
  },
  mounted() {
    this.get_product();
    this.get_customer();
    this.get_company();

    this.$nextTick(() => {
      this.table = $("#example").DataTable();
    });
  },
};
</script>
