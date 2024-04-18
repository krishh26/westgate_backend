import mongoose from "mongoose";

const foiModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    link: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

foiModel.pre('save', async function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.model('Foi', foiModel);