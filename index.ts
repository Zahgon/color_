import colorString from 'color-string';
import convertRaw from 'color-convert';
import type {Convert} from 'color-convert';

/*
Public type surface. This mirrors the hand-written `index.d.ts` of the original
JavaScript package one-for-one so that consumers see an identical API.
*/

export type ColorLike = ColorInstance | string | ArrayLike<number> | number | Record<string, any>;
export type ColorJson = {model: string; color: number[]; valpha: number};
export type ColorObject = {alpha?: number | undefined} & Record<string, number>;

export type ColorInstance = {
	toString(): string;
	toJSON(): ColorJson;
	string(places?: number): string;
	percentString(places?: number): string;
	array(): number[];
	object(): ColorObject;
	unitArray(): number[];
	unitObject(): {r: number; g: number; b: number; alpha?: number | undefined};
	round(places?: number): ColorInstance;
	alpha(): number;
	alpha(value: number): ColorInstance;
	red(): number;
	red(value: number): ColorInstance;
	green(): number;
	green(value: number): ColorInstance;
	blue(): number;
	blue(value: number): ColorInstance;
	hue(): number;
	hue(value: number): ColorInstance;
	saturationl(): number;
	saturationl(value: number): ColorInstance;
	lightness(): number;
	lightness(value: number): ColorInstance;
	saturationv(): number;
	saturationv(value: number): ColorInstance;
	value(): number;
	value(value: number): ColorInstance;
	chroma(): number;
	chroma(value: number): ColorInstance;
	gray(): number;
	gray(value: number): ColorInstance;
	white(): number;
	white(value: number): ColorInstance;
	wblack(): number;
	wblack(value: number): ColorInstance;
	cyan(): number;
	cyan(value: number): ColorInstance;
	magenta(): number;
	magenta(value: number): ColorInstance;
	yellow(): number;
	yellow(value: number): ColorInstance;
	black(): number;
	black(value: number): ColorInstance;
	x(): number;
	x(value: number): ColorInstance;
	y(): number;
	y(value: number): ColorInstance;
	z(): number;
	z(value: number): ColorInstance;
	l(): number;
	l(value: number): ColorInstance;
	a(): number;
	a(value: number): ColorInstance;
	b(): number;
	b(value: number): ColorInstance;
	keyword(): string;
	keyword<V extends string>(value: V): ColorInstance;
	hex(): string;
	hex<V extends string>(value: V): ColorInstance;
	hexa(): string;
	hexa<V extends string>(value: V): ColorInstance;
	rgbNumber(): number;
	luminosity(): number;
	contrast(color2: ColorInstance): number;
	level(color2: ColorInstance): 'AAA' | 'AA' | '';
	isDark(): boolean;
	isLight(): boolean;
	negate(): ColorInstance;
	lighten(ratio: number): ColorInstance;
	darken(ratio: number): ColorInstance;
	saturate(ratio: number): ColorInstance;
	desaturate(ratio: number): ColorInstance;
	whiten(ratio: number): ColorInstance;
	blacken(ratio: number): ColorInstance;
	grayscale(): ColorInstance;
	fade(ratio: number): ColorInstance;
	opaquer(ratio: number): ColorInstance;
	rotate(degrees: number): ColorInstance;
	mix(mixinColor: ColorInstance, weight?: number): ColorInstance;
	rgb(...arguments_: number[]): ColorInstance;
	hsl(...arguments_: number[]): ColorInstance;
	hsv(...arguments_: number[]): ColorInstance;
	hwb(...arguments_: number[]): ColorInstance;
	cmyk(...arguments_: number[]): ColorInstance;
	xyz(...arguments_: number[]): ColorInstance;
	lab(...arguments_: number[]): ColorInstance;
	lch(...arguments_: number[]): ColorInstance;
	ansi16(...arguments_: number[]): ColorInstance;
	ansi256(...arguments_: number[]): ColorInstance;
	hcg(...arguments_: number[]): ColorInstance;
	apple(...arguments_: number[]): ColorInstance;
};

export type ColorModel = keyof Convert;

