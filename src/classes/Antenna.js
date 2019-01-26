import Furniture, { ANTENNA } from "./Furniture";
import { ANTENNA_TYPE } from '../constants';

export default class Antenna extends Furniture {
    constructor(fanciness) {
        super(ANTENNA_TYPE, ANTENNA * fanciness * Furniture.getFudgeFactor());
    }
}