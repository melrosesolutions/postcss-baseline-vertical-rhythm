
const ascenderHeight = (fontSize, ascender, unitsPerEm) => ascender * fontSize / unitsPerEm;
const descenderHeight = (fontSize, descender, unitsPerEm) => descender * fontSize / unitsPerEm;
const lineGapHeight = (fontSize, lineGap, unitsPerEm) => lineGap * fontSize / unitsPerEm;
const halfLineGapHeight = (lineGapHeight) => lineGapHeight / 2;

const normalLineHeight = (lineGapHeight, ascenderHeight, descenderHeight) => lineGapHeight + ascenderHeight + descenderHeight;
const lineHeight = (normalLineHeight, verticalUnit, lineHeightFactor) => {
  let lfh = lineHeightFactor ? lineHeightFactor : Math.ceil(normalLineHeight / verticalUnit);
  return lfh * verticalUnit;
};

const leadHeight = (lineHeight, normalLineHeight) => lineHeight - normalLineHeight;
const halfLeadHeight = (leadHeight) => leadHeight / 2;

const paddingBottomHeight = (verticalUnit, descenderHeight, halfLineGapHeight, halfLeadHeight, borderBottomWidth, paddingBottomExtra) => {
  const offset = descenderHeight + halfLineGapHeight + halfLeadHeight + borderBottomWidth;
  const q = Math.ceil(offset / verticalUnit); // work out how many vertical units are needed at the bottom
  return ((q + paddingBottomExtra) * verticalUnit) - offset;
};

const paddingTopHeight = (verticalUnit, ascenderHeight, halfLineGapHeight, halfLeadHeight, borderTopWidth, paddingTopExtra) => {
  const offset = ascenderHeight + halfLineGapHeight + halfLeadHeight + borderTopWidth;
  const q = Math.ceil(offset / verticalUnit); // work out how many vertical units are needed at the top
  return ((q + paddingTopExtra) * verticalUnit) - offset;
};

const roundToPx = (n, pxPerUnit) => {
  // 1. calculate number in pixels
  let out = n * pxPerUnit;
  // 2. round to nearest pixel
  out = Math.round(out);
  // 3. convert back to unit
  out = out / pxPerUnit;
  return out;
};

module.exports.calculateVerticalRhythm = (
  fontSize,
  verticalUnit,
  fontConfig,
  lineHeightFactor,
  borderTop = 0,
  borderBottom = 0,
  paddingTopExtra = 0,
  paddingBottomExtra = 0,
  pixelsPerUnit
) => {
  let output = {
    fontSize,
    verticalUnit,
    fontConfig,
    lineHeightFactor,
    borderTop,
    borderBottom,
    paddingTopExtra,
    paddingBottomExtra,
    ascenderHeight: ascenderHeight(fontSize, fontConfig.ascender, fontConfig.unitsPerEm),
    descenderHeight: descenderHeight(fontSize, fontConfig.descender, fontConfig.unitsPerEm),
    lineGapHeight: lineGapHeight(fontSize, fontConfig.lineGap, fontConfig.unitsPerEm),
  };

  output.halfLineGapHeight = halfLineGapHeight(output.lineGapHeight);
  output.normalLineHeight = normalLineHeight(output.lineGapHeight, output.ascenderHeight, output.descenderHeight);
  output.lineHeight = lineHeight(output.normalLineHeight, verticalUnit, lineHeightFactor);
  output.leadHeight = leadHeight(output.lineHeight, output.normalLineHeight);
  output.halfLeadHeight = halfLeadHeight(output.leadHeight);

  output.paddingBottomHeight = paddingBottomHeight(
    verticalUnit,
    output.descenderHeight,
    output.halfLineGapHeight,
    output.halfLeadHeight,
    borderBottom,
    paddingBottomExtra
  );
  output.paddingTopHeight = paddingTopHeight(
    verticalUnit,
    output.ascenderHeight,
    output.halfLineGapHeight,
    output.halfLeadHeight,
    borderTop,
    paddingTopExtra
  );
  if (roundToPx) {
    output.paddingBottomRounded = roundToPx(output.paddingBottomHeight, pixelsPerUnit);
    output.paddingTopRounded = roundToPx(output.paddingTopHeight, pixelsPerUnit);
  }

  return output;
};
