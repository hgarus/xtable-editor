<script setup lang="ts">
import { Result } from './Domain';

defineProps<{
  prefs: {gesamtwertung: number[]};
}>();
defineEmits(["update:modelValue", "focusOn"]);
</script>

<template>
   <dialog>
    <form>
        <label>
        </label>
    </form>
   </dialog>
</template>

<style scoped>
.editor {
  height: 500px;
  width: 500px;
  border: 1px solid black;
}
</style>
