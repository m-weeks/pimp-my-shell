import Furniture, { LAMP, LOW_FANCINESS, MID_FANCINESS, HIGH_FANCINESS } from "./Furniture";
import { LAMP_TYPE, LOW_LAMP, MID_LAMP, HIGH_LAMP } from '../constants';

export default class Lamp extends Furniture {
    constructor(fanciness) {
        super(LAMP_TYPE, LAMP * fanciness * Furniture.getFudgeFactor());
        switch (fanciness) {
            case LOW_FANCINESS: 
                this.image = LOW_LAMP;
                break;
            case MID_FANCINESS:
                this.image = MID_LAMP;
                break;
            case HIGH_FANCINESS:
                this.image = HIGH_LAMP;
                break;
        }
    }
}