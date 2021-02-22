import jwt from "jsonwebtoken";
import config from "../config/config";
import {UserRoles} from "../models/Users/user_Auth";


const Roles = {
    'admin': ['all'],
}


export const signJwtPromise = (payload, expiration=86400) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            config.secretOrKey,
            {
                expiresIn: expiration // 1 day in seconds
            },
            (err, token) => {
                if (err) {
                    reject(err)
                }
                resolve(token)
            }
        )
    })
}

/**
 * Implement role checking functionality
 * @param {any} req
 * @param {Response<ResBody, Locals>|Request<P, ResBody, ReqBody, ReqQuery, Locals>} res
 * @param {NextFunction|Response<ResBody, Locals>} next
 */
export const checkRole = (req, res, next) => {
    if (req.account.role === UserRoles.Admin) {
        res.statusCode = 401;
        res.json({
            message: 'Forbidden Request'
        })
        return;
    }
    next()
}
