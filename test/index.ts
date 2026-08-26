/* eslint-env node, mocha */

import assert from 'node:assert';
import Color, {type ColorLike} from '../index.js';


it('Color() instance', () => {
	assert.equal(new Color('red').red(), 255);
	assert.ok((new Color()) instanceof Color);
	const c = Color();
	assert.notStrictEqual(c.rgb(), c.rgb());
});

it('Color() instance (null)', () => {
	assert.ok((new Color(null as unknown as ColorLike)) instanceof Color);
});

it('Color() instance (undefined)', () => {
	assert.ok((new Color(undefined)) instanceof Color);
});

it('Immutability', () => {
	const c = Color(0xFF0000);
	assert.ok(c !== c.rgb());
	assert.ok(c != c.rgb()); // eslint-disable-line eqeqeq
});

it('Colors to JSON', () => {
	assert.deepEqual(Color('#0A1E19').rgb().toJSON(), {
		color: [10, 30, 25],
		model: 'rgb',
		valpha: 1,
	});
	assert.deepEqual(Color('rgb(10, 30, 25)').rgb().toJSON(), {
		color: [10, 30, 25],
		model: 'rgb',
		valpha: 1,
	});
	assert.deepEqual(Color('rgba(10, 30, 25, 0.4)').rgb().toJSON(), {
		color: [10, 30, 25],
		model: 'rgb',
		valpha: 0.4,
	});
	assert.deepEqual(Color('rgb(4%, 12%, 10%)').rgb().toJSON(), {
		color: [10, 31, 26],
		model: 'rgb',
		valpha: 1,
	});
	assert.deepEqual(Color('rgba(4%, 12%, 10%, 0.4)').rgb().toJSON(), {
		color: [10, 31, 26],
		model: 'rgb',
		valpha: 0.4,
	});
	assert.deepEqual(Color('blue').rgb().toJSON(), {
		color: [0, 0, 255],
		model: 'rgb',
		valpha: 1,
	});
	assert.deepEqual(Color('hsl(120, 50%, 60%)').hsl().toJSON(), {
		color: [120, 50, 60],
		model: 'hsl',
		valpha: 1,
	});
	assert.deepEqual(Color('hsla(120, 50%, 60%, 0.4)').hsl().toJSON(), {
		color: [120, 50, 60],
		model: 'hsl',
		valpha: 0.4,
	});
	assert.deepEqual(Color('hwb(120, 50%, 60%)').hwb().toJSON(), {
		color: [120, 50, 60],
		model: 'hwb',
		valpha: 1,
	});
	assert.deepEqual(Color('hwb(120, 50%, 60%, 0.4)').hwb().toJSON(), {
		color: [120, 50, 60],
		model: 'hwb',
		valpha: 0.4,
	});

	assert.deepEqual(Color({
		r: 10,
		g: 30,
		b: 25,
	}).rgb().toJSON(), {
		color: [10, 30, 25],
		model: 'rgb',
		valpha: 1,
	});
	assert.deepEqual(Color({
		h: 10,
		s: 30,
		l: 25,
	}).hsl().toJSON(), {
		color: [10, 30, 25],
		model: 'hsl',
		valpha: 1,
	});
	assert.deepEqual(Color({
		h: 10,
		s: 30,
		v: 25,
	}).hsv().toJSON(), {
		color: [10, 30, 25],
		model: 'hsv',
		valpha: 1,
	});
	assert.deepEqual(Color({
		h: 10,
		w: 30,
		b: 25,
	}).hwb().toJSON(), {
		color: [10, 30, 25],
		model: 'hwb',
		valpha: 1,
	});
	assert.deepEqual(Color({
		c: 10,
		m: 30,
		y: 25,
		k: 10,
	}).cmyk().toJSON(), {
		color: [10, 30, 25, 10],
		model: 'cmyk',
		valpha: 1,
	});
});

