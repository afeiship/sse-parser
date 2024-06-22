# sse-parser
> Event source message parser.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
npm install @jswork/sse-parser
```

## usage
```js
import SseParser from '@jswork/sse-parser';

SseParser.parse('event: message\ndata: hello\n\n');
// [{ event:'message', data: 'hello' }]
```

## license
Code released under [the MIT license](https://github.com/afeiship/sse-parser/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/sse-parser
[version-url]: https://npmjs.org/package/@jswork/sse-parser

[license-image]: https://img.shields.io/npm/l/@jswork/sse-parser
[license-url]: https://github.com/afeiship/sse-parser/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/sse-parser
[size-url]: https://github.com/afeiship/sse-parser/blob/master/dist/index.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/sse-parser
[download-url]: https://www.npmjs.com/package/@jswork/sse-parser
