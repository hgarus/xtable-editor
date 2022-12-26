<script setup lang="ts">
import { ref } from "vue";
import * as _ from "lodash";
import { Table } from "./Domain";
import ResultInput from "./ResultInput.vue";
import ImportDialog from "./ImportDialog.vue";

const props = defineProps<{
  table: Table;
}>();
const importDialog = ref<InstanceType<typeof ImportDialog>>();
const tableElement = ref<HTMLTableElement | null>();
function newPlayer(event: Event) {
  const target = event.target as HTMLInputElement;
  props.table.addPlayer(target.value);
  target.value = "";
}
function focusByTabindex(tabindex?: number) {
  if (tabindex) {
    _.find(
      Array.from(
        tableElement.value?.querySelectorAll("[tabindex]") ?? []
      ) as HTMLElement[],
      (el) => el.tabIndex >= tabindex
    )?.focus();
  }
}
function importTable(table: Table) {
  props.table.replaceWith(table);
}
</script>

<template>
  <ImportDialog ref="importDialog" @table-import="importTable"></ImportDialog>
  <div class="editor">
    <header>
      <button @click="importDialog?.show()">
        <font-awesome-icon icon="fa-regular fa-folder-open" />
      </button>
    </header>
    <table ref="tableElement">
      <tr>
        <th>#</th>
        <th>Name</th>
        <th v-for="(_, index) in table.playersByEntry()" v-bind:key="index">
          {{ index + 1 }}
        </th>
        <th>Punkte</th>
      </tr>
      <tr
        v-for="(player, index) in table.playersByEntry()"
        v-bind:key="player.name"
      >
        <td>{{ index + 1 }}</td>
        <td><input type="text" v-model.lazy="player.name" /></td>
        <td
          v-for="(opp, oppIndex) in table.playersByEntry()"
          v-bind:key="opp.name"
        >
          <ResultInput
            v-if="index !== oppIndex"
            :tabindex="
              index < oppIndex
                ? index * table.playersByEntry().length + oppIndex
                : undefined
            "
            :model-value="player.resultByOpp(opp)"
            @update:model-value="(newValue) => player.setResult(opp, newValue)"
            @focusOn="(tabindex) => focusByTabindex(tabindex)"
          >
          </ResultInput>
        </td>
        <td class="align-right">{{ player.points() }}</td>
      </tr>
      <tr>
        <td></td>
        <td><input type="text" @keypress.enter="newPlayer" /></td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
.editor {
  border: 1px solid black;
  padding: 1rem;
  margin: 1rem;
}
input[type="text"] {
  width: 150px;
}
.align-right {
  text-align: right;
}
header {
  margin-bottom: 1rem;
}
header button {
  padding: 0.75rem;
}
</style>
