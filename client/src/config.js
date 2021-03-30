const config = {
	uri: new URL('/api', window.location.href).href,
	endpoints: {
		account: {
			fetch: '/account',
			register: '/account/register',
			login: '/account/login',
			update: '/account/update',
			sendResetPassword: '/account/send-reset-password',
			resetPassword: '/account/reset-password',
		},
		admin: {
			signup: '/admin',
			update: '/admin',
			fetch: '/admin',
			fetchByid: '/admin',
		},
		volunteers: {
			getVolunteerInfo: '/volunteers/getVolunteerInfo',
			signup: '/volunteers',
			fetch: '/volunteers',
			fetchByid: '/volunteers',
			update: '/volunteers',
			updateProfile: '/volunteers/updateProfile',
			
		},
		schools: {
			create: '/school/create',
			fetch: '/school',
			update: '/school/update',
			getSchoolInfo: '/school/getSchoolInfo'
		},	
		schoolPersonnels: {
			signup: '/school-personnels',
			fetch: '/school-personnels',
			fetchByid: '/school-personnels',
			update: '/school-personnels',
			getPersonnelInfo: '/school-personnels/getPersonnelInfo'
		},
		team: {
			create: '/team',
			fetch: '/team',
			update: '/team/update',
			getTeamInfo: '/team/getTeamInfo',
			getTeamInfoSch: '/team/getTeamInfoSch',
			getTeamData: '/team/getTeamData'
		},
		user: {
			me: '/account/me'
		}
	},
	userRoles: {
		admin: 'admin',
		volunteer: 'volunteer',
		schoolPersonnel: 'schoolPersonnel'
	}
};

export default config;
