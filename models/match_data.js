module.exports = function (mongoose) {
    var options = {
        collection: 'match_data',
        timestamps: {
            createdAt: 'created_on',
            updatedAt: 'updated_on',
        }
    };
    var matchData = new mongoose.Schema({
        sessionId: {
            type: String,
            index: true
        },
        yellowWinCount: {
            type: Number,
            default: 0
        },
        redWinCount: {
            type: Number,
            default: 0
        },
        yellow: {
            type: Array,
            default: []
        },
        red: {
            type: Array,
            default: []
        },
        array: {
            type: Array
        },
    }, options);

    return matchData;
};