export default {
  providers: [
    {
      // The domain of your Clerk instance
      domain: "https://divine-seal-9826.clerk.accounts.dev",
      applicationID: "convex",
    },
    {
      // Some Clerk instances include a trailing slash in the JWT issuer
      domain: "https://divine-seal-9826.clerk.accounts.dev/",
      applicationID: "convex",
    },
  ]
};
