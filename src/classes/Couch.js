import Furniture, { COUCH } from "./Furniture";
import { COUCH_TYPE } from '../constants';

export default class Couch extends Furniture {
    constructor(fanciness) {
        super(COUCH_TYPE, COUCH * fanciness * Furniture.getFudgeFactor());
    }
}