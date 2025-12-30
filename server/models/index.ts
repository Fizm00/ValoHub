import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    savedCrosshairs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Crosshair' }],
    savedSkins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skin' }],
    savedSquads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Squad' }]
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

const agentSchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    description: String,
    developerName: String,
    displayIcon: String,
    fullPortrait: String,
    role: {
        displayName: String,
        description: String,
        displayIcon: String,
    },
    abilities: [{
        slot: String,
        displayName: String,
        description: String,
        displayIcon: String,
    }],
    isPlayableCharacter: Boolean,
}, { timestamps: true });

export const Agent = mongoose.model('Agent', agentSchema);

const mapSchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    narrativeDescription: String,
    tacticalDescription: String,
    splash: String,
    displayIcon: String,
    coordinates: String,
    releaseDate: String,
    xMultiplier: Number,
    yMultiplier: Number,
    xScalarToAdd: Number,
    yScalarToAdd: Number,
    callouts: [{
        regionName: String,
        superRegionName: String,
        location: { x: Number, y: Number }
    }]
}, { timestamps: true });

export const MapModel = mongoose.model('Map', mapSchema);

const weaponSchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    category: String,
    displayIcon: String,
    shopData: {
        cost: Number,
        category: String,
        categoryText: String,
    },
    weaponStats: {
        fireRate: Number,
        magazineSize: Number,
        damageRanges: [{
            rangeStartMeters: Number,
            rangeEndMeters: Number,
            headDamage: Number,
            bodyDamage: Number,
            legDamage: Number
        }]
    },
    skins: [{
        uuid: String,
        displayName: String,
        themeUuid: String,
        contentTierUuid: String,
        displayIcon: String,
        wallpaper: String,
        chromas: [{
            uuid: String,
            displayName: String,
            displayIcon: String,
            fullRender: String,
            swatch: String,
            streamedVideo: String
        }],
        levels: [{
            uuid: String,
            displayName: String,
            levelItem: String,
            displayIcon: String,
            streamedVideo: String
        }]
    }],
    strategyGuide: [String] // NEW: Specific tips provided by backend metadata
}, { timestamps: true });

export const Weapon = mongoose.model('Weapon', weaponSchema);

const skinSchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    weaponUuid: { type: String, required: true, index: true }, // Link to parent weapon
    themeUuid: String,
    contentTierUuid: String,
    displayIcon: String,
    wallpaper: String,
    chromas: [{
        uuid: String,
        displayName: String,
        displayIcon: String,
        fullRender: String,
        swatch: String,
        streamedVideo: String
    }],
    levels: [{
        uuid: String,
        displayName: String,
        levelItem: String,
        displayIcon: String,
        streamedVideo: String
    }]
}, { timestamps: true });

export const Skin = mongoose.model('Skin', skinSchema);

const squadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    map: { type: String, required: true },
    agents: [{ type: String }], // Array of Agent UUIDs
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Squad = mongoose.model('Squad', squadSchema);
