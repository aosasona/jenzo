export default {
  type: "object",
  required: [],
  properties: {
    ADDR: {
      type: "string",
      default: "0.0.0.0",
    },
    PORT: {
      type: "number",
      default: 8080,
    },
    ALLOWED_HOSTS: {
      type: "string",
      default: "",
    },
    VERSION: {
      type: "string",
      default: "1",
    },
    CACHE_TTL: {
      type: "number",
      default: 5,
    },
  },
};
