export function formatDate(dateString) {
    const date = formatDateFunction(dateString)
    return `${date.hours}:${date.minutes}, ${date.day}/${date.month}/${date.year}`
}

export function formatTime(dateString) {
    const date = formatDateFunction(dateString)
    return `${date.hours}:${date.minutes}`
}

function formatDateFunction(dateString) {
    const today = new Date(dateString)
    var day = today.getUTCDate()
    if (day < 10)
        day = "0" + day;

    var month = parseInt(today.getMonth() + 1)
    if (month < 10)
        month = "0" + month;

    var hours = today.getHours();
    if (hours < 10)
        hours = "0" + hours;

    var minutes = today.getMinutes();
    if (minutes < 10)
        minutes = "0" + minutes;

    var year = today.getFullYear();
    return {"hours":hours, "minutes":minutes,"day":day,"month":month,"year":year}
}


export function getUTCDate(dateString) {
    const today = new Date(dateString)
    var day = today.getUTCDate()
    if (day < 10)
        day = "0" + day;

    var month = parseInt(today.getUTCMonth() + 1)
    if (month < 10)
        month = "0" + month;

    var hours = today.getUTCHours();
    if (hours < 10)
        hours = "0" + hours;

    var minutes = today.getUTCMinutes();
    if (minutes < 10)
        minutes = "0" + minutes;

    var year = today.getUTCFullYear();
    return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function formatDateForDatePicker(unformatted_date) {
    const date = new Date(unformatted_date);
    if (!unformatted_date) {
        return "1970-01-01T00:00"
    }
    var day = date.getDate()
    if (day < 10)
        day = "0" + day;

    var month = parseInt(date.getMonth() + 1)
    if (month < 10)
        month = "0" + month;

    var hours = date.getHours();
    if (hours < 10)
        hours = "0" + hours;

    var minutes = date.getMinutes();
    if (minutes < 10)
        minutes = "0" + minutes;

    var year = date.getFullYear();

    return `${year}-${month}-${day}T${hours}:${minutes}`

}

export function filterReservations(reservations) {
    const res = []
    const dateToCompareTo = new Date();
    dateToCompareTo.setHours(dateToCompareTo.getHours() - 1);
    for (const reservation of reservations) {
        const d = new Date(getUTCDate(reservation.datum));
        if (d > dateToCompareTo.getUTCDate()) {
            reservation["status"] = "passed";
            res.push(reservation);
        }
    }
    return res;

}

export function filterReservationsByDate(reservations) {
    const res = []
    const dateToCompareTo = new Date();
    const yearTCT = dateToCompareTo.getUTCFullYear();
    const monthTCT = dateToCompareTo.getUTCMonth();
    const dayTCT = dateToCompareTo.getUTCDate();
    for (const reservation of reservations) {
        const date = new Date(reservation.start_date);
        const resDay = date.getUTCDate();
        const resMonth = date.getUTCMonth();
        const resYear = date.getUTCFullYear();
        if (monthTCT === resMonth && yearTCT === resYear && dayTCT === resDay) {
            res.push(reservation);
        }
    }
    return res;
}