const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString(str)', () => {
    it('should reject non-string values', () => {
        let str = 8;
        let valid = isRealString(str);
        expect(valid).toBe(false);
    });
    it('should reject strings with only spaces', () => {
        let str = "   ";
        let valid = isRealString(str);
        expect(valid).toBe(false);
    });
    it('should allow strings with non-space characters', () => {
        let str = "Gimli, son of Gloin";
        let valid = isRealString(str);
        expect(valid).toBe(true);
    });
})