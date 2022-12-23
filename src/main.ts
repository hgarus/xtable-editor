import { createApp } from "vue";
import App from "./App.vue";

import "./assets/main.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCopy, faFolderOpen } from "@fortawesome/free-regular-svg-icons";

/* add icons to the library */
library.add(faCopy, faFolderOpen);

createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
