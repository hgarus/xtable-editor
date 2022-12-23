<script setup lang="ts">
import TableEditor from "./TableEditor.vue";
import TableDisplay from "./TableDisplay.vue";
import { Table } from "./Domain";
import { reactive } from "vue";

const table = reactive(new Table());
</script>

<template>
  <div class="x-table">
    <TableEditor :table="table"></TableEditor>
    <TableDisplay :table="table"></TableDisplay>
  </div>
</template>

<style scoped>
.x-table {
  display: flex;
}
</style>
