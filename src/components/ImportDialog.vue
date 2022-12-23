<script setup lang="ts">
import { ref } from "vue";
import { Table } from "./Domain";

const emit = defineEmits<{
  (e: "tableImport", table: Table): void;
}>();
const dialog = ref<HTMLDialogElement | null>(null);
const textarea = ref<HTMLTextAreaElement | null>(null);

function doImport(event: Event) {
  event.preventDefault();
  const tableElement = new DOMParser()
    .parseFromString(textarea.value?.value!, "text/html")
    .querySelector("table") as HTMLTableElement;
  const table = Table.fromTableElement(tableElement);
  emit("tableImport", table);
  textarea.value!.value = "";
  dialog.value?.close();
}
function show() {
  dialog.value?.showModal();
}
defineExpose({ show });
</script>

<template>
  <dialog ref="dialog">
    <h2>Import</h2>
    <form @submit="doImport" method="dialog">
      <label>Paste an existing html table below:</label>
      <textarea ref="textarea" width="200" height="5"></textarea>
      <div class="buttons">
        <button type="reset" @click="dialog?.close()">Cancel</button
        ><button type="submit">Import</button>
      </div>
    </form>
  </dialog>
</template>

<style scoped>
textarea {
  height: 15em;
  width: 400px;
}
form {
  display: flex;
  flex-direction: column;
}
button {
  margin: 0.5em 0 0.5em 0.75em;
  padding: 0.5em;
}
.buttons {
  display: flex;
  flex-grow: 0;
  justify-content: flex-end;
}
</style>
