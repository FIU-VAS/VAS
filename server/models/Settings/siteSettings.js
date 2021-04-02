const mongoose = require('mongoose')

const SiteSettingsSchema = new mongoose.Schema({

    schoolForm:{
        type: String,
        default: ''
    },
    volunteerForm:{
        type: String,
        default: ''
    }
});

export default mongoose.model('siteSettings', SiteSettingsSchema)
