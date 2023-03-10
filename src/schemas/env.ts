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
      default: 80,
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
    API_KEY: {
      type: "string",
    },
  },
};
