import axios from "axios";
import { useAuthStore } from "@/stores/auth.js";

axios.interceptors.response.use(
    (res) => res,
    async (err) => {
        if (err.response.status === 401) {
            useAuthStore().resetUser();
            this.router.push({ name: "login" });
        }
        if (err.response.status === 403) {
            this.router.push({ path: "/" });
        }
        return Promise.reject(err);
    }
);