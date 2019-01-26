import Furniture, { TV } from "./Furniture";
import { TV_TYPE } from '../constants';

export default class Tv extends Furniture {
    constructor(fanciness) {
        super(TV_TYPE, TV * fanciness * Furniture.getFudgeFactor());
    }
}