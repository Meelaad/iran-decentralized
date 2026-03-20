/**
 * shamsi.js — Jalali (Shamsi) ↔ Gregorian (Miladi) date conversion.
 *
 * Algorithm: based on the calendar calculation by Kazimierz Borkowski,
 * adapted from the widely-used jalaali-js implementation.
 * Accurate for the period 1800–2100.
 *
 * Public API:
 *   jalaaliToGregorian(jy, jm, jd)  → { year, month, day }
 *   gregorianToJalaali(gy, gm, gd)  → { year, month, day }
 *   isShamsiYear(year)              → boolean
 *   shamsiYearToGregorian(jy)       → number (Gregorian year)
 */

const J_MONTH_LEN = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

/**
 * Convert a Jalali (Shamsi) date to Gregorian.
 * @param {number} jy  Jalali year  (e.g. 1375)
 * @param {number} jm  Jalali month (1–12)
 * @param {number} jd  Jalali day   (1–31)
 * @returns {{ year: number, month: number, day: number }}
 */
export function jalaaliToGregorian(jy, jm, jd) {
    let y = jy - 979;
    let m = jm - 1;
    let d = jd - 1;

    let jDayNo = 365 * y + Math.floor(y / 33) * 8 + Math.floor((y % 33 + 3) / 4);
    for (let i = 0; i < m; i++) jDayNo += J_MONTH_LEN[i];
    jDayNo += d;

    let gDayNo = jDayNo + 79;

    let gy = 1600 + 400 * Math.floor(gDayNo / 146097);
    gDayNo %= 146097;

    let leap = true;
    if (gDayNo >= 36525) {
        gDayNo--;
        gy += 100 * Math.floor(gDayNo / 36524);
        gDayNo %= 36524;
        if (gDayNo >= 365) gDayNo++;
        else leap = false;
    }

    gy += 4 * Math.floor(gDayNo / 1461);
    gDayNo %= 1461;

    if (gDayNo >= 366) {
        leap = false;
        gDayNo--;
        gy += Math.floor(gDayNo / 365);
        gDayNo %= 365;
    }

    const gml = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm = 0, gd2 = 0;
    for (let i = 0; i < 12; i++) {
        if (gDayNo < gml[i]) { gm = i + 1; gd2 = gDayNo + 1; break; }
        gDayNo -= gml[i];
    }

    return { year: gy, month: gm, day: gd2 };
}

/**
 * Convert a Gregorian date to Jalali (Shamsi).
 * @param {number} gy  Gregorian year  (e.g. 1996)
 * @param {number} gm  Gregorian month (1–12)
 * @param {number} gd  Gregorian day   (1–31)
 * @returns {{ year: number, month: number, day: number }}
 */
export function gregorianToJalaali(gy, gm, gd) {
    const gml = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const isLeapG = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

    let gDayNo = 365 * (gy - 1600)
        + Math.floor((gy - 1600) / 4)
        - Math.floor((gy - 1600) / 100)
        + Math.floor((gy - 1600) / 400);

    for (let i = 0; i < gm - 1; i++) gDayNo += gml[i];
    if (gm > 2 && isLeapG(gy)) gDayNo++;
    gDayNo += gd - 1;

    let jDayNo = gDayNo - 79;

    const j_np = Math.floor(jDayNo / 12053);
    jDayNo %= 12053;

    let jy = 979 + 33 * j_np + 4 * Math.floor(jDayNo / 1461);
    jDayNo %= 1461;

    if (jDayNo >= 366) {
        jy += Math.floor((jDayNo - 1) / 365);
        jDayNo = (jDayNo - 1) % 365;
    }

    let jm = 12, jd2 = jDayNo + 1;
    for (let i = 0; i < 11; i++) {
        if (jDayNo < J_MONTH_LEN[i]) { jm = i + 1; jd2 = jDayNo + 1; break; }
        jDayNo -= J_MONTH_LEN[i];
    }

    return { year: jy, month: jm, day: jd2 };
}

/**
 * Returns true if the number looks like a Shamsi (Jalali) year.
 * Detection range: 1280–1499 covers the past ~100 years and near future.
 * Gregorian years in the same numeric range would be 1280–1499 CE (medieval),
 * which no living person was born in — so there is no ambiguity.
 */
export function isShamsiYear(year) {
    return Number.isInteger(year) && year >= 1280 && year <= 1499;
}

/**
 * Convert a Shamsi year (year only) to approximate Gregorian year.
 * Uses Farvardin 1 (Nowruz) as the anchor: the Gregorian year returned
 * is the one in which that Jalali year begins (~March 20).
 * A person born in Jalali year Y was born in Gregorian year Y+621 or Y+622.
 * This returns Y+621 (conservative — person is at least this age in Gregorian).
 *
 * @param {number} jy  Jalali year (e.g. 1375)
 * @returns {number}   Gregorian year (e.g. 1996)
 */
export function shamsiYearToGregorian(jy) {
    return jalaaliToGregorian(jy, 1, 1).year;
}
