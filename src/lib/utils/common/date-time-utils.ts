import { isValid, parse, format } from 'date-fns';

const checkDate = (dateToCheck: string): string => {
    if (!dateToCheck) return "";

    // Using parse and isValid from date-fns to check the validity of the date
    const parsedDate = parse(dateToCheck, 'yyyy-MM-dd', new Date());
    if (isValid(parsedDate)) {
        return dateToCheck;
    } else {
        return formatDate(dateToCheck);
    }
}

const formatDate = (date: string | Date): string => {
    if (!date) return "";

    // Creating a Date object if the date is a string
    const d = typeof date === 'string' ? new Date(date) : date;

    // Using format from date-fns to format the date
    return format(d, 'yyyy-MM-dd');
};

export {
    checkDate,
    formatDate,
};
