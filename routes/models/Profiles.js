const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: {type: String, requires: true},
    gender: {type: String, requires: true},
    birthdate: {type: String, requires: true},
    city: {type: String, requires: true},
    owner: {type: Types.ObjectId, ref: 'User'},
});

const modelSchema = model('Profile', schema);

module.exports = { Profile: modelSchema };