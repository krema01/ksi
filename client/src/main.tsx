import React from "react";
import ReactDOM from "react-dom/client";

// Mantine Core Styles
import "@mantine/core/styles.css";
// Mantine Notifications Styles (wenn du sie benutzt)
import "@mantine/notifications/styles.css";

// Mantine-Datatable Styles
import "mantine-datatable/styles.css";
import "@mantine/dates/styles.css";

import { createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { modals } from "./modals/generalModals";
import App from "./App";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const theme = createTheme({
  colors: {
    blue_gray: [
      "#e7f8ff",
      "#dcebf1",
      "#bed4dc",
      "#a1bec9",
      "#81a6b5",
      "#6e99aa",
      "#6393a5",
      "#518091",
      "#437283",
      "#2f6375",
    ],
    "ocean-blue": [
      "#7AD1DD",
      "#5FCCDB",
      "#44CADC",
      "#2AC9DE",
      "#1AC2D9",
      "#11B7CD",
      "#09ADC3",
      "#0E99AC",
      "#128797",
      "#147885",
    ],
    "bright-pink": [
      "#F0BBDD",
      "#ED9BCF",
      "#EC7CC3",
      "#ED5DB8",
      "#F13EAF",
      "#F71FA7",
      "#FF00A1",
      "#E00890",
      "#C50E82",
      "#AD1374",
    ],
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="light" theme={theme}>
      <ModalsProvider modals={modals}>
        <App />
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>
);
