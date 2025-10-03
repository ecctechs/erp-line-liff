<template>
<HeaderMenu />
  <div class="container mt-4">

    <div class="d-flex align-items-center mb-4">
      <h5 class="me-2 fw-bold">บริษัท :</h5>
      <span class="text-primary fs-5">xxxx</span>
    </div>

    <!-- Dropdown -->
    <div class="mb-3 w-100">
      <select class="form-select" v-model="currentTable">
        <option value="product">Product</option>
        <option value="customer">Customer</option>
        <option value="company">Company</option>
      </select>
    </div>

    <!-- Dynamic Table Component -->
    <DynamicTable
      :headers="tableConfig[currentTable]"
      :data="dataMap[currentTable]"
      :page-size="5"
    />
  </div>
</template>

<script>
import DynamicTable from "../components/DynamicTable.vue";
import HeaderMenu from "../components/HeaderMenu.vue";

export default {
  components: { DynamicTable , HeaderMenu },
  data() {
    return {
      user_data:[],
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
  async mounted() {
    await this.get_business_id();
    await this.get_product();
    await this.get_customer();
    await this.get_company();
  },
  methods: {
    async get_product() {
      const res = await fetch("https://erp-backend-staging.onrender.com/auth/get_product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bus_id: this.user_data.data.bus_id }),
      });
      const result = await res.json();
      this.product = result.data || [];
    },
    async get_customer() {
      const res = await fetch("https://erp-backend-staging.onrender.com/auth/get_customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bus_id: this.user_data.data.bus_id }),
      });
      const result = await res.json();
      this.customer = result.data || [];
    },
    async get_company() {
      const res = await fetch("https://erp-backend-staging.onrender.com/auth/get_company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bus_id: this.user_data.data.bus_id }),
      });
      const result = await res.json();
      this.company = result.data || [];
    },
    async get_business_id() {
      const userData = localStorage.getItem('userData');
      this.user_data = JSON.parse(userData);
    },
  },
};
</script>
