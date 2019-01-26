import Furniture, { BOOKSHELF } from "./Furniture";
import { BOOKSHELF_TYPE } from '../constants';

export default class Bookshelf extends Furniture {
    constructor(fanciness) {
        super(BOOKSHELF_TYPE, BOOKSHELF * fanciness * Furniture.getFudgeFactor());
    }
}