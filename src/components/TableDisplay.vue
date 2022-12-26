<script setup lang="ts">
import * as _ from "lodash";
import { Table } from "./Domain";

defineProps<{
  table: Table;
}>();

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
  <div class="viewer">
    <header>
      <button @click="toClipboard($refs.table as HTMLTableElement)">
        <font-awesome-icon icon="fa-regular fa-copy" />
      </button>
    </header>
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
        <td>{{ player.rank }}.</td>
        <td>{{ player.name }}</td>
        <td v-for="opp in table.playersByRank()" v-bind:key="opp.name">
          {{ opp !== player ? player.resultByOpp(opp) : "" }}
        </td>
        <td>{{ formatNumber(player.sonnebornBerger()) }}</td>
        <td>{{ formatNumber(player.points()) }}</td>
        <td>{{ formatNumber(player.pointsForStandings) }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
.viewer {
  padding: 1rem;
  margin: 1rem;
  border: 1px solid black;
}
header {
  margin-bottom: 1rem;
}
header button {
  padding: 0.75em;
}

tr:nth-child(n + 2) td:nth-last-of-type(1),
tr:nth-child(n + 2) td:nth-last-of-type(2),
tr:nth-child(n + 2) td:nth-last-of-type(3) {
  text-align: right;
}
</style>
