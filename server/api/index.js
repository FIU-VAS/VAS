import express from 'express';
import account from './account';
import volunteers from './volunteers';
import admin from './admin';
import schoolPersonnels from './school-personnels';
import school from './school';
import teams from './teams';
import siteSettings from './site-settings';
import passport from "../config/passport";

const router = new express.Router();

router.use('/account', account.router);
router.use('/volunteers', passport.authorize('jwt'), volunteers.router);
router.use('/admin', passport.authorize('jwt'), admin.router);
router.use('/school-personnels', passport.authorize('jwt'), schoolPersonnels.router);
router.use('/school', passport.authorize('jwt'), school.router);
router.use('/team', passport.authorize('jwt'), teams.router);
router.use('/site-settings', passport.authorize('jwt'), siteSettings.router);

router.all('*', (req, res) => {
	res.status(400).json({
		Error: 'Invalid resource',
	});
});

export default router;
