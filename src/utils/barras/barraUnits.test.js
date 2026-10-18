import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SIXTEENTH,
  parseMeasure,
  formatMeasure,
  formatForInput,
  toUnits,
  fromUnits,
  percentOf,
  normalizePrecision,
  precisionsFor,
} from './barraUnits.js';

const inch = (text) => {
  const r = parseMeasure(text, 'in');
  assert.ok(r.ok, `debería interpretarse: ${text} -> ${r.error}`);
  return r.units;
};

test('1/16" es exactamente 15875 unidades y 1" son 16/16', () => {
  assert.equal(SIXTEENTH, 15875);
  assert.equal(inch('1/16'), 15875);
  assert.equal(inch('1'), 16 * 15875);
});

test('interpreta enteros, decimales, fracciones y mixtas', () => {
  assert.equal(inch('60'), 60 * 16 * SIXTEENTH);
  assert.equal(inch('60 1/4'), (60 * 16 + 4) * SIXTEENTH);
  assert.equal(inch('60-1/4'), inch('60 1/4'));
  assert.equal(inch('60 1/4"'), inch('60 1/4'));
  assert.equal(inch('37 1/8'), (37 * 16 + 2) * SIXTEENTH);
  assert.equal(inch('3/4'), 12 * SIXTEENTH);
  assert.equal(inch('0.5'), 8 * SIXTEENTH);
  assert.equal(inch('12,25'), 12 * 16 * SIXTEENTH + 4 * SIXTEENTH); // coma decimal
  assert.equal(inch('5/4'), 20 * SIXTEENTH);
});

test('pies, pulgadas, cm y m con sufijo de unidad', () => {
  assert.equal(inch('5\''), 60 * 16 * SIXTEENTH);
  assert.equal(inch('5\' 3 1/2"'), (63 * 16 + 8) * SIXTEENTH);
  assert.equal(parseMeasure('2.54 cm', 'in').units, 254000 / 1 * 1);
  assert.equal(parseMeasure('1 m', 'in').units, 10000000);
  assert.equal(parseMeasure('1 m 20 cm', 'in').units, 10000000 + 20 * 100000);
  assert.equal(parseMeasure('12.5', 'cm').units, 1250000);
  assert.equal(parseMeasure('2', 'ft').units, 2 * 3048000);
});

test('252" equivale exactamente a 640.08 cm y 6.4008 m', () => {
  const u = inch('252');
  assert.equal(u, 64008000);
  assert.equal(fromUnits(u, 'cm'), 640.08);
  assert.equal(fromUnits(u, 'm'), 6.4008);
  assert.equal(toUnits(640.08, 'cm'), u);
});

test('rechaza medidas inválidas con mensajes en español', () => {
  for (const bad of ['', '   ', 'abc', '1/0', '60 1/0', '1 1/2 3', '12 xyz', '1.2.3', '--5']) {
    const r = parseMeasure(bad, 'in');
    assert.equal(r.ok, false, `debería fallar: "${bad}"`);
    assert.ok(typeof r.error === 'string' && r.error.length > 5);
  }
  assert.match(parseMeasure('-5', 'in').error, /negativa/);
  assert.match(parseMeasure('1/0', 'in').error, /denominador/);
  assert.match(parseMeasure('5 3', 'in').error, /unidad/);
  assert.match(parseMeasure('99999999999999 m', 'in').error, /grande/);
});

test('formatea fracciones legibles en pulgadas', () => {
  const f = (u, p) => formatMeasure(u, 'in', p);
  assert.equal(f(inch('60 1/4'), 'f16'), '60 1/4"');
  assert.equal(f(inch('37 1/8'), 'f16'), '37 1/8"');
  assert.equal(f(inch('20'), 'f16'), '20"');
  assert.equal(f(inch('1/16'), 'f16'), '1/16"');
  assert.equal(f(inch('0'), 'f16'), '0"');
  assert.equal(f(inch('3/16'), 'f16'), '3/16"');
  assert.equal(f(inch('60 3/16'), 'f8'), '60 1/4"'); // redondeo solo de presentación
  assert.equal(f(inch('60 3/8'), 'f1'), '60"');
});

test('formatea pies-pulgadas, cm y m', () => {
  assert.equal(formatMeasure(inch('63 1/2'), 'ft', 'f16'), `5' 3 1/2"`);
  assert.equal(formatMeasure(inch('60'), 'ft', 'f16'), `5'`);
  assert.equal(formatMeasure(inch('5 1/4'), 'ft', 'f16'), `5 1/4"`);
  assert.equal(formatMeasure(64008000, 'cm', 'mm1'), '640.1 cm');
  assert.equal(formatMeasure(64008000, 'cm', 'mm01'), '640.08 cm');
  assert.equal(formatMeasure(64008000, 'm', 'mm1'), '6.401 m');
  assert.equal(formatMeasure(64008000, 'm', 'mm01'), '6.4008 m');
  assert.equal(formatMeasure(inch('1'), 'cm', 'mm1', { withUnit: false }), '2.5');
});

test('ida y vuelta sin pérdida para múltiplos de 1/16"', () => {
  for (let i = 1; i <= 4000; i += 7) {
    const u = i * SIXTEENTH;
    const text = formatForInput(u, 'in');
    assert.equal(parseMeasure(text, 'in').units, u, text);
    assert.equal(parseMeasure(formatMeasure(u, 'in', 'f16'), 'in').units, u);
  }
});

test('cambiar de unidad no altera el valor guardado', () => {
  const u = inch('60 1/4');
  const asCm = formatForInput(u, 'cm');
  assert.equal(asCm, '153.035');
  // El valor interno permanece idéntico; solo cambia la presentación.
  assert.equal(formatMeasure(u, 'in', 'f16'), '60 1/4"');
});

test('percentOf nunca sale del rango 0-100', () => {
  assert.equal(percentOf(50, 100), 50);
  assert.equal(percentOf(0, 100), 0);
  assert.equal(percentOf(5, 0), 0);
  assert.equal(percentOf(150, 100), 100);
  assert.equal(percentOf(1, 3), 33.3);
});

test('precisiones válidas según la unidad', () => {
  assert.equal(normalizePrecision('cm', 'f16'), 'mm1');
  assert.equal(normalizePrecision('in', 'f8'), 'f8');
  assert.equal(normalizePrecision('in', 'zzz'), 'f16');
  assert.ok(precisionsFor('m').length >= 2);
});
