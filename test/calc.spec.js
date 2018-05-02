
const {calculateVerticalRhythm} = require('../src/lib/calc');

describe('calculateVerticalRhythm() function', () => {
  // this font will have a normalLineHeight of 1.15 * font-size
  const fontConfig = {
    fontName: 'Arial',
    unitsPerEm: 2048,
    lineGap: 67,
    ascender: 1854,
    descender: 434
  };

  describe('font-size', () => {
    it('should match font-size passed in', () => {
      const result = calculateVerticalRhythm(2.6, 1.5, fontConfig);
      expect(result.fontSize).toEqual(2.6);
    });
  });

  describe('line-height', () => {
    it('will match vertical unit when font-size is smaller than vertical unit', () => {
      const result = calculateVerticalRhythm(1, 1.5, fontConfig);
      expect(result.lineHeight).toEqual(1.5);
    });
    
    it('will be twice vertical unit when font-size is bigger than vertical unit', () => {
      const result = calculateVerticalRhythm(2, 1.5, fontConfig);  
      expect(result.lineHeight).toEqual(3);
    });
    
    it('will use the line-height-factor override if passed', () => {
      const result = calculateVerticalRhythm(2, 1.5, fontConfig, 4);  
      expect(result.lineHeight).toEqual(6); // (4 * 1.5 = 6)
    });
    
    it('will take into account normalLineHieght is 1.15 * font-size', () => {
      const result = calculateVerticalRhythm(0.95, 1, fontConfig);  
      expect(result.lineHeight).toEqual(2);
    });
  });

  describe('padding-top', () => {
    it('should calculate padding-top when no borderTop or paddingTopExtra', () => {
      const result = calculateVerticalRhythm(2, 1.5, fontConfig);
      expect(result.paddingTopHeight.toFixed(4)).toEqual('0.8066'); // base answer
    });
    
    it('should calculate padding-top when borderTop is added', () => {
      const result = calculateVerticalRhythm(2, 1.5, fontConfig, null, 0.3); // base answer minus 0.3 border
      expect(result.paddingTopHeight.toFixed(4)).toEqual('0.5066');
    });
    
    it('should calculate padding-top when large borderTop is added', () => {
      const result = calculateVerticalRhythm(2, 1.5, fontConfig, null, 1.6);
      expect(result.paddingTopHeight.toFixed(4)).toEqual('0.7066'); // base answer minus (1.6 - 1.5)
    });
    
    it('should calculate padding-top when paddingTopExtra is added', () => {
      const result = calculateVerticalRhythm(2, 1.5, fontConfig, null, 0, 0, 2);
      expect(result.paddingTopHeight.toFixed(4)).toEqual('3.8066'); // base answer plus (2 * vertical unit)
    });
  });

  describe('padding-bottom', () => {
    it('should calculate padding-bottom when no borderBottom or paddingBottomExtra', () => {
      const result = calculateVerticalRhythm(2, 1.5, fontConfig);
      expect(result.paddingBottomHeight.toFixed(4)).toEqual('0.6934'); // base answer
    });
    
    it('should calculate padding-bottom when borderBottom is added', () => {
      const result = calculateVerticalRhythm(2, 1.5, fontConfig, null, 0, 0.3);
      expect(result.paddingBottomHeight.toFixed(4)).toEqual('0.3934'); // base answer minus 0.3 border
    });
    
    it('should calculate padding-bottom when large borderBottom is added', () => {
      const result = calculateVerticalRhythm(2, 1.5, fontConfig, null, 0, 1.6);
      expect(result.paddingBottomHeight.toFixed(4)).toEqual('0.5934'); // base answer minus (1.6 - 1.5)
    });
    
    it('should calculate padding-bottom when paddingBottomExtra is added', () => {
      const result = calculateVerticalRhythm(2, 1.5, fontConfig, null, 0, 0, 0, 2);
      expect(result.paddingBottomHeight.toFixed(4)).toEqual('3.6934'); // base answer plus (2 * vertical unit)
    });
  });

  // TODO: test px rounding
});
