import Furniture, { PLANT, LOW_FANCINESS, MID_FANCINESS, HIGH_FANCINESS } from "./Furniture";
import { PLANT_TYPE, LOW_PLANT, MID_PLANT, HIGH_PLANT } from '../constants';

export default class Plant extends Furniture {
    constructor(fanciness) {
        super(PLANT_TYPE, PLANT * fanciness * Furniture.getFudgeFactor());
        switch (fanciness) {
            case LOW_FANCINESS: 
                this.image = LOW_PLANT;
                break;
            case MID_FANCINESS:
                this.image = MID_PLANT;
                break;
            case HIGH_FANCINESS:
                this.image = HIGH_PLANT;
                break;
        }
    }
}