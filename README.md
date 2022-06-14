# annihilation.js

The library to add the annihilation effects on DOM element.

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
}
```

<table>
    <thead>
        <tr>
            <th> Property </th>
            <th> Type </th>
            <th> Description </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td> element </td>
            <td> string or HTMLElement </td>
            <td> The DOM element with you want to annihilation </td>
        </tr>
        <tr>
            <td> removeElement </td>
            <td> boolean </td>
            <td> If true, defined element will be removed from parent. Default value is <b>true</b></td>
        </tr>
        <tr>
            <td> columns </td>
            <td> number </td>
            <td> Number of columns </td>
        </tr>
        <tr>
            <td> rows </td>
            <td> number </td>
            <td> Number of rows </td>
        </tr>
                <tr>
            <td> animationCssClass </td>
            <td> string </td>
            <td> CSS class with defined animation </td>
        </tr>
    </tbody>
</table>

### Details for columns and rows

If neither columns nor rows are defined then default value for columns is 10. For defined columns without rows, rows will be computed proportional by element size. The same is for defined rows without columns. You can also define values for columns and rows. Then piece (cell) of the converted image won't be square.

## Executing annihilation

To execute annihilation on DOM element you should invoke `doIt` method after defined all properties and events. Look at examples below.

## Events

To register event use the `on` method

```typescript
on(name: string, callback: Function): this;
```

<table>
    <thead>
        <tr>
            <th> Event </th>
            <th> Description </th>
            <th> Type of callback parameter </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td> created-cell </td>
            <td> Called after each cell is created. You can use it to redefine animation and other details. </td>
            <td> ICellParams </td>
        </tr>
        <tr>
            <td> cell-animation-end </td>
            <td> Called for each cell after its animation end. </td>
            <td> ICellAnimationEnd </td>
        </tr>
        <tr>
            <td> before-annihilation </td>
            <td> Called before annihilation effect. By `cellsLeft` you have information on how many cell still exist. </td>
            <td> IBeforeAnnihilation </td>
        </tr>
        <tr>
            <td> after-annihilation </td>
            <td> Called after annihilation effect. You can use it for cleaning. </td>
            <td> IAfterAnnihilation </td>
        </tr>
    </tbody>
</table>

```typescript
interface ICellParams {
    /* Number of columns */
    columns: number;
    /* Number of rows */
    rows: number;
    /* X-Position of cell */
    column: number;
    /* Y-Position of cell */
    row: number;
    /* DOM element to annihilation */
    element: HTMLElement;
    /* Cell, piece of annihilation element*/
    cell: HTMLElement;
}
```

```typescript
interface IBeforeAnnihilation {
    /* DOM element to annihilation */
    element: HTMLElement;
    /* Prepared element used in annihilation effect */
    annihilationElement: HTMLElement;
}
```

```typescript
export interface IAfterAnnihilation {
    /* DOM element to annihilation */
    element: HTMLElement;
}
```

```typescript
interface ICellAnimationEnd {
    /* Still existing cells */
    cellsLeft: number;
    /* Cell details */
    cellParams: ICellParams;
}
```

## Simple usage

```html
<img src="image.jpg" id="img_demo" />

<script>
    annihilation({ element: '#img_demo' }).doIt();
</script>
```

## Example usage

```html
<img src="image.jpg" id="img_demo" />

<script>
    annihilation({
        element: '#img_demo',
        columns: 20,
        rows: 20,
        animationCssClass: 'animate__animated animate__zoomOut'
    })
        .on('created-cell', (params) => {
            let multiplier = params.row + params.column;
            params.cell.style.animationDelay = 0.05 * multiplier + 's';
        })
        .doIt();
</script>
```

## Used with animate.css, bootstrap or others

You may use the popular library with prepared animations or another that you know. Look at the [live demo](https://exnext.github.io/annihilation.js/dist/) to see some examples.

## Preview render content before annihilation

The annihilation.js uses html2canvas library to create the image used for annihilation effects. Sometimes it doesn't look good, there could be some trouble with that. You can use `annihilationPreview` to check the converted image before using the main annihilation library.

```html
<script type='text/javascript' src='annihilation.js'></script>
```

or

```js
import { annihilationPreview } from '@exnext/annihilation';
```

```js
<div id="demo">
    <img src="some_image.jpg" />
    <div> Any text </div>
</div>

<script>
    annihilationPreview({ element: '#demo' }).doIt();
</script>
```

## TODO

- replacing html2canvas library with something faster
- adding more custom animation effects