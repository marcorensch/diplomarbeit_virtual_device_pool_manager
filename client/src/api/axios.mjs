import axios from "axios";
import { useAuthStore } from "@/stores/auth.js";

axios.interceptors.response.use(
    (res) => res,
    async (err) => {
        console.log(err.response.status);
        if (err.response.status === 401) {
            useAuthStore().resetUser();
        }
        if (err.response.status === 403) {
            this.router.push({ path: "/" });
        }
        return Promise.reject(err);
    }
);