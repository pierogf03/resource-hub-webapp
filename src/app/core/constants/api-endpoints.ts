export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  },
  users: {
    list: '/users',
    create: '/users',
    update: (id: string) => `/users/${id}`,
  },
  providers: {
    list: '/providers',
    create: '/providers',
    update: (id: string) => `/providers/${id}`,
  },
  initiatives: {
    list: '/initiatives',
    create: '/initiatives',
    update: (id: string) => `/initiatives/${id}`,
  },
  externalResources: {
    list: '/external-resources',
    create: '/external-resources',
    update: (id: string) => `/external-resources/${id}`,
  },
  assignments: {
    list: '/assignments',
    create: '/assignments',
    update: (id: string) => `/assignments/${id}`,
    generateMonthlyPurchaseOrders: (id: string) =>
      `/assignments/${id}/generate-monthly-purchase-orders`,
  },
  purchaseOrders: {
    list: '/purchase-orders',
    create: '/purchase-orders',
    update: (id: string) => `/purchase-orders/${id}`,
  },
  dashboard: {
    summary: '/dashboard/summary',
    expiringResources: '/dashboard/expiring-resources',
  },
  imports: {
    historicalExcel: '/imports/historical-excel',
    list: '/imports',
    errors: (batchId: string) => `/imports/${batchId}/errors`,
  },
} as const;
