const fs = require('fs');
const postcss = require('postcss');
const plugin = require('../src');

const test = (name, opts) => {
  const input = read(name);
  const output = read(name + '.out');
  const processedCSS = postcss(plugin(opts)).process(input).css;
  expect(processedCSS).toEqual(output);
};

const read = name => fs.readFileSync('./test/fixtures/' + name + '.css', 'utf-8');

describe('postcss-baseline-vertical-rhythm', () => {
  let opts;

  beforeEach(() => {
    opts = {};
  });

  it('should process a simple example', () => {
    test('simple', opts);
  });

  it('should throw an error if missing font metrics', () => {
    const input = read('font-name-error');
    expect(() => {
      postcss(plugin(opts)).process(input).css;
    }).toThrowError(/Font Config not found/);
  });

  it('should throw an error if missing font-size', () => {
    const input = read('font-size-error');
    expect(() => {
      postcss(plugin(opts)).process(input).css;
    }).toThrowError(/font-size not found/);
  });

  it('should process a complicated example with additional padding and borders', () => {
    test('complex', opts);
  });

  it('should process custom line-height factor', () => {
    test('line-height', opts);
  });

  it('should process px unit', () => {
    opts.unit = 'px';
    opts.verticalUnit = 17;
    test('unit', opts);
  });

  it('should process custom font metrics', () => {
    opts.fonts = [{
      fontName: 'Roboto',
      unitsPerEm: 2048,
      lineGap: 0,
      ascender: 1946,
      descender: 512
    }];
    test('fonts', opts);
  });

  it('should process custom precision', () => {
    opts.precision = 6;
    test('precision', opts);
  });

  it('should output debug metrics as comments', () => {
    opts.debug = true;
    const input = read('debug');
    expect(postcss(plugin(opts)).process(input).css)
      .toMatch('baseline-vertical-rhythm debug');
  });

  // TODO: test px rounding
});
