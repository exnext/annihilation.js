# annihilation.js

The library to add the annihilation effects

## Live demo

[Live demo](https://exnext.github.io/annihilation.js/dist/)

## NPM

```bash
npm install @exnext/annihilation.js
```

## Initialization

```html
<script type='text/javascript' src='annihilation.js'></script>
```

or

```js
import { annihilation } from '@exnext/annihilation';
```

## Options

```typescript
interface IAnnihilationOptions {
    element: string | HTMLElement;
    removeElement: boolean;
    columns?: number;
    rows?: number;
    animationCssClass?: string;
    onCreatedCell?: OnCreatedCell;
    onCellAnimationEnd?: OnCellAnimationEnd;
    onBeforeAnnihilation?: OnBeforeAnnihilation;
}
```

##

## Events

```typescript
interface ICellParams {
    columns: number;
    rows: number;
    column: number;
    row: number;
    element: HTMLElement;
    piece: HTMLElement;
}
```

```typescript
interface IBeforeAnnihilation {
    annihilationElement: HTMLElement;
}
```

```typescript
declare type OnCreatedCell = (params: ICellParams) => void;
```

```typescript
declare type OnBeforeAnnihilation = (params: IBeforeAnnihilation) => void;
```

```typescript
declare type OnCellAnimationEnd = (count: number, params: ICellParams) => void;
```

## Used with animate.css, bootstrap or others

You may use the popular library with prepared animations or aother that you know. Look at the [live demo](https://exnext.github.io/annihilation.js/dist/) to see some examples.

## TODO

- replace html2canvas library on a faster something
- add more own animation effects