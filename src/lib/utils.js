/**
 * Calculates age from a date string (YYYY-MM-DD).
 * @param {string} dateStr - ISO date string
 * @returns {number|null} Age in years, or null if invalid
 */
export function calcAge(dateStr) {
    if (!dateStr) return null;
    const birth = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}