it('Color() argument', () => {
	assert.deepEqual(Color('#0A1E19').rgb().object(), {
		r: 10,
		g: 30,
		b: 25,
	});
	assert.deepEqual(Color('rgb(10, 30, 25)').rgb().object(), {
		r: 10,
		g: 30,
		b: 25,
	});
	assert.deepEqual(Color('rgba(10, 30, 25, 0.4)').rgb().object(), {
		r: 10,
		g: 30,
		b: 25,
		alpha: 0.4,
	});
	assert.deepEqual(Color('rgb(4%, 12%, 10%)').rgb().object(), {
		r: 10,
		g: 31,
		b: 26,
	});
	assert.deepEqual(Color('rgba(4%, 12%, 10%, 0.4)').rgb().object(), {
		r: 10,
		g: 31,
		b: 26,
		alpha: 0.4,
	});
	assert.deepEqual(Color('blue').rgb().object(), {
		r: 0,
		g: 0,
		b: 255,
	});
	assert.deepEqual(Color('hsl(120, 50%, 60%)').hsl().object(), {
		h: 120,
		s: 50,
		l: 60,
	});
	assert.deepEqual(Color('hsla(120, 50%, 60%, 0.4)').hsl().object(), {
		h: 120,
		s: 50,
		l: 60,
		alpha: 0.4,
	});
	assert.deepEqual(Color('hwb(120, 50%, 60%)').hwb().object(), {
		h: 120,
		w: 50,
		b: 60,
	});
	assert.deepEqual(Color('hwb(120, 50%, 60%, 0.4)').hwb().object(), {
		h: 120,
		w: 50,
		b: 60,
		alpha: 0.4,
	});

	assert.deepEqual(Color({
		r: 10,
		g: 30,
		b: 25,
	}).rgb().object(), {
		r: 10,
		g: 30,
		b: 25,
	});
	assert.deepEqual(Color({
		h: 10,
		s: 30,
		l: 25,
	}).hsl().object(), {
		h: 10,
		s: 30,
		l: 25,
	});
	assert.deepEqual(Color({
		h: 10,
		s: 30,
		v: 25,
	}).hsv().object(), {
		h: 10,
		s: 30,
		v: 25,
	});
	assert.deepEqual(Color({
		h: 10,
		w: 30,
		b: 25,
	}).hwb().object(), {
		h: 10,
		w: 30,
		b: 25,
	});
	assert.deepEqual(Color({
		c: 10,
		m: 30,
		y: 25,
		k: 10,
	}).cmyk().object(), {
		c: 10,
		m: 30,
		y: 25,
		k: 10,
	});
});

it('Setters', () => {
	assert.deepEqual(Color.rgb(10, 30, 25).rgb().object(), {
		r: 10,
		g: 30,
		b: 25,
	});
	assert.deepEqual(Color.rgb(10, 30, 25, 0.4).rgb().object(), {
		r: 10,
		g: 30,
		b: 25,
		alpha: 0.4,
	});
	assert.deepEqual(Color.rgb([10, 30, 25]).rgb().object(), {
		r: 10,
		g: 30,
		b: 25,
	});
	assert.deepEqual(Color.rgb([10, 30, 25, 0.4]).rgb().object(), {
		r: 10,
		g: 30,
		b: 25,
		alpha: 0.4,
	});
	assert.deepEqual(Color.rgb({
		r: 10,
		g: 30,
		b: 25,
	}).rgb().object(), {
		r: 10,
		g: 30,
		b: 25,
	});
	assert.deepEqual(Color.rgb({
		r: 10,
		g: 30,
		b: 25,
		alpha: 0.4,
	}).rgb().object(), {
		r: 10,
		g: 30,
		b: 25,
		alpha: 0.4,
	});

	assert.deepEqual(Color.hsl([260, 10, 10]).hsl().object(), {
		h: 260,
		s: 10,
		l: 10,
	});
	assert.deepEqual(Color.hsv([260, 10, 10]).hsv().object(), {
		h: 260,
		s: 10,
		v: 10,
	});
	assert.deepEqual(Color.hwb([260, 10, 10]).hwb().object(), {
		h: 260,
		w: 10,
		b: 10,
	});
	assert.deepEqual(Color.cmyk([10, 10, 10, 10]).cmyk().object(), {
		c: 10,
		m: 10,
		y: 10,
		k: 10,
	});
});

it('Retain Alpha', () => {
	assert.equal(Color.rgb(1, 2, 3, 0.4).ansi256().rgb().alpha(), 0.4);
});

it('Translations', () => {
	assert.deepEqual(Color.rgb(10, 30, 25).rgb().round().object(), {
		r: 10,
		g: 30,
		b: 25,
	});
	assert.deepEqual(Color.rgb(10, 30, 25).hsl().round().object(), {
		h: 165,
		s: 50,
		l: 8,
	});
	assert.deepEqual(Color.rgb(10, 30, 25).hsv().round().object(), {
		h: 165,
		s: 67,
		v: 12,
	});
	assert.deepEqual(Color.rgb(10, 30, 25).hwb().round().object(), {
		h: 165,
		w: 4,
		b: 88,
	});
	assert.deepEqual(Color.rgb(10, 30, 25).cmyk().round().object(), {
		c: 67,
		m: 0,
		y: 17,
		k: 88,
	});
});

