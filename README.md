# `<level-progress>` element

```html
<level-progress level="1" max="100" value="30"></level-progress>
```

Custom web component to represent a multi-level animated progress bar.

## HTML

These attributes only set the initial state. Any further modifications will not affect the component's state.

|Attribute|Purpose|Default|
|---|---|---|
|`level`|Initial level|`1`|
|`max`|Max value at this level|`100`|
|`value`|Current value at this level|`0`|

## CSS

|Property|Purpose|Default|
|---|---|---|
|`--fill-color`|Color of inner filled bar|`linear-gradient(#6de1ff, #00789c)`|
