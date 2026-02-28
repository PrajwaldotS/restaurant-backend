export default {
  routes: [
    {
      method: "GET",
      path: "/analytics",
      handler: "analytics.analytics",
      config: {
        auth: false,
      },
    },
  ],
};