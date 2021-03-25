const getAggregationMatchQuery = (personnel, matchingRole, additionalMatches) => {
    return {
        $match: {
            ...additionalMatches,
            role: matchingRole,
            availability: {
                $elemMatch: {
                    $or: personnel.availability.map(available => {
                        return {
                            $and: [
                                {startTime: {$gte: available.startTime}},
                                {endTime: {$lte: available.endTime}}
                            ]
                        }
                    })
                }
            }
        }
    }
}

const getAggregationProjectionQuery = (personnel, extraProjection) => {
    return {
        $project: {
            ...extraProjection,
            availability: {
                $filter: {
                    input: "$availability",
                    as: "available",
                    cond: {
                        $or: personnel.availability.map(available => {
                            return {
                                $and: [
                                    {$gte: ["$$available.startTime", available.startTime]},
                                    {$gte: ["$$available.endTime", available.endTime]}
                                ]
                            }
                        })
                    }
                }
            }
        }
    }
}

export const buildQuery = (schoolPersonnel, additionalMatches, role, extraProjection, limit) => {
    return [
        {
            $facet: schoolPersonnel.map(personnel => {
                return {
                    [String(personnel._id)]: [
                        getAggregationMatchQuery(personnel, role, additionalMatches),
                        getAggregationProjectionQuery(personnel, extraProjection),
                        {$limit: limit}
                    ]
                }
            }).reduce((acc, query) => Object.assign(acc, query), {})
        }
    ]

}
//
// db.users.aggregate([
//     {
//         $facet: {
//             "5e974ff4f3784e2b9a271174": [
//                 {
//                     $match: {
//                         role: "volunteer",
//                         availability: {
//                             $elemMatch: {
//                                 $or: [
//                                     {
//                                         $and: [
//                                             {startTime: {$gte: ISODate("2000-01-06T20:30:00Z")}},
//                                             {endTime: {$lte: ISODate("2000-01-06T22:45:00Z")}}
//                                         ],
//                                     },
//                                     {
//                                         $and: [
//                                             {startTime: {$gte: ISODate("2000-01-03T20:15:00Z")}},
//                                             {endTime: {$lte: ISODate("2000-01-03T22:45:00Z")}}
//                                         ]
//                                     }
//                                 ]
//                             }
//                         }
//                     }
//                 },
//                 {
//                     $project: {
//                         role: 1,
//                         availability: {
//                             $filter: {
//                                 input: "$availability",
//                                 as: "available",
//                                 cond: {
//                                     $or: [
//                                         {
//                                             $and: [
//                                                 {$gte: ["$$available.startTime", ISODate("2000-01-06T20:30:00Z")]},
//                                                 {$gte: ["$$available.endTime", ISODate("2000-01-06T22:45:00Z")]}
//                                             ]
//                                         },
//                                         {
//                                             $and: [
//                                                 {$gte: ["$$available.startTime", ISODate("2000-01-03T20:15:00Z")]},
//                                                 {$gte: ["$$available.endTime", ISODate("2000-01-03T22:45:00Z")]},
//                                             ]
//                                         }
//                                     ]
//                                 }
//                             }
//                         }
//                     }
//                 },
//                 {
//                     $limit: 3
//                 }
//             ]
//         }
//     }
// ])