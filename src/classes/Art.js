import Furniture, { ART } from "./Furniture";
import { ART_TYPE } from '../constants';

export default class Art extends Furniture {
    constructor(fanciness) {
        super(ART_TYPE, ART * fanciness * Furniture.getFudgeFactor());
    }
}