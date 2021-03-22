import axios from "axios";
import Vue from 'vue';

export default () => {
    const backendServer = "http://localhost:8081";
    const instance = axios.create({
      baseURL: backendServer + '/api',
      headers: Object.assign({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    });

    
  instance.interceptors.request.use(config => {
    config.headers["X-XRSF-TOKEN"] = Vue.$cookies.get('XSRF-TOKEN');
    return config;
  });

    return instance;
}   