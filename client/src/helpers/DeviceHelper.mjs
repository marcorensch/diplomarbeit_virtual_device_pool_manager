import axios from "axios";
import Device from "@/models/Device.mjs";
import {useToast} from "vue-toastification";
const toast = useToast();

export default class DeviceHelper {

    static async store(device) {
        let storageDevice = { ...device };
        if(storageDevice.msisdns) storageDevice.msisdns = storageDevice.msisdns.map((m) => m.id);
        storageDevice.imei = JSON.stringify(device.imei);
        if (storageDevice.id) {
            try{
                await axios.put(`/api/devices/${storageDevice.id}`, storageDevice);
                toast.success("Device saved");
                return true;
            }catch (e) {
                console.log(e.response.message);
                toast.error("Device could not be saved");
                return false;
            }
        } else {
            try{
                const response = await axios.post(`/api/devices`, storageDevice);
                toast.success("Device saved");
                device.id = response.data.id;
                return true;
            }catch(e){
                console.log(e.response.message);
                toast.error("Device could not be saved");
                return false;
            }
        }
    }

    static async delete(deviceId) {
        try{
            await axios.delete(`/api/devices/${deviceId}`);
            toast.success("Device deleted");
        }catch (e) {
            toast.error("Device could not be deleted");
        }
    }

    static async getDevices(limit, offset, filters) {
        let filterString = "";
        let paginationString = "";

        limit = !limit ? 20 : limit;
        offset = !offset ? 0 : offset;
        paginationString += `limit=${limit}&offset=${offset}`;

        filterString += filters.search ? `&search=${filters.search}` : "";
        filterString += filters.type ? `&type=${filters.type}` : "";
        filterString += filters.availability ? `&availability=${filters.availability}` : "";


        try{
            const response = await axios.get(`/api/devices?${paginationString}${filterString}`);
            return response.data;
        }catch (e) {
            toast.error("Error getting devices");
            return [];
        }
    }
    static async loadDevice(id) {
        const device = new Device();
        if (!id) {
            return device;
        }

        try {
            const response = await axios.get(`/api/devices/${id}`);
            console.log(response.data)
            device.setData(response.data);
            device.added = device.added.split("T")[0];
            device.imei = JSON.parse(device.imei) || [];
            device.slot = device.slot_id ? await DeviceHelper.getSlot(device.slot_id) : null;
        } catch (e) {
            console.log(e);
        }

        return device;
    }

    static async getSlot(id) {
        try {
            const response = await axios.get(`/api/devicepool/items/${id}`);
            return response.data;
        }catch (e) {
            console.log(e.message);
            toast.error("Error while loading slot label");
            return "";
        }
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

    static isValidName(name) {
        const regex = /^[a-z0-9_\- ]+$/i;
        return regex.test(name);
    }
}