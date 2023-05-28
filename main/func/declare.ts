/**
* @param {Number} value
* @param {{long: boolean}} options
* @return {String}
*/
declare function ms(value: number, options?: { long: boolean }): string;
/**
* @param {String} value
* @return {Number}
*/
declare function ms(value: string): number;
export = ms;