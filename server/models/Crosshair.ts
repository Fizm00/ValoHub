import mongoose from 'mongoose';

const CrosshairSchema = new mongoose.Schema({
    player: { type: String, required: true },
    team: { type: String, required: true },
    code: { type: String, required: true },
    isPro: { type: Boolean, default: true },
    config: {
        color: { type: String, required: true },
        outlines: { type: Boolean, default: true },
        outlineOpacity: Number,
        outlineThickness: Number,
        centerDot: { type: Boolean, default: false },
        centerDotOpacity: Number,
        centerDotThickness: Number,
        innerLines: {
            show: { type: Boolean, default: true },
            opacity: Number,
            length: Number,
            thickness: Number,
            offset: Number
        },
        outerLines: {
            show: { type: Boolean, default: true },
            opacity: Number,
            length: Number,
            thickness: Number,
            offset: Number
        }
    },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export const Crosshair = mongoose.model('Crosshair', CrosshairSchema);
