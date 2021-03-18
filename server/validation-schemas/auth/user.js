

export const schema = {
    userId: {
        exists: true,
        errorMessage: "User Id must be defined"
    },
    token: {
        isAlphanumeric: true,
        errorMessage: "Invalid user token"
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