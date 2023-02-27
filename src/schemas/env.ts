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
    ALLOWED_IPS: {
      type: "string",
      default: "",
    },
  },
};
