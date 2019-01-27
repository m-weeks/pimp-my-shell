import Furniture, { RUG, LOW_FANCINESS, MID_FANCINESS, HIGH_FANCINESS} from "./Furniture";
import { RUG_TYPE, LOW_RUG, MID_RUG, HIGH_RUG } from '../constants';

export default class Rug extends Furniture {
    constructor(fanciness) {
        super(RUG_TYPE, RUG * fanciness * Furniture.getFudgeFactor(), fanciness);
        switch (fanciness) {
            case LOW_FANCINESS: 
                this.image = LOW_RUG;
                break;
            case MID_FANCINESS:
                this.image = MID_RUG;
                break;
            case HIGH_FANCINESS:
                this.image = HIGH_RUG;
                break;
        }
    }
}