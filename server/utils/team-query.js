import {addMinutes, subMinutes} from "date-fns";


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

export const buildVolunteerByAvailability = (semester, year, availability, additionalConditions = {}) => {
    return [
        {
            $match: {
                role: "volunteer",
                isActive: true,
                availability: {
                    $elemMatch: {
                        $or: availability.map(available => {
                            return {
                                $and: [
                                    {startTime: {$gte: subMinutes(available.startTime, 30)}},
                                    {endTime: {$lte: addMinutes(available.endTime, 30)}}
                                ]
                            }
                        })
                    }
                }
            },
        },
        {
            $lookup: {
                from: "teams",
                let: {pantherID: "$pantherID"},
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $in: ["$$pantherID", "$volunteerPIs"]
                                    },
                                    {
                                        $eq: ["$year", year]
                                    },
                                    {
                                        $eq: ["$semester", semester]
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: "assignedTeams"
            }
        },
        {
            $match: {
                assignedTeams: {
                    $exists: true,
                    $eq: []
                },
                ...additionalConditions
            }
        }
    ]
};