

export const schema = {
    email: {
        isEmail: true
    },
    password: {
        isLength: {
            options: {
                min: 8,
                max: 16
            },
            errorMessage: 'Password should be at least 7 chars long'
        }
    }
}