import axios, { AxiosInstance } from 'axios';

const REACT_APP_BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export class BaseService {
  protected axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: REACT_APP_BASE_API_URL,
    });

    // This is where I would also set up interceptors, such as a 401 handler for an invalid token.
  }
}