it('Array getters', () => {
	assert.deepEqual(Color({
		r: 10,
		g: 20,
		b: 30,
	}).rgb().array(), [10, 20, 30]);
	assert.deepEqual(Color({
		r: 10,
		g: 20,
		b: 30,
	}).unitArray(), [10 / 255, 20 / 255, 30 / 255]);
	assert.deepEqual(Color({
		r: 10,
		g: 20,
		b: 30,
		alpha: 0.5,
	}).unitArray(), [10 / 255, 20 / 255, 30 / 255, 0.5]);
	assert.deepEqual(Color({
		h: 10,
		s: 20,
		l: 30,
	}).hsl().array(), [10, 20, 30]);
	assert.deepEqual(Color({
		h: 10,
		s: 20,
		v: 30,
	}).hsv().array(), [10, 20, 30]);
	assert.deepEqual(Color({
		h: 10,
		w: 20,
		b: 30,
	}).hwb().array(), [10, 20, 30]);
	assert.deepEqual(Color({
		c: 10,
		m: 20,
		y: 30,
		k: 40,
	}).cmyk().array(), [10, 20, 30, 40]);
});

it('Multiple times', () => {
	const color = Color({
		r: 10,
		g: 20,
		b: 30,
	});
	assert.deepEqual(color.rgb().array(), [10, 20, 30]);
	assert.deepEqual(color.rgb().array(), [10, 20, 30]);
});

it('Channel getters/setters', () => {
	assert.equal(Color({
		r: 10,
		g: 20,
		b: 30,
		alpha: 0.4,
	}).alpha(), 0.4);
	assert.equal(Color({
		r: 10,
		g: 20,
		b: 30,
		alpha: 0.4,
	}).alpha(0.7).alpha(), 0.7);
	assert.equal(Color({
		r: 10,
		g: 20,
		b: 30,
	}).red(), 10);
	assert.equal(Color({
		r: 10,
		g: 20,
		b: 30,
	}).red(100).red(), 100);
	assert.equal(Color({
		r: 10,
		g: 20,
		b: 30,
	}).green(), 20);
	assert.equal(Color({
		r: 10,
		g: 20,
		b: 30,
	}).green(200).green(), 200);
	assert.equal(Color({
		r: 10,
		g: 20,
		b: 30,
	}).blue(), 30);
	assert.equal(Color({
		r: 10,
		g: 20,
		b: 30,
	}).blue(60).blue(), 60);
	assert.equal(Color({
		h: 10,
		s: 20,
		l: 30,
	}).hue(), 10);
	assert.equal(Color({
		h: 10,
		s: 20,
		l: 30,
	}).hue(100).hue(), 100);
	assert.equal(Color({
		h: 10,
		w: 20,
		b: 30,
	}).hue(), 10);
	assert.equal(Color({
		h: 10,
		w: 20,
		b: 30,
	}).hue(100).hue(), 100);
	assert.equal(Color({
		h: 10,
		s: 20,
		l: 30,
	}).hue(), 10);
	assert.equal(Color({
		h: 10,
		s: 20,
		l: 30,
	}).hue(460).hue(), 100);
	assert.equal(Color({
		h: 10,
		w: 20,
		b: 30,
	}).hue(), 10);
	assert.equal(Color({
		h: 10,
		w: 20,
		b: 30,
	}).hue(-260).hue(), 100);
});

it('Setting the same value', () => {
	const colorString = '#BADA55';
	const color = Color(colorString);
	const alpha = color.alpha();
	const red = color.red();
	const green = color.green();
	const blue = color.blue();
	const hue = color.hue();
	const saturation = color.saturationl();
	const saturationv = color.saturationv();
	const lightness = color.lightness();
	const whiteness = color.white();
	const blackness = color.wblack();
	const cyan = color.cyan();
	const magenta = color.magenta();
	const yellow = color.yellow();
	const black = color.black();

	assert.equal(color.hex(), colorString);

	color.alpha(alpha);
	assert.equal(color.alpha(), alpha);
	assert.equal(color.hex(), colorString);

	color.red(red);
	assert.equal(color.red(), red);
	assert.equal(color.hex(), colorString);

	color.green(green);
	assert.equal(color.green(), green);
	assert.equal(color.hex(), colorString);

	color.blue(blue);
	assert.equal(color.blue(), blue);
	assert.equal(color.hex(), colorString);

	color.hue(hue);
	assert.equal(color.hue(), hue);
	assert.equal(color.hex(), colorString);

	color.saturationl(saturation);
	assert.equal(color.saturationl(), saturation);
	assert.equal(color.hex(), colorString);

	color.saturationv(saturationv);
	assert.equal(color.saturationv(), saturationv);
	assert.equal(color.hex(), colorString);

	color.lightness(lightness);
	assert.equal(color.lightness(), lightness);
	assert.equal(color.hex(), colorString);

	color.white(whiteness);
	assert.equal(color.white(), whiteness);
	assert.equal(color.hex(), colorString);

	color.wblack(blackness);
	assert.equal(color.wblack(), blackness);
	assert.equal(color.hex(), colorString);

	color.cyan(cyan);
	assert.equal(color.cyan(), cyan);
	assert.equal(color.hex(), colorString);

	color.magenta(magenta);
	assert.equal(color.magenta(), magenta);
	assert.equal(color.hex(), colorString);

	color.yellow(yellow);
	assert.equal(color.yellow(), yellow);
	assert.equal(color.hex(), colorString);

	color.black(black);
	assert.equal(color.black(), black);
	assert.equal(color.hex(), colorString);
});

it('Capping values', () => {
	assert.equal(Color({
		h: 400,
		s: 50,
		l: 10,
	}).hue(), 40);
	assert.equal(Color({
		h: 100,
		s: 50,
		l: 80,
	}).lighten(0.5).lightness(), 100);
	assert.equal(Color({
		h: -400,
		s: 50,
		l: 10,
	}).hue(), 320);

	// 0 == 360
	assert.equal(Color({
		h: 400,
		w: 50,
		b: 10,
	}).hue(), 40);
	assert.equal(Color({
		h: 100,
		w: 50,
		b: 80,
	}).blacken(0.5).wblack(), 100);
	assert.equal(Color({
		h: -400,
		w: 50,
		b: 10,
	}).hue(), 320);

	assert.equal(Color().red(400).red(), 255);
	assert.equal(Color().red(-400).red(), 0);
	assert.equal(Color.rgb(10, 10, 10, 12).alpha(), 1);
	assert.equal(Color.rgb(10, 10, 10, -200).alpha(), 0);
	assert.equal(Color().alpha(-12).alpha(), 0);
	assert.equal(Color().alpha(3).alpha(), 1);
});

it('Translate with channel setters', () => {
	assert.deepEqual(Color({
		r: 0,
		g: 0,
		b: 0,
	}).lightness(50).hsl().object(), {
		h: 0,
		s: 0,
		l: 50,
	});
	assert.deepEqual(Color({
		r: 0,
		g: 0,
		b: 0,
	}).red(50).green(50).hsv().round().object(), {
		h: 60,
		s: 100,
		v: 20,
	});
});

it('CSS String getters', () => {
	assert.equal(Color('rgb(10, 30, 25)').hex(), '#0A1E19');
	assert.equal(Color('rgb(10, 30, 25, .5)').hex(), '#0A1E19');
	assert.equal(Color('rgb(10, 30, 25, 1)').hexa(), '#0A1E19FF');
	assert.equal(Color('rgb(10, 30, 25, 0.4)').hexa(), '#0A1E1966');
	assert.equal(Color('rgb(10, 30, 25, 0)').hexa(), '#0A1E1900');
	assert.equal(Color('rgb(10, 30, 25, 0.01)').hexa(), '#0A1E1903');
	assert.equal(Color('rgb(10, 30, 25)').rgb().string(), 'rgb(10, 30, 25)');
	assert.equal(Color('rgb(10, 30, 25, 0.4)').rgb().string(), 'rgba(10, 30, 25, 0.4)');
	assert.equal(Color('rgb(10, 30, 25)').percentString(), 'rgb(4%, 12%, 10%)');
	assert.equal(Color('rgb(10, 30, 25, 0.3)').percentString(), 'rgba(4%, 12%, 10%, 0.3)');
	assert.equal(Color('rgb(10, 30, 25)').hsl().string(), 'hsl(165, 50%, 7.8%)');
	assert.equal(Color('rgb(10, 30, 25, 0.3)').hsl().string(), 'hsla(165, 50%, 7.8%, 0.3)');
	assert.equal(Color({
		h: 0,
		s: 0,
		v: 100,
	}).hsl().string(), 'hsl(0, 0%, 100%)');
	assert.equal(Color('rgb(10, 30, 25)').hwb().string(0), 'hwb(165, 4%, 88%)');
	assert.equal(Color('rgb(10, 30, 25, 0.3)').hwb().string(0), 'hwb(165, 4%, 88%, 0.3)');
	assert.equal(Color('rgb(0, 0, 255)').keyword(), 'blue');
	assert.equal(Color.rgb(155.5, 243.1555, 88.1999).string(), 'rgb(156, 243, 88)');
});

it('Number getters', () => {
	assert.equal(Color('rgb(10, 30, 25)').rgbNumber(), 0xA_1E_19);
});

it('luminosity, etc.', () => {
	assert.equal(Color('white').luminosity(), 1);
	assert.equal(Color('black').luminosity(), 0);
	assert.equal(Color('red').luminosity(), 0.2126);
	assert.equal(Color('white').contrast(Color('black')), 21);
	assert.equal(Math.round(Color('white').contrast(Color('red'))), 4);
	assert.equal(Math.round(Color('red').contrast(Color('white'))), 4);
	assert.equal(Color('blue').contrast(Color('blue')), 1);
	assert.ok(Color('black').isDark());
	assert.ok(!Color('black').isLight());
	assert.ok(Color('white').isLight());
	assert.ok(!Color('white').isDark());
	assert.ok(Color('blue').isDark());
	assert.ok(Color('darkgreen').isDark());
	assert.ok(Color('pink').isLight());
	assert.ok(Color('goldenrod').isLight());
	assert.ok(Color('red').isDark());
});

it('Manipulators wo/ mix', () => {
	assert.deepEqual(Color({
		r: 67,
		g: 122,
		b: 134,
	}).grayscale().rgb().round().object(), {
		r: 107,
		g: 107,
		b: 107,
	});
	assert.deepEqual(Color({
		r: 67,
		g: 122,
		b: 134,
	}).negate().rgb().round().object(), {
		r: 188,
		g: 133,
		b: 121,
	});
	assert.equal(Color({
		h: 100,
		s: 50,
		l: 60,
	}).lighten(0.5).lightness(), 90);
	assert.equal(Color({
		h: 100,
		s: 50,
		l: 60,
	}).darken(0.5).lightness(), 30);
	assert.equal(Color({
		h: 100,
		w: 50,
		b: 60,
	}).whiten(0.5).white(), 75);
	assert.equal(Color({
		h: 100,
		w: 50,
		b: 60,
	}).blacken(0.5).wblack(), 90);
	assert.equal(Color({
		h: 100,
		s: 40,
		l: 50,
	}).saturate(0.5).saturationl(), 60);
	assert.equal(Color({
		h: 100,
		s: 80,
		l: 60,
	}).desaturate(0.5).saturationl(), 40);
	assert.equal(Color({
		r: 10,
		g: 10,
		b: 10,
		alpha: 0.8,
	}).fade(0.5).alpha(), 0.4);
	assert.equal(Color({
		r: 10,
		g: 10,
		b: 10,
		alpha: 0.5,
	}).opaquer(0.5).alpha(), 0.75);
	assert.equal(Color({
		h: 60,
		s: 0,
		l: 0,
	}).rotate(180).hue(), 240);
	assert.equal(Color({
		h: 60,
		s: 0,
		l: 0,
	}).rotate(-180).hue(), 240);
});

it('Mix: basic', () => {
	assert.equal(Color('#f00').mix(Color('#00f')).hex(), '#800080');
});

it('Mix: weight', () => {
	assert.equal(Color('#f00').mix(Color('#00f'), 0.25).hex(), '#BF0040');
});

it('Mix: alpha', () => {
	assert.equal(Color('rgba(255, 0, 0, 0.5)').mix(Color('#00f')).rgb().string(0), 'rgba(64, 0, 191, 0.75)');
});

it('Mix: 0%', () => {
	assert.equal(Color('#f00').mix(Color('#00f'), 0).hex(), '#FF0000');
});

it('Mix: 25%', () => {
	assert.equal(Color('#f00').mix(Color('#00f'), 0.25).hex(), '#BF0040');
});

it('Mix: 50%', () => {
	assert.equal(Color('#f00').mix(Color('#00f'), 0.5).hex(), '#800080');
});

it('Mix: 75%', () => {
	assert.equal(Color('#f00').mix(Color('#00f'), 0.75).hex(), '#4000BF');
});

it('Mix: 100%', () => {
	assert.equal(Color('#f00').mix(Color('#00f'), 1).hex(), '#0000FF');
});

it('Level', () => {
	assert.equal(Color('white').level(Color('black')), 'AAA');
	assert.equal(Color('grey').level(Color('black')), 'AA');
});

it('Exceptions', () => {
	assert.throws(() => {
		Color('unknow');
	}, /Unable to parse color from string/);

	assert.throws(() => {
		Color({});
	}, /Unable to parse color from object/);

	assert.throws(() => {
		Color('');
	}, /Unable to parse color from string/);
});

it('Should parse alphas in RGBA hex notation correctly', () => {
	// Tests for regression of #174
	assert.notStrictEqual(
		Color('#000000ab').alpha(),
		Color('#000000aa').alpha(),
	);
});
