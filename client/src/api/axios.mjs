import axios from "axios";
import { useAuthStore } from "@/stores/auth.js";

axios.interceptors.response.use(
    (res) => res,
    async (err) => {
        if (err.response.status === 401) {
            useAuthStore().resetUser();
        }
        return Promise.reject(err);
    }
);