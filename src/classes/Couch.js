import Furniture, { COUCH, LOW_FANCINESS, MID_FANCINESS, HIGH_FANCINESS } from "./Furniture";
import { COUCH_TYPE, LOW_COUCH, MID_COUCH, HIGH_COUCH } from '../constants';

export default class Couch extends Furniture {
    constructor(fanciness) {
        super(COUCH_TYPE, COUCH * fanciness * Furniture.getFudgeFactor());
        switch (fanciness) {
            case LOW_FANCINESS: 
                this.image = LOW_COUCH;
                break;
            case MID_FANCINESS:
                this.image = MID_COUCH;
                break;
            case HIGH_FANCINESS:
                this.image = HIGH_COUCH;
                break;
        }
    }
}