import axios from "axios";
import { BILLING_URL } from "../utils/constants";

export default axios.create({
    baseURL: BILLING_URL
});
