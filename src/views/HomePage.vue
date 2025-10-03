<template>
  <div class="container mt-4">

    <div class="mb-3">
      <button class="btn btn-primary me-2" @click="currentTable = 'product'">Product</button>
      <button class="btn btn-success me-2" @click="currentTable = 'customer'">Customer</button>
      <button class="btn btn-info" @click="currentTable = 'company'">Company</button>
    </div>

    <DynamicTable
      :headers="tableConfig[currentTable]"
      :data="dataMap[currentTable]"
      :page-size="5"
    />
  </div>
</template>

<script>
import DynamicTable from "../components/DynamicTable.vue";

export default {
  components: { DynamicTable },
  data() {
    return {
      currentTable: "product",
      product: [],
      customer: [],
      company: [],
      tableConfig: {
        product: [
          // { label: "รหัสสินค้า", key: "productID" },
          { label: "SKU", key: "productname" },
          // { label: "รายละเอียด", key: "productdetail" },
          { label: "จำนวนคงเหลือ", key: "amount" },
          { label: "ราคา", key: "price" },
          // { label: "วันที่เพิ่ม", key: "product_date" },
          // { label: "สถานะ", key: "Status" },
        ],
        customer: [
          // { label: "รหัสลูกค้า", key: "cus_id" },
          { label: "ชื่อลูกค้า", key: "cus_name" },
          { label: "ที่อยู่", key: "cus_address" },
          { label: "เบอร์โทร", key: "cus_tel" },
          { label: "อีเมล", key: "cus_email" },
          { label: "เลขผู้เสียภาษี", key: "cus_tax" },
          // { label: "สถานะ", key: "Status" },
        ],
        company: [
          // { label: "รหัสลูกค้า", key: "company_person_id" },
          { label: "ชื่อลูกค้า", key: "company_person_name" },
          { label: "เบอร์โทร", key: "company_person_tel" },
          { label: "อีเมล", key: "company_person_email" },
          // { label: "สถานะ", key: "company_person_status" },
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
  mounted() {
    this.get_product();
    this.get_customer();
    this.get_company();
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
    },
    async get_customer() {
      const res = await fetch("https://erp-backend-staging.onrender.com/auth/get_customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bus_id: "96" }),
      });
      const result = await res.json();
      this.customer = result.data || [];
    },
    async get_company() {
      const res = await fetch("https://erp-backend-staging.onrender.com/auth/get_company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bus_id: "96" }),
      });
      const result = await res.json();
      this.company = result.data || [];
    },
  },
};
</script>
