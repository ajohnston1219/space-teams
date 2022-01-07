import axios from "axios";
import { SIMS_URL } from "../utils/constants";

export default axios.create({
    baseURL: SIMS_URL
});
