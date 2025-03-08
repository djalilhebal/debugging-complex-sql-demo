<template>
  <h1>Demo: A structured logging approach</h1>
  <VueLive :code="WarehouseExample" :requires="preRequiredObjects" :components="components"
  style="gap: 1em; margin: 1em;" />
</template>

<script setup>
import { VueLive } from "vue-live";
import 'vue-live/style.css';
import "prismjs/themes/prism-funky.css";

import WarehouseExample from './components/WarehouseExample.vue?raw';
import * as database from './database';
import InkButton from './components/InkButton.vue';

const components = {
  InkButton,
};
const preRequiredObjects = {
  '@/database': database,
};
</script>

<style>
h1 {
  text-align: center;
}

.VueLive-editor {
  background-color: hsl(0deg 0% 7.06%);
  color: white;
  padding: 0.25em;
  border-radius: 0.5em;
}

.VueLivePreview {
  background-color: beige;
  padding: 0.5em;
  border-radius: 0.5em;
}
</style>
