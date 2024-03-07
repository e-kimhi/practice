const { DateTime } = require("luxon");

const convert_date_to_str_yyyy_mm_dd = (date, dateStr) => {
    if (date) {
        let iDate = new Date(date);
        let yearStr = iDate.getFullYear().toString();
        let monthStr = (iDate.getMonth() + 1).toString();
        if ((iDate.getMonth() + 1) < 10)
            monthStr = "0" + monthStr;
        let dayStr = iDate.getDate().toString();
        if (iDate.getDate() < 10)
            dayStr = "0" + dayStr;
        let dateStr = yearStr + "-" + monthStr + "-" + dayStr;
        return dateStr;
    }
    return null;
}


module.exports = {convert_date_to_str_yyyy_mm_dd}