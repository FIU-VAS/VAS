export const schema = {
    semester: {
        isAlpha: true,
        errorMessage: "Invalid value for semester"
    },
    year: {
        isNumeric: true,
        isLength: {
            options: {
                min: 4,
                max: 4
            }
        },
        errorMessage: "Invalid value for year"
    }
}