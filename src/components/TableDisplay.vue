<script setup lang="ts">
import * as _ from "lodash";
import { Table } from "./Domain";

defineProps<{
  table: Table;
}>();

function gesamtwertung(rank: number) {
  const gesamtwertung = [12, 10, 8, 6, 5, 4, 3, 2, 1];
  return gesamtwertung[rank - 1] || _.last(gesamtwertung);
  //props.gesamtwertung[rank - 1] || _.last(props.gesamtwertung);
}
const numberFormat = new Intl.NumberFormat("de");
function formatNumber(num: number) {
  return numberFormat.format(num);
}
function toClipboard(element: HTMLElement) {
  function removeDataAttributes(element: Element) {
    for (const attr of element.attributes) {
      if (attr.name.startsWith("data")) {
        element.removeAttribute(attr.name);
      }
    }
  }
  const node = element.cloneNode(true) as HTMLElement;
  removeDataAttributes(node);
  for (const n of node.querySelectorAll("*")) {
    removeDataAttributes(n);
  }
  window.navigator.clipboard.writeText(node.outerHTML);
}
</script>

<template>
  <div>
    <button @click="toClipboard($refs.table as HTMLTableElement)">
      <font-awesome-icon icon="fa-regular fa-copy" />
    </button>
    <table ref="table">
      <tr>
        <th>Rang</th>
        <th>Name</th>
        <th v-for="(_, index) in table.playersByRank()" v-bind:key="index">
          {{ index + 1 }}
        </th>
        <th>SB</th>
        <th>Summe</th>
        <th>Punkte Gesamtwertung</th>
      </tr>
      <tr
        v-for="(player, index) in table.playersByRank()"
        v-bind:key="player.name"
      >
        <td>{{ index + 1 }}.</td>
        <td>{{ player.name }}</td>
        <td v-for="opp in table.playersByRank()" v-bind:key="opp.name">
          {{ opp !== player ? player.resultByOpp(opp) : "" }}
        </td>
        <td>{{ formatNumber(player.sonnebornBerger()) }}</td>
        <td>{{ formatNumber(player.points()) }}</td>
        <td>{{ gesamtwertung(index + 1) }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
.editor {
  height: 500px;
  width: 500px;
  border: 1px solid black;
}
</style>
