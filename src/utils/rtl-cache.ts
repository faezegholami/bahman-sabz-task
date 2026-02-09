"use client";

import { createSystem, defaultConfig } from "@chakra-ui/react";
import rtlPlugin from "stylis-plugin-rtl";

export const system = createSystem(defaultConfig, {
  direction: "rtl",
  stylisPlugins: [rtlPlugin],
});
