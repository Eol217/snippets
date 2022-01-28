db.getCollection('priceCoverages')
    .aggregate( [
        { $match: {} },
        { $group: { _id: "$ibe", avgScore: { $avg: "$score" } } },
        { $sort : { _id : 1 } },
    ] ).toArray().map(ibe => `${ibe._id} - ${ibe.avgScore}`)

db.getCollection('searchResults').find(
    {
        'search.hotelId': "12633531324025229998H2337470068379471370",
        'search.nights': { $lte: 7 },
        'checkInAt': { $gte: new Date(), $lte: new Date(new Date().setDate(new Date().getDate() + 90)) },
        'result.crawledAt': { $gt: new Date('2022-01-14T00:00:00').getTime() },
    }
).count()
