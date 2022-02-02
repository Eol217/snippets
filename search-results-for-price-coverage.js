
var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;


function ms (val, options) {
    options = options || {};
    var type = typeof val;
    if (type === 'string' && val.length > 0) {
        return parse(val);
    } else if (type === 'number' && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
        'val is not a non-empty string or a valid number. val=' +
        JSON.stringify(val)
    );
};

function parse(str) {
    str = String(str);
    if (str.length > 100) {
        return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
    );
    if (!match) {
        return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || 'ms').toLowerCase();
    switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
            return n * y;
        case 'weeks':
        case 'week':
        case 'w':
            return n * w;
        case 'days':
        case 'day':
        case 'd':
            return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
            return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
            return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
            return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
            return n;
        default:
            return undefined;
    }
}

function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return Math.round(ms / d) + 'd';
    }
    if (msAbs >= h) {
        return Math.round(ms / h) + 'h';
    }
    if (msAbs >= m) {
        return Math.round(ms / m) + 'm';
    }
    if (msAbs >= s) {
        return Math.round(ms / s) + 's';
    }
    return ms + 'ms';
}

function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return plural(ms, msAbs, d, 'day');
    }
    if (msAbs >= h) {
        return plural(ms, msAbs, h, 'hour');
    }
    if (msAbs >= m) {
        return plural(ms, msAbs, m, 'minute');
    }
    if (msAbs >= s) {
        return plural(ms, msAbs, s, 'second');
    }
    return ms + ' ms';
}

function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


function fromNow(interval) {
    return new Date(Date.now() + ms(interval)).getTime();
}
function getCheckInAt(interval) {
    const checkIn = new Date(fromNow(interval));
    checkIn.setHours(0, 0, 0, 0);

    return checkIn;
}







var hotelId = "18145247091935012804H3922879677499527945";

db.getCollection('priceCoverages').find({hotelId: hotelId});

db.getCollection('searchResults').find(
    {
        'search.hotelId': hotelId,
        'search.nights': { $lte: 7 },
        $or: [
            {
                'result.crawledAt': { $gt: fromNow('-6h') },
            },
            {
                'checkInAt': { $gte: getCheckInAt('3d'), $lte: getCheckInAt('90d') },
                'result.crawledAt': { $gte: fromNow('-1d'), $lt: fromNow('-6h') },
            },
            {
                'checkInAt': { $gte: getCheckInAt('7d'), $lte: getCheckInAt('90d') },
                'result.crawledAt': { $gte: fromNow('-3d'), $lt: fromNow('-1d') },
            },
            {
                'checkInAt': { $gte: getCheckInAt('30d'), $lte: getCheckInAt('90d') },
                'result.crawledAt': { $gte: fromNow('-7d'), $lt: fromNow('-3d') },
            },
        ],
    }
).count()/630;

