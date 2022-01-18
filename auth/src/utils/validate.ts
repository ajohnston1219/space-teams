import { DateTime } from "luxon";

export const exists = (data: any) => data !== null && data !== undefined && data !== "";

const numberExp = /^[\d]+$/;
export const numeric = (data: any) => numberExp.test(data);

const alphaNumericExp = /^\w+$/;
export const alphanumeric = (data: any) => alphaNumericExp.test(data);

const phoneExp = /^ *\(?\d{3} *\)? *[\.|-]? *\d{3} *[\.|-]? *\d{4} *$/;
export const phoneNumber = (data: any) => phoneExp.test(data);

const licensePlateExp = /^\w+ *-? *\w*$/;
export const licensePlate = (data: any) => licensePlateExp.test(data);

const nameExp = /^[\w,\.\- ]+$/;
export const name = (data: any) => nameExp.test(data);

const emailExp = /^.{1,}@.{1,}\..{1,}$/;
export const email = (data: any) => emailExp.test(data);

export const date = (data: any) => {
    const d = DateTime.fromISO(data);
    return d.invalidReason ? false : true;
};

const serviceExp = /^[\w,\.\- ]+$/;
export const service = (data: any) => serviceExp.test(data);
