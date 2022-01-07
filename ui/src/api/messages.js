import axios from "axios";
import { MESSAGING_URL } from "../utils/constants";

export default axios.create({
    baseURL: MESSAGING_URL
});
