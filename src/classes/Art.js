import Furniture, { ART, LOW_FANCINESS, MID_FANCINESS, HIGH_FANCINESS } from "./Furniture";
import { ART_TYPE, LOW_ART, MID_ART, HIGH_ART } from '../constants';

export default class Art extends Furniture {
    constructor(fanciness) {
        super(ART_TYPE, ART * fanciness * Furniture.getFudgeFactor());
        switch (fanciness) {
            case LOW_FANCINESS: 
                this.image = LOW_ART;
                break;
            case MID_FANCINESS:
                this.image = MID_ART;
                break;
            case HIGH_FANCINESS:
                this.image = HIGH_ART;
                break;
        }
    }
}