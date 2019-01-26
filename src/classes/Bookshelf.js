import Furniture, { BOOKSHELF, LOW_FANCINESS, MID_FANCINESS, HIGH_FANCINESS } from "./Furniture";
import { BOOKSHELF_TYPE, LOW_BOOKSHELF, MID_BOOKSHELF, HIGH_BOOKSHELF } from '../constants';

export default class Bookshelf extends Furniture {
    constructor(fanciness) {
        super(BOOKSHELF_TYPE, BOOKSHELF * fanciness * Furniture.getFudgeFactor());
        switch (fanciness) {
            case LOW_FANCINESS: 
                this.image = LOW_BOOKSHELF;
                break;
            case MID_FANCINESS:
                this.image = MID_BOOKSHELF;
                break;
            case HIGH_FANCINESS:
                this.image = HIGH_BOOKSHELF;
                break;
        }
    }
}