import axios from "axios";

const HOST = "localhost"
const PORT = "3333"
export const api = axios.create({
  baseURL: 'http://'+HOST+':'+PORT,
});

