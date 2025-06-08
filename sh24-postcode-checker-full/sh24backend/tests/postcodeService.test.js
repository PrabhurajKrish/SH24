const { isPostcodeServable } = require('../src/postcodeService');

test('allows known manual postcode', async () => {
  const res = await isPostcodeServable('SH24 1AA');
  expect(res.allowed).toBe(true);
});
