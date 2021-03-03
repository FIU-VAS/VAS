import passport from 'passport';
import User from '../models/Users/user_Auth';
import config from './config'
import {signJwtPromise} from "../utils/passport";

const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretOrKey;

passport.use(new LocalStrategy({
	usernameField: 'email'
}, async (username, password, done) => {
	const user = await User.findOne({email: username});
	if (!user || !user.validPassword(password)) {
		return done(null, false);
	}
	let payload = {
		id: user.id,
		email: user.email,
		role: user.role
	}
	user.token = await signJwtPromise(payload)
	await user.save();
	return done(null, user)
}))

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
	User.findById(jwt_payload.id)
		.then(user => {
			if (user) {
				return done(null, user);
			}
			return done(null, false);
		});
}));

export default passport;