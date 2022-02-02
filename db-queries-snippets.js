db.getCollection('priceCoverages')
    .aggregate( [
        { $match: {} },
        { $group: { _id: "$ibe", avgScore: { $avg: "$score" } } },
        { $sort : { _id : 1 } },
    ] ).toArray().map(ibe => `${ibe._id} - ${ibe.avgScore}`)

// all results
db.getCollection('searchResults').find(
    {
        'search.hotelId': "4404277886483379677H14819020022498232905",
        'search.nights': { $lte: 7 },
        'checkInAt': { $gte: new Date(), $lte: new Date(new Date().setDate(new Date().getDate() + 90)) },
        'result.crawledAt': { $gt: new Date('2022-01-17T00:00:00').getTime() },
    }
).count()

// crawledAt <= 6h
db.getCollection('searchResults').find(
    {
        'search.hotelId': "14810592085688282439H10051094366830057032",
        'search.nights': { $lte: 7 },
        'checkInAt': { $gte: new Date(), $lte: new Date(new Date().setDate(new Date().getDate() + 3)) },
        'result.crawledAt': { $gte: new Date('2022-01-30T17:35:00').getTime(), $lt: new Date('2022-01-31T11:35:00').getTime() },
    }
).count()

// const ms = require('./ms.js');
function fromNow(interval) {
    return new Date(Date.now() + ms(interval));
}
function getCheckInAt(interval) {
    const checkIn = new Date(fromNow(interval));
    checkIn.setHours(0, 0, 0, 0);

    return checkIn;
}

db.getCollection('searchResults').find(
    {
        'search.hotelId': "4404277886483379677H14819020022498232905",
        'search.nights': { $lte: 7 },
        $or: [
            {
                'result.crawledAt': { $gt: fromNow('-6h').getTime() },
            },
            {
                'checkInAt': { $gt: getCheckInAt('1d'), $lte: getCheckInAt('3d') },
                'result.crawledAt': { $gte: fromNow('-1d').getTime(), $lt: fromNow('-6h').getTime() },
            },
            {
                'checkInAt': { $gt: getCheckInAt('3d'), $lte: getCheckInAt('7d') },
                'result.crawledAt': { $gte: fromNow('-3d').getTime(), $lt: fromNow('-1d').getTime() },
            },
            {
                'checkInAt': { $gt: getCheckInAt('7d'), $lte: getCheckInAt('30d') },
                'result.crawledAt': { $gte: fromNow('-7d').getTime(), $lt: fromNow('-3d').getTime() },
            },
            {
                'checkInAt': { $gt: getCheckInAt('30d'), $lte: getCheckInAt('90d') },
                'result.crawledAt': { $gte: fromNow('-14d').getTime(), $lt: fromNow('-7d').getTime() },
            },
        ],
    }
).count()
