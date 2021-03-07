var dateFormat = require("dateformat");

const formatting = {};

formatting.formatDate = (date, format) => {
    return dateFormat(new Date(date), format);
};

export default formatting;