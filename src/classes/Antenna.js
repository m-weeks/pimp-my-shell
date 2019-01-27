import Furniture, { ANTENNA, LOW_FANCINESS, MID_FANCINESS, HIGH_FANCINESS } from "./Furniture";
import { ANTENNA_TYPE, LOW_ANTENNA, MID_ANTENNA, HIGH_ANTENNA } from '../constants';

export default class Antenna extends Furniture {
    constructor(fanciness) {
        super(ANTENNA_TYPE, ANTENNA * fanciness * Furniture.getFudgeFactor(), fanciness);
        switch (fanciness) {
            case LOW_FANCINESS: 
                this.image = LOW_ANTENNA;
                break;
            case MID_FANCINESS:
                this.image = MID_ANTENNA;
                break;
            case HIGH_FANCINESS:
                this.image = HIGH_ANTENNA;
                break;
        }
    }
}