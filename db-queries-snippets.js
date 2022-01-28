db.getCollection('priceCoverages')
    .aggregate( [
        { $match: {} },
        { $group: { _id: "$ibe", avgScore: { $avg: "$score" } } },
        { $sort : { _id : 1 } },
    ] ).toArray().map(ibe => `${ibe._id} - ${ibe.avgScore}`)