export type ColorConstructor = {
	(object?: ColorLike, model?: ColorModel): ColorInstance;
	new(object?: ColorLike, model?: ColorModel): ColorInstance;
	rgb(...value: number[]): ColorInstance;
	rgb(color: ColorLike): ColorInstance;
	hsl(...value: number[]): ColorInstance;
	hsl(color: ColorLike): ColorInstance;
	hsv(...value: number[]): ColorInstance;
	hsv(color: ColorLike): ColorInstance;
	hwb(...value: number[]): ColorInstance;
	hwb(color: ColorLike): ColorInstance;
	cmyk(...value: number[]): ColorInstance;
	cmyk(color: ColorLike): ColorInstance;
	xyz(...value: number[]): ColorInstance;
	xyz(color: ColorLike): ColorInstance;
	lab(...value: number[]): ColorInstance;
	lab(color: ColorLike): ColorInstance;
	lch(...value: number[]): ColorInstance;
	lch(color: ColorLike): ColorInstance;
	ansi16(...value: number[]): ColorInstance;
	ansi16(color: ColorLike): ColorInstance;
	ansi256(...value: number[]): ColorInstance;
	ansi256(color: ColorLike): ColorInstance;
	hcg(...value: number[]): ColorInstance;
	hcg(color: ColorLike): ColorInstance;
	apple(...value: number[]): ColorInstance;
	apple(color: ColorLike): ColorInstance;
};

/*
Internal shapes.

`color-convert` and `color-string` ship deeply overloaded declaration files that
cannot be indexed by a dynamic model name. The original JavaScript indexes them
dynamically, so we re-view the very same runtime objects through structural
types. No runtime value is altered by these views.
*/

type RawConverter = {
	raw(input: number[] | number): number | number[];
};

type ModelConverter = {
	channels: number;
	labels: string | string[];
	keyword(color: number[]): string;
	[targetModel: string]: unknown;
};

type CssWriter = (...arguments_: number[]) => string;

const convert = convertRaw as unknown as Record<string, ModelConverter>;

const cssWriters = colorString.to as unknown as Record<string, CssWriter>;

/**
The internal view of a colour instance: the public API plus the three own
properties the constructor writes.
*/
type ColorInternal = ColorInstance & {
	model: string;
	color: number[];
	valpha: number;
};

type ColorMethodTable = Record<string, (...arguments_: number[]) => ColorInternal>;

type ColorConstructorInternal = new (object?: ColorLike | null, model?: string | null) => ColorInternal;

/** Invoke a model conversion / accessor method chosen at runtime. */
function callModel(self: ColorInternal, model: string, ...arguments_: number[]): ColorInternal {
	return (self as unknown as ColorMethodTable)[model](...arguments_);
}

const skippedModels = [
	// To be honest, I don't really feel like keyword belongs in color convert, but eh.
	'keyword',

	// Gray conflicts with some method names, and has its own method defined.
	'gray',

	// Shouldn't really be in color-convert either...
	'hex',
];

const hashedModelKeys: Record<string, string> = {};
for (const model of Object.keys(convert)) {
	hashedModelKeys[[...convert[model].labels].sort().join('')] = model;
}

const limiters: Record<string, Array<((value: number) => number) | undefined>> = {};

// Both parameters are declared as required-but-nullable so that `Color.length`
// stays 2, exactly as in the JavaScript original.
function Color(this: ColorInternal, object: ColorLike | null | undefined, model: string | null | undefined): ColorInstance | undefined {
	if (!(this instanceof Color)) {
		return newColor(object, model);
	}

	if (model && model in skippedModels) {
		model = null;
	}

	if (model && !(model in convert)) {
		throw new Error('Unknown model: ' + model);
	}

	let i;
	let channels;

	if (object === null || object === undefined) {
		this.model = 'rgb';
		this.color = [0, 0, 0];
		this.valpha = 1;
	} else if (object instanceof Color) {
		const source = object as unknown as ColorInternal;
		this.model = source.model;
		this.color = [...source.color];
		this.valpha = source.valpha;
	} else if (typeof object === 'string') {
		const result = colorString.get(object);
		if (result === null) {
			throw new Error('Unable to parse color from string: ' + object);
		}

		this.model = result.model;
		channels = convert[this.model].channels;
		this.color = result.value.slice(0, channels);
		this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
	} else if ((object as ArrayLike<number>).length > 0) {
		const arrayLike = object as ArrayLike<number>;
		this.model = model || 'rgb';
		channels = convert[this.model].channels;
		const newArray = Array.prototype.slice.call(arrayLike, 0, channels) as number[];
		this.color = zeroArray(newArray, channels);
		this.valpha = typeof arrayLike[channels] === 'number' ? arrayLike[channels] : 1;
	} else if (typeof object === 'number') {
		// This is always RGB - can be converted later on.
		this.model = 'rgb';
		this.color = [
			(object >> 16) & 0xFF,
			(object >> 8) & 0xFF,
			object & 0xFF,
		];
		this.valpha = 1;
	} else {
		const record = object as Record<string, unknown>;
		this.valpha = 1;

		const keys = Object.keys(record);
		if ('alpha' in record) {
			keys.splice(keys.indexOf('alpha'), 1);
			this.valpha = typeof record.alpha === 'number' ? record.alpha : 0;
		}

		const hashedKeys = keys.sort().join('');
		if (!(hashedKeys in hashedModelKeys)) {
			throw new Error('Unable to parse color from object: ' + JSON.stringify(record));
		}

		this.model = hashedModelKeys[hashedKeys];

		const {labels} = convert[this.model];
		const color: number[] = [];
		for (i = 0; i < labels.length; i++) {
			color.push(record[labels[i]] as number);
		}

		this.color = zeroArray(color);
	}

	// Perform limitations (clamping, etc.)
	if (limiters[this.model]) {
		channels = convert[this.model].channels;
		for (i = 0; i < channels; i++) {
			const limit = limiters[this.model][i];
			if (limit) {
				this.color[i] = limit(this.color[i]);
			}
		}
	}

	this.valpha = Math.max(0, Math.min(1, this.valpha));

	if (Object.freeze) {
		Object.freeze(this);
	}

	return undefined;
}

