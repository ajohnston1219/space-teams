import axios from "axios";
import { RESOURCES_URL } from "../utils/constants";

export default axios.create({
    baseURL: RESOURCES_URL
});
