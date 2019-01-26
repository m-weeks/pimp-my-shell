import Furniture, { LAMP } from "./Furniture";
import { LAMP_TYPE } from '../constants';

export default class Lamp extends Furniture {
    constructor(fanciness) {
        super(LAMP_TYPE, LAMP * fanciness * Furniture.getFudgeFactor());
    }
}