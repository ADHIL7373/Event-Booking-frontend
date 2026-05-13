import api from './api';

const walletService = {
  getSummary: (params) => api.get('/wallet/summary', { params }),
  getTransactions: (params) => api.get('/wallet/transactions', { params }),
  postRefund: (data) => api.post('/wallet/refund', data),
  
  // Reward Points APIs
  redeemPoints: (data) => api.post('/wallet/redeem-points', data),
  earnPoints: (data) => api.post('/wallet/earn-points', data),
  reversePoints: (data) => api.post('/wallet/reverse-points', data),
};

export default walletService;
