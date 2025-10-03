<template>
  <div>
    <!-- Search -->
    <div class="mb-2">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control"
        placeholder="ค้นหา..."
      />
    </div>

    <!-- Table -->
    <table class="table table-striped table-bordered w-100">
      <thead>
        <tr>
          <th v-for="col in headers" :key="col.key">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="paginatedData.length === 0">
          <td :colspan="headers.length" class="text-center">ไม่มีข้อมูล</td>
        </tr>
        <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
          <td v-for="col in headers" :key="col.key">{{ row[col.key] }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <nav v-if="pageCount > 1" aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li
          class="page-item"
          :class="{ disabled: currentPage === 1 }"
          @click="changePage(currentPage - 1)"
        >
          <span class="page-link">Previous</span>
        </li>
        <li
          class="page-item"
          v-for="page in pageCount"
          :key="page"
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >
          <span class="page-link">{{ page }}</span>
        </li>
        <li
          class="page-item"
          :class="{ disabled: currentPage === pageCount }"
          @click="changePage(currentPage + 1)"
        >
          <span class="page-link">Next</span>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "DynamicTable",
  props: {
    headers: { type: Array, required: true },
    data: { type: Array, required: true },
    pageSize: { type: Number, default: 5 },
  },
  data() {
    return {
      searchQuery: "",
      currentPage: 1,
    };
  },
  computed: {
    filteredData() {
      if (!this.searchQuery) return this.data;
      const q = this.searchQuery.toLowerCase();
      return this.data.filter((row) =>
        this.headers.some(
          (col) =>
            String(row[col.key]).toLowerCase().includes(q)
        )
      );
    },
    pageCount() {
      return Math.ceil(this.filteredData.length / this.pageSize);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredData.slice(start, start + this.pageSize);
    },
  },
  methods: {
    changePage(page) {
      if (page < 1 || page > this.pageCount) return;
      this.currentPage = page;
    },
  },
  watch: {
    searchQuery() {
      this.currentPage = 1; // reset page when search
    },
    data() {
      this.currentPage = 1; // reset page when data changes
    },
  },
};
</script>
