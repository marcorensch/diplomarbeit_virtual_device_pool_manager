import axios from "axios";
import Device from "@/models/Device.mjs";
import {useToast} from "vue-toastification";
const toast = useToast();

export default class DeviceHelper {

    static async store(device) {
        let storageDevice = { ...device };
        storageDevice.msisdns = device.msisdns.map((m) => m.id);
        storageDevice.imei = JSON.stringify(device.imei);
        if (storageDevice.id) {
            return axios
                .put(`/api/devices/${storageDevice.id}`, storageDevice)
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log(error);
                    return [];
                });
        } else {
            return axios
                .post(`/api/devices`, storageDevice)
                .then((response) => {
                    device.id = response.data.id;
                    return device;
                })
                .catch((error) => {
                    console.log(error);
                    return [];
                });
        }
    }

    static async loadDevice(id) {
        const device = new Device();
        if (!id) {
            return device;
        }

        return axios
            .get(`/api/devices/${id}`)
            .then((response) => {
                device.setData(response.data);
                device.added = device.added.split("T")[0];
                device.imei = JSON.parse(device.imei) || [];
                device.msisdns = response.data.linked_msisdns?.split(",").map((el) => parseInt(el)) || [];
                return device;
            })
            .catch((error) => {
                console.log(error);
                return device;
            });
    }

    static async getAvailableMSISDNs() {
        try{
            const response = await axios.get("/api/msisdns");
            let availableMSISDNs = response.data;
            availableMSISDNs.forEach((msisdn) => {
                if (msisdn.multi_device) {
                    for (const md of msisdn.multi_device) {
                        md.mainMsisdn = msisdn.msisdn;
                        md.mainAbonnement = msisdn.abonnement;
                    }
                }
            });
            return availableMSISDNs;
        }catch (e) {
            console.log(e.message);
            toast.error("Error while loading MSISDNs");
            return [];
        }
    }
    static async getDeviceTypes() {
        try{
            const response = await axios.get("/api/devicetypes");
            return response.data;
        }catch (e) {
            console.log(e.message);
            toast.error("Error while loading device types");
            return [];
        }
    }

    static async getManufacturers() {
        try {
            const response = await axios.get("/api/manufacturers");
            return response.data;
        }catch (e) {
            console.log(e.message);
            toast.error("Error while loading manufacturers");
            return [];
        }
    }
}