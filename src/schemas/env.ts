export default {
  type: "object",
  required: [],
  properties: {
    PORT: {
      type: "string",
      default: 8080,
    },
    ALLOWED_IPS: {
      type: "string",
      default: "",
    },
  },
};
