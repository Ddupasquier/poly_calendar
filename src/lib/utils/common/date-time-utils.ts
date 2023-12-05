import moment from 'moment';

const checkDate = (dateToCheck: string): string => {
    if (!dateToCheck) return "";

    if (moment(dateToCheck, 'YYYY-MM-DD', true).isValid()) {
        return dateToCheck;
    } else {
        return formatDate(dateToCheck);
    }
}

const formatDate = (date: string | Date): string => {
    if (!date) return "";

    const d = new Date(date);

    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` as string;
};

export {
    checkDate,
    formatDate,
};