const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const options = { versionKey: false, timestamps: true } 
module.exports =  { Schema, model, options }