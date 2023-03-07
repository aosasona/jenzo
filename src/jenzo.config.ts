export default {
  allowedOrigins: "*",
  templates: {
    src: "templates",
    default: "mono",
  },
  cache: {
    enabled: false,
    directory: "saved",
    prefix: "mche",
    delimiter: "_",
    duration: 600, // time to retain saved image in seconds, use 0 to keep forever (will require more disk space)
  },
} as const;
