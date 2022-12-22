<script setup lang="ts">
import { Result } from './Domain';

defineProps({
  modelValue: {type: String, required: true},
  tabindex: Number,
});
defineEmits(["update:modelValue", "focusOn"]);
</script>

<template>
    <select 
    :tabindex="tabindex"
    @keypress.d="$emit('update:modelValue', Result.Draw); $emit('focusOn', tabindex ? tabindex + 1 : undefined)" 
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target?.value); $emit('focusOn', tabindex ? tabindex + 1 : undefined)"
    >
        <option default>{{ Result.Missing }}</option>
        <option>{{ Result.Win }}</option>
        <option>{{ Result.Loss }}</option>
        <option>{{ Result.Draw }}</option>
        <option>{{ Result.ForfeitWin }}</option>
        <option>{{ Result.ForfeitLoss }}</option>
    </select>
</template>

<style scoped>
.editor {
  height: 500px;
  width: 500px;
  border: 1px solid black;
}
</style>
