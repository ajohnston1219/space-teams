import axios from "axios";
import { COMP_URL } from "../utils/constants";

export default axios.create({
    baseURL: COMP_URL,
});
