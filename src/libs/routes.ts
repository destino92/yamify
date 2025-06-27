const routes = {
  about: "/about",
  api: process.env.NEXT_PUBLIC_API_URL,
  auth: {
    signup: "/auth/sign-up",
    login: "/auth/sign-in",
    forgotPass: "/auth/forgot_password",
    payment: "/auth/payment",
  },
  contactUs: "/contact-us",
  docs: "/docs",
  techSupport: "/technical-support",
  dashboard: {
    overview: "/dashboard",
    yams: {
      all: (dashboardId: string) => `/dashboard/yams/${dashboardId}/all`,
      single: (name: string, dashboardId: string) =>
        `/dashboard/yams/${dashboardId}/${name}`,
      deployProject: (name: string, dashboardId: string) =>
        `/dashboard/yams/${dashboardId}/${name}/deploy-project`,
    },
    projects: {
      // all: "/dashboard/projects/all",
      group: (group: string) => `/dashboard/projects/${group}`,
      deployProject: "/dashboard/projects/deploy-project",
      installWordPress: "/dashboard/projects/install-wordpress",
      single: (name: string) => `/dashboard/projects/${name}`,
    },
    users: {
      list: "/dashboard/users/list",
      grid: "/dashboard/users/grid",
      profile: "/dashboard/users/profile",
    },
    categories: {
      main: "/dashboard/category/main",
      sub: "/dashboard/category/sub",
    },
    product: {
      add: "/dashboard/product/add",
      list: "/dashboard/product/list",
      grid: "/dashboard/product/grid",
      details: "/dashboard/product/details",
    },
    services: {
      add: "/dashboard/service/add",
      list: "/dashboard/service/list",
    },
    orders: {
      new: "/dashboard/orders/new",
      history: "/dashboard/orders/history",
      details: "/dashboard/orders/details",
    },
    user: {
      edit: "/dashboard/edit-profile",
      security: "/dashboard/security",
      general: "/dashboard/general",
    },
    review: "/dashboard/review",
    stores: "/dashboard/stores",
    auditLog: "/dashboard/audit",
    permissionManagement: "/dashboard/permission",
    subscriptionManagement: "/dashboard/subscription",
    promotion: "/dashboard/promotion",
  },
  error404: "/",
  external: {
    appLinkOnPlayStore: "//",
    appLinkOnAppleStore: "//",
    socials: {
      facebook: "/",
      linkedin: "/",
      twitter: "/",
      whatsapp: "/",
    },
  },
  home: "/",
  market: {
    home: "/market",
    priceDesk: "/market/pricedesk",
    product: {
      home: "/market/product",
      category: "/market/product/category",
      sizeGuide: "",
    },
  },
  params: {
    emailedCode: "code",
    referredCode: "referral",
    token: "token",
    passwordReset: "reset",
  },
  privacy: "/privacy",
  terms: "/terms",
};

export default routes;
