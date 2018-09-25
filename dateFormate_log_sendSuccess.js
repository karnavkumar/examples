getCurrentMonthYear = () => {
    let date = new Date();
    return { year: date.getFullYear(), month: date.getMonth() + 1, date: date.getDate() }
}
daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
}
log = (a, b) => {
    if (typeof config.CONSOLELOGFLAG != "undefined" && config.CONSOLELOGFLAG == true) {
        var err = new Error();
        var caller_line = err.stack.split("\n")[2];
        var index = caller_line.indexOf("at ");
        var clean = caller_line.slice(index + 2, caller_line.length);
        if (a == undefined) { return } else if (b == undefined) {
            if (Array.isArray(a)) return console.log(a, `length : ${a.length}`, clean.replace(/^\D+/g, ''));
            else return console.log(a, clean.replace(/^\D+/g, ''));
        } else {
            if (Array.isArray(a)) return console.log(a, b, `length : ${a.length}`, clean.replace(/^\D+/g, ''));
            else if (Array.isArray(b)) return console.log(a, b, `length : ${b.length}`, clean.replace(/^\D+/g, ''));
            else return console.log(a, b, clean.replace(/^\D+/g, ''));
        }
    }
};
table = (a = null) => {
    if (typeof config.CONSOLELOGFLAG != "undefined" && config.CONSOLELOGFLAG == true) {
        if (a != null && Array.isArray(a)) return table(a);
        if (a != null) return log(a)
    }
}
// Global Error Function Do Not Delete.
sendErr = (d) => { return { status: 0, statusCode: 500, message: d.message || d } };
sendSuccess = (d, m, l) => { return { status: 1, statusCode: 200, message: m, data: d, total: l } };
paramErr = (param) => { return { status: 0, statusCode: 500, message: `Please Pass Parameter : ${param}`, } }

createdAtDateFilterQuery = (globalDate, req, dateKey) => {
    if (globalDate) {
        if (globalDate && globalDate.type != undefined) {
            var globalDateObj = {};
            if (globalDate.type == 1 || globalDate.type == 2) {
                if (!globalDate.date) { return { message: DATE_REQUIRED_ERROR, status: 0 }; }
                let date = globalDate.date.split('/')
                let y = date[2], m = date[0], d = date[1]
                globalDateObj[dateKey] = { $gte: new Date(`${y}-${m}-${d}T00:00:00.000Z`), $lt: new Date(`${y}-${m}-${d}T23:59:59.999Z`) };
                log(globalDateObj[dateKey], 'globalDateObj[dateKey]')
            }
            if (globalDate.type == 3 || globalDate.type == 4 || globalDate.type == 7) {
                var from, to, isDateExist;
                if (!req.body.globalDate.from && req.body.globalDate.to) {
                    return { message: DATE_FROM_MISSING, status: 0 };
                }
                if (req.body.globalDate.from && !req.body.globalDate.to) {
                    return { message: DATE_TO_MISSING, status: 0 };
                }
                if (!req.body.globalDate.from && !req.body.globalDate.to) {
                    isDateExist = null;
                }
                let date = globalDate.from.split('/')
                let y = date[2], m = date[0], d = date[1]
                let start = new Date(`${y}-${m}-${d}T00:00:00.000Z`);
                let date1 = globalDate.to.split('/')
                y = date1[2], m = date1[0], d = date1[1]
                let end = new Date(`${y}-${m}-${d}T23:59:59.999Z`);
                globalDateObj[dateKey] = { $gte: start, $lt: end };
            }
            if (globalDate.type == 5) {
                let monthYear = getCurrentMonthYear();
                let days = daysInMonth(monthYear.month, monthYear.year);
                let month = '';
                (monthYear.month.toString().length == 0 || monthYear.month.toString().length == 1) ? month = `0${monthYear.month}` : month = monthYear.month;
                log(`${monthYear.year}-${month}-01T00:00:00.000Z`)
                globalDateObj[dateKey] = { $gte: new Date(`${monthYear.year}-${month}-01T00:00:00.000Z`), $lt: new Date(`${monthYear.year}-${month}-${days}T23:59:59.999Z`) };
            }
            if (globalDate.type == 6) {
                let monthYear = getCurrentMonthYear();
                let month = '';
                monthYear.month = monthYear.month - 1;
                monthYear.month = 00;
                monthYear.year = 2018;
                if (monthYear.month == 0) { monthYear.year = monthYear.year - 1; monthYear.month = 12; }
                let days = daysInMonth(monthYear.month, monthYear.year);
                (monthYear.month.toString().length == 0 || monthYear.month.toString().length == 1) ? month = `0${monthYear.month}` : month = monthYear.month;
                log(`${monthYear.year}-${month}-01T00:00:00.000Z`)
                globalDateObj[dateKey] = { $gte: new Date(`${monthYear.year}-${month}-01T00:00:00.000Z`), $lt: new Date(`${monthYear.year}-${month}-${days}T23:59:59.999Z`) };
            }

            return globalDateObj;
        }
    }

}
getDateRangeFilterQuery = function (from, to) {
    var start = new Date(from);
    start.setHours(0, 0, 0, 0);
    var end = new Date(from);
    if (to != '' && to != undefined) {
        end = new Date(to);
    }
    end.setHours(23, 59, 59, 999);
    return { $gte: start, $lt: end };
}
