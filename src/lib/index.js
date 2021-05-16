const parseCssDimension = require('parse-css-dimension');
const {calculateVerticalRhythm} = require('./calc');
const commonFonts = require('./fonts');

module.exports = (options = {}) => {
  const unit = options.unit || 'rem';
  const verticalUnit = options.verticalUnit || 1;
  const debug = options.debug || false;
  const precision = options.precision || 2;
  const pxPerUnit = options.pxPerUnit;
  const fonts = (options.fonts || []).concat(commonFonts);

  const formatPrecision = n => Number(n.toFixed(precision));

  return {
    postcssPlugin: 'postcss-baseline-vertical-rhythm',
    AtRule: {
      'baseline-vertical-rhythm': rule => {
        // All @baseline-vertical-rhythm at-rules
        let fontName;
        let fontConfig;
        let fontSize;
        let lineHeightFactor;
        let borderTopWidth = 0;
        let borderBottomWidth = 0;
        let paddingTopExtra = 0;
        let paddingBottomExtra = 0;
        let roundToPx = options.roundToPx || false;
        
        // parse params
        rule.walkDecls('font-name', decl => {
          fontName = decl.value;
          fontConfig = fonts.find(f => f.fontName === fontName);
        });
        if (!fontConfig) {
          throw rule.error(
            `Font Config not found for "${fontName}". Configured fonts are ${fonts.map(f => f.fontName).join(', ')}`,
            { word: fontName }
          );
        }
        rule.walkDecls('font-size', decl => {
          fontSize = parseCssDimension(decl.value).value;
        });
        if (!fontSize) {
          throw rule.error('font-size not found. You must set a font-size parameter.');
        }
        rule.walkDecls('line-height-factor', decl => {
          lineHeightFactor = parseCssDimension(decl.value).value;
        });
        rule.walkDecls('border-top-width', decl => {
          borderTopWidth = parseCssDimension(decl.value).value;
        });
        rule.walkDecls('border-bottom-width', decl => {
          borderBottomWidth = parseCssDimension(decl.value).value;
        });
        rule.walkDecls('padding-top-extra', decl => {
          paddingTopExtra = parseCssDimension(decl.value).value;
        });
        rule.walkDecls('padding-bottom-extra', decl => {
          paddingBottomExtra = parseCssDimension(decl.value).value;
        });
        rule.walkDecls('round-to-px', () => {
          roundToPx = true;
        });
        if (roundToPx && !pxPerUnit) {
          throw rule.error('pxPerUnit must be set if using roundToPx.');
        }
  
        const output = calculateVerticalRhythm(
          fontSize,
          verticalUnit,
          fontConfig,
          lineHeightFactor,
          borderTopWidth,
          borderBottomWidth,
          paddingTopExtra,
          paddingBottomExtra,
          pxPerUnit
        );
        
        // debug code
        if (debug) {
          rule.parent.insertBefore(rule, {
            text: 'baseline-vertical-rhythm debug: ' + JSON.stringify(output, null, 2) + '\n'
          });
        }
  
        // output new rules
        rule.replaceWith({
          prop: 'font-size',
          value: formatPrecision(fontSize)  + unit
        }, {
          prop: 'line-height',
          value: formatPrecision(output.lineHeight) + unit
        }, {
          prop: 'padding-top',
          value: formatPrecision(roundToPx ? output.paddingTopRounded : output.paddingTopHeight) + unit
        }, {
          prop: 'padding-bottom',
          value: formatPrecision(roundToPx ? output.paddingBottomRounded : output.paddingBottomHeight) + unit
        });
      }
    }
  };
};
module.exports.postcss = true;
