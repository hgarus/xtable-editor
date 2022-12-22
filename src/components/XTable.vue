<script setup lang="ts">
import TableEditor from './TableEditor.vue';
import TableDisplay from './TableDisplay.vue';
import TablePrefs from './TablePrefs.vue'
import {Table} from './Domain';
import { ref } from "vue";

const table = ref(new Table());
const preferences = ref({
  gesamtwertung: [12, 10, 8, 6, 5, 4, 3, 2, 1],
});
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
