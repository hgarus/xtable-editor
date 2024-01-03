<script setup lang="ts">
import * as _ from "lodash";
import { Table } from "./Domain";
import { ref } from "vue";

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
  window.navigator.clipboard.writeText(node.outerHTML.replace(/<\!--.*?-->/g, ''));
}
const displayDetailedResults = ref(true);
const displayNumberOfGames = ref(false);
const factor = ref(1);
</script>

<template>
  <div class="viewer">
    <header>
      <button @click="toClipboard($refs.table as HTMLTableElement)">
        <font-awesome-icon icon="fa-regular fa-copy" />
      </button>

      <label>
        Details: 
        <input type="checkbox" v-model="displayDetailedResults">
      </label>
      <label>
        Factor:
        <input type="number" min="1" v-model="factor">
      </label>
    </header>
    <table ref="table">
      <tr>
        <th>Rang</th>
        <th>Name</th>
        <th v-if="displayDetailedResults" v-for="(_, index) in table.playersByRank()" v-bind:key="index">
          {{ index + 1 }}
        </th>
        <th>SB</th>
        <th>Summe</th>
        <th v-if="displayDetailedResults">Punkte Gesamtwertung</th>
      </tr>
      <tr
        v-for="(player, index) in table.playersByRank()"
        v-bind:key="player.name"
      >
        <td>{{ player.rank }}.</td>
        <td>{{ player.name }}</td>
        <td v-if="displayDetailedResults" v-for="opp in table.playersByRank()" v-bind:key="opp.name">
          {{ opp !== player ? player.resultByOpp(opp) : "" }}
        </td>
        <td>{{ formatNumber(player.sonnebornBerger()) }}</td>
        <td>{{ formatNumber(player.points()) }}</td>
        <td v-if="displayDetailedResults">{{ formatNumber(player.pointsForStandings * (factor || 1)) }}</td>
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

header > * {
  margin: 0 0.5em;
}

tr:nth-child(n + 2) td:nth-last-of-type(1),
tr:nth-child(n + 2) td:nth-last-of-type(2),
tr:nth-child(n + 2) td:nth-last-of-type(3) {
  text-align: right;
}

header input[type=checkbox] {
  width: 1.5em;
  height: 1.5em;
  vertical-align: middle;
}
input[type=number] {
  width: 3em;
}
</style>
