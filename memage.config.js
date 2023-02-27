export default {
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
  vars: {
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      normal: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
  },
};
