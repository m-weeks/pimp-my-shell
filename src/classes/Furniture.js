export const QUALITY = 2;
export const FUDGE_FACTOR = 16; // one less when floored
export const SCORE_MULTIPLIER = 100;
export const PLANT = 1 * QUALITY;
export const LAMP = 2 * QUALITY;
export const RUG = 3 * QUALITY;
export const BOOKSHELF = 4 * QUALITY;
export const COUCH = 5 * QUALITY;
export const ANTENNA = 6 * QUALITY;
export const TV = 7 * QUALITY;
export const ART = 8 * QUALITY;

export const LOW_FANCINESS = 1;
export const MID_FANCINESS = 2;
export const HIGH_FANCINESS = 3;

export default class Furniture {
    constructor(type, points, fanciness) {
        this.type = type;
        this.points = points * SCORE_MULTIPLIER;
        this.fanciness = fanciness;
    }

    // Return a percentage based on the fudge factor used to randomize point values on each item a little bit.
    static getFudgeFactor() {
        var fudge = ((Math.floor(Math.random() * FUDGE_FACTOR * 2) - FUDGE_FACTOR) / 100) + 1;
        
        return fudge;
        
    }
}