<script setup lang="ts">
import * as _ from "lodash";
import { Table } from "./Domain";
import ResultInput from "./ResultInput.vue";

const props = defineProps<{
  table: Table;
}>();

function newPlayer(event: Event) {
  const target = event.target as HTMLInputElement;
  props.table.addPlayer(target.value);
  target.value = "";
}
function focusByTabindex($el: HTMLElement, tabindex?: number) {
  if (tabindex) {
    _.find(
      Array.from($el.querySelectorAll("[tabindex]")) as HTMLElement[],
      (el) => el.tabIndex >= tabindex
    )?.focus();
  }
}
</script>

<template>
  <div class="editor">
    <table>
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
            @focusOn="(tabindex) => focusByTabindex($el, tabindex)"
          >
          </ResultInput>
        </td>
        <td>{{ player.points() }}</td>
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
}
</style>
