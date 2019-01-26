import Furniture, { RUG } from "./Furniture";
import { RUG_TYPE } from '../constants';

export default class Rug extends Furniture {
    constructor(fanciness) {
        super(RUG_TYPE, RUG * fanciness * Furniture.getFudgeFactor());
    }
}