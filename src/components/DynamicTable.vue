<template>
  <table class="table table-striped table-bordered w-100">
    <thead>
      <tr>
        <th v-for="col in headers" :key="col.key">{{ col.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="!data || data.length === 0">
        <td :colspan="headers.length" class="text-center">ไม่มีข้อมูล</td>
      </tr>
      <tr v-for="(row, rowIndex) in data" :key="rowIndex">
        <td v-for="col in headers" :key="col.key">{{ row[col.key] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "DynamicTable",
  props: {
    headers: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>
