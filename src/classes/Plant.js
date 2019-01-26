import Furniture, { PLANT } from "./Furniture";
import { PLANT_TYPE } from '../constants';

export default class Plant extends Furniture {
    constructor(fanciness) {
        super(PLANT_TYPE, PLANT * fanciness * Furniture.getFudgeFactor());
    }
}