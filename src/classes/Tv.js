import Furniture, { TV, LOW_FANCINESS, MID_FANCINESS, HIGH_FANCINESS } from "./Furniture";
import { TV_TYPE, LOW_TV, MID_TV, HIGH_TV } from '../constants';

export default class Tv extends Furniture {
    constructor(fanciness) {
        super(TV_TYPE, TV * fanciness * Furniture.getFudgeFactor(), fanciness);
        switch (fanciness) {
            case LOW_FANCINESS: 
                this.image = LOW_TV;
                break;
            case MID_FANCINESS:
                this.image = MID_TV;
                break;
            case HIGH_FANCINESS:
                this.image = HIGH_TV;
                break;
        }
    }
}