/** `new Color(...)`, expressed through the internal construct signature. */
function newColor(object?: ColorLike | null, model?: string | null): ColorInternal {
	return new (Color as unknown as ColorConstructorInternal)(object, model);
}

const colorPrototype = {
	toString(this: ColorInternal): string {
		return this.string();
	},

	toJSON(this: ColorInternal): ColorJson {
		return callModel(this, this.model) as unknown as ColorJson;
	},

	string(this: ColorInternal, places?: number): string {
		let self = this.model in colorString.to ? this : (this.rgb() as ColorInternal);
		self = self.round(typeof places === 'number' ? places : 1) as ColorInternal;
		const arguments_ = self.valpha === 1 ? self.color : [...self.color, this.valpha];
		return cssWriters[self.model](...arguments_);
	},

	percentString(this: ColorInternal, places?: number): string {
		const self = this.rgb().round(typeof places === 'number' ? places : 1) as ColorInternal;
		const arguments_ = self.valpha === 1 ? self.color : [...self.color, this.valpha];
		return (colorString.to.rgb.percent as CssWriter)(...arguments_);
	},

	array(this: ColorInternal): number[] {
		return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha];
	},

	object(this: ColorInternal): ColorObject {
		const result: Record<string, number> = {};
		const {channels} = convert[this.model];
		const {labels} = convert[this.model];

		for (let i = 0; i < channels; i++) {
			result[labels[i]] = this.color[i];
		}

		if (this.valpha !== 1) {
			result.alpha = this.valpha;
		}

		return result as ColorObject;
	},

	unitArray(this: ColorInternal): number[] {
		const rgb = (this.rgb() as ColorInternal).color;
		rgb[0] /= 255;
		rgb[1] /= 255;
		rgb[2] /= 255;

		if (this.valpha !== 1) {
			rgb.push(this.valpha);
		}

		return rgb;
	},

	unitObject(this: ColorInternal): {r: number; g: number; b: number; alpha?: number | undefined} {
		const rgb = this.rgb().object() as {r: number; g: number; b: number; alpha?: number};
		rgb.r /= 255;
		rgb.g /= 255;
		rgb.b /= 255;

		if (this.valpha !== 1) {
			rgb.alpha = this.valpha;
		}

		return rgb;
	},

	round(this: ColorInternal, places?: number): ColorInstance {
		places = Math.max(places || 0, 0);
		return newColor([...this.color.map(roundToPlace(places)), this.valpha], this.model);
	},

	alpha(this: ColorInternal, value?: number): number | ColorInstance {
		if (value !== undefined) {
			return newColor([...this.color, Math.max(0, Math.min(1, value))], this.model);
		}

		return this.valpha;
	},

	// Rgb
	red: getset('rgb', 0, maxfn(255)),
	green: getset('rgb', 1, maxfn(255)),
	blue: getset('rgb', 2, maxfn(255)),

	hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, value => ((value % 360) + 360) % 360),

	saturationl: getset('hsl', 1, maxfn(100)),
	lightness: getset('hsl', 2, maxfn(100)),

	saturationv: getset('hsv', 1, maxfn(100)),
	value: getset('hsv', 2, maxfn(100)),

	chroma: getset('hcg', 1, maxfn(100)),
	gray: getset('hcg', 2, maxfn(100)),

	white: getset('hwb', 1, maxfn(100)),
	wblack: getset('hwb', 2, maxfn(100)),

	cyan: getset('cmyk', 0, maxfn(100)),
	magenta: getset('cmyk', 1, maxfn(100)),
	yellow: getset('cmyk', 2, maxfn(100)),
	black: getset('cmyk', 3, maxfn(100)),

	x: getset('xyz', 0, maxfn(95.047)),
	y: getset('xyz', 1, maxfn(100)),
	z: getset('xyz', 2, maxfn(108.833)),

	l: getset('lab', 0, maxfn(100)),
	a: getset('lab', 1),
	b: getset('lab', 2),

	keyword(this: ColorInternal, value?: string): string | ColorInstance {
		if (value !== undefined) {
			return newColor(value);
		}

		return convert[this.model].keyword(this.color);
	},

	hex(this: ColorInternal, value?: string): string | ColorInstance {
		if (value !== undefined) {
			return newColor(value);
		}

		return (colorString.to.hex as CssWriter)(...(this.rgb().round() as ColorInternal).color);
	},

	hexa(this: ColorInternal, value?: string): string | ColorInstance {
		if (value !== undefined) {
			return newColor(value);
		}

		const rgbArray = (this.rgb().round() as ColorInternal).color;

		let alphaHex = Math.round(this.valpha * 255).toString(16).toUpperCase();
		if (alphaHex.length === 1) {
			alphaHex = '0' + alphaHex;
		}

		return (colorString.to.hex as CssWriter)(...rgbArray) + alphaHex;
	},

	rgbNumber(this: ColorInternal): number {
		const rgb = (this.rgb() as ColorInternal).color;
		return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
	},

	luminosity(this: ColorInternal): number {
		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
		const rgb = (this.rgb() as ColorInternal).color;

		const lum: number[] = [];
		for (const [i, element] of rgb.entries()) {
			const chan = element / 255;
			lum[i] = (chan <= 0.04045) ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
		}

		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
	},

	contrast(this: ColorInternal, color2: ColorInstance): number {
		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
		const lum1 = this.luminosity();
		const lum2 = color2.luminosity();

		if (lum1 > lum2) {
			return (lum1 + 0.05) / (lum2 + 0.05);
		}

		return (lum2 + 0.05) / (lum1 + 0.05);
	},

	level(this: ColorInternal, color2: ColorInstance): 'AAA' | 'AA' | '' {
		// https://www.w3.org/TR/WCAG/#contrast-enhanced
		const contrastRatio = this.contrast(color2);
		if (contrastRatio >= 7) {
			return 'AAA';
		}

		return (contrastRatio >= 4.5) ? 'AA' : '';
	},

	isDark(this: ColorInternal): boolean {
		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
		const rgb = (this.rgb() as ColorInternal).color;
		const yiq = (rgb[0] * 2126 + rgb[1] * 7152 + rgb[2] * 722) / 10_000;
		return yiq < 128;
	},

	isLight(this: ColorInternal): boolean {
		return !this.isDark();
	},

	negate(this: ColorInternal): ColorInstance {
		const rgb = this.rgb() as ColorInternal;
		for (let i = 0; i < 3; i++) {
			rgb.color[i] = 255 - rgb.color[i];
		}

		return rgb;
	},

	lighten(this: ColorInternal, ratio: number): ColorInstance {
		const hsl = this.hsl() as ColorInternal;
		hsl.color[2] += hsl.color[2] * ratio;
		return hsl;
	},

	darken(this: ColorInternal, ratio: number): ColorInstance {
		const hsl = this.hsl() as ColorInternal;
		hsl.color[2] -= hsl.color[2] * ratio;
		return hsl;
	},

	saturate(this: ColorInternal, ratio: number): ColorInstance {
		const hsl = this.hsl() as ColorInternal;
		hsl.color[1] += hsl.color[1] * ratio;
		return hsl;
	},

	desaturate(this: ColorInternal, ratio: number): ColorInstance {
		const hsl = this.hsl() as ColorInternal;
		hsl.color[1] -= hsl.color[1] * ratio;
		return hsl;
	},

	whiten(this: ColorInternal, ratio: number): ColorInstance {
		const hwb = this.hwb() as ColorInternal;
		hwb.color[1] += hwb.color[1] * ratio;
		return hwb;
	},

	blacken(this: ColorInternal, ratio: number): ColorInstance {
		const hwb = this.hwb() as ColorInternal;
		hwb.color[2] += hwb.color[2] * ratio;
		return hwb;
	},

	grayscale(this: ColorInternal): ColorInstance {
		// http://en.wikipedia.org/wiki/Grayscale#Converting_colour_to_grayscale
		const rgb = (this.rgb() as ColorInternal).color;
		const value = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
		return ColorTyped.rgb(value, value, value);
	},

	fade(this: ColorInternal, ratio: number): ColorInstance {
		return this.alpha(this.valpha - (this.valpha * ratio));
	},

	opaquer(this: ColorInternal, ratio: number): ColorInstance {
		return this.alpha(this.valpha + (this.valpha * ratio));
	},

	rotate(this: ColorInternal, degrees: number): ColorInstance {
		const hsl = this.hsl() as ColorInternal;
		let hue = hsl.color[0];
		hue = (hue + degrees) % 360;
		hue = hue < 0 ? 360 + hue : hue;
		hsl.color[0] = hue;
		return hsl;
	},

	mix(this: ColorInternal, mixinColor: ColorInstance, weight?: number): ColorInstance {
		// Ported from sass implementation in C
		// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
		if (!mixinColor || !mixinColor.rgb) {
			throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
		}

		const color1 = mixinColor.rgb();
		const color2 = this.rgb();
		const p = weight === undefined ? 0.5 : weight;

		const w = 2 * p - 1;
		const a = color1.alpha() - color2.alpha();

		const w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2;
		const w2 = 1 - w1;

		return ColorTyped.rgb(
			w1 * color1.red() + w2 * color2.red(),
			w1 * color1.green() + w2 * color2.green(),
			w1 * color1.blue() + w2 * color2.blue(),
			color1.alpha() * p + color2.alpha() * (1 - p));
	},
};

(Color as unknown as {prototype: unknown}).prototype = colorPrototype;

const ColorTyped = Color as unknown as ColorConstructor;

const prototypeTable = colorPrototype as unknown as Record<string, unknown>;
const staticsTable = Color as unknown as Record<string, unknown>;

// Model conversion methods and static constructors
for (const model of Object.keys(convert)) {
	if (skippedModels.includes(model)) {
		continue;
	}

	const {channels} = convert[model];

	// Conversion methods
	prototypeTable[model] = function (this: ColorInternal, ...arguments_: number[]): ColorInternal {
		if (this.model === model) {
			return newColor(this);
		}

		if (arguments_.length > 0) {
			return newColor(arguments_, model);
		}

		const raw = (convert[this.model][model] as RawConverter).raw(this.color);
		return newColor([...assertArray(raw), this.valpha], model);
	};

	// 'static' construction methods
	staticsTable[model] = function (...arguments_: unknown[]): ColorInternal {
		let color = arguments_[0];
		if (typeof color === 'number') {
			color = zeroArray(arguments_ as number[], channels);
		}

		return newColor(color as ColorLike, model);
	};
}

function roundTo(number: number, places: number): number {
	return Number(number.toFixed(places));
}

function roundToPlace(places: number): (number: number) => number {
	return function (number: number): number {
		return roundTo(number, places);
	};
}

function getset(
	model: string | string[],
	channel: number,
	modifier?: (value: number) => number,
): (this: ColorInternal, value?: number) => any {
	const models = Array.isArray(model) ? model : [model];

	for (const m of models) {
		(limiters[m] ||= [])[channel] = modifier;
	}

	const primaryModel = models[0];

	return function (this: ColorInternal, value?: number): number | ColorInstance {
		let result;

		if (value !== undefined) {
			if (modifier) {
				value = modifier(value);
			}

			result = callModel(this, primaryModel);
			result.color[channel] = value;
			return result;
		}

		let scalar = callModel(this, primaryModel).color[channel];
		if (modifier) {
			scalar = modifier(scalar);
		}

		return scalar;
	};
}

function maxfn(max: number): (v: number) => number {
	return function (v: number): number {
		return Math.max(0, Math.min(max, v));
	};
}

function assertArray(value: number | number[]): number[] {
	return Array.isArray(value) ? value : [value];
}

function zeroArray(array: number[], length?: number): number[] {
	if (length === undefined) {
		return array;
	}

	for (let i = 0; i < length; i++) {
		if (typeof array[i] !== 'number') {
			array[i] = 0;
		}
	}

	return array;
}

export default ColorTyped;
