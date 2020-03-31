📢 Use this project, [contribute](https://github.com/vtex-apps/popover-layout) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Popover Layout

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

The Popover Layout app provides blocks that help you create a Dropdown, Select or a Tooltip component.

Foto/Gif exemplo 

## Configuration

1. Add the Popover Layout app to your theme's dependencies in the `manifest.json`, for example:

```jsonc
{
  "dependencies": {
    "vtex.popover-layout": "0.x"
  }
}
```

Now you can use the two blocks exported by the Popover Layout app: 

Block name | Description |
| --------------------| -------- |
| `popover-layout` | Add a description for `popover-layout`. |
| `popover-trigger` | Add a description for `popover-trigger`.|

2.  In any desired theme template, add the `popover-trigger` and then declare it using a block of your choosing and the `popover-layout`:

```jsonc
{
  "popover-trigger": {
    "children": [
      "rich-text#question",
      "popover-layout"    
    ]
  },
```

Notice that the `popover-trigger` is not rendered. Following the example stated above, the `rich-text` block will be the one rendered and responsible for effectively triggering the Popover Layout content. 

### `popover-trigger` props

| Prop name | Type | Description | Default value |
| --- | --- | --- | --- |
| `trigger` | `Enum` | Defines whether the `popover-layout` will be opened by click (`click`) or hover (`hover`).| `click` |

3. Configure the chosen trigger [block](https://vtex.io/docs/apps/all) and declare the `popover-layout` using its props. For example:

```jsonc
  "rich-text#question": {
    "props": {
      "text": "**Click to open the popover layout**",
      "blockClass": "question"
    }
  },
  "popover-layout": {
    "props": {
      "placement": "left"
    },
    "children": [
      "rich-text#link"
    ]
  },
  "rich-text#link": {
    "props": {
      "text": "\n**Reach us at**\nwww.vtex.com.br",
      "blockClass": "link"
    }
  }
}
```

The `popover-layout` is a wrapper block and works as the `popover-trigger`. This means that it is not properly rendered. Instead, you will have to pass to it a children block that will be responsible for rendering the Popover Layout content. 

### `popover-layout` props

| Prop name | Type | Description | Default value |
| --- | --- | --- | --- |
| `placement` | `Enum` | Defines the popover placement. Possible values are: `bottom`, `left`, `right` or `top`.  If there is no space to put the popover in the placement that you choose, it will fit in a fallback position. | `bottom` |
| `scrollBehavior` | `Enum` | Popover Layout behavior when users try to scroll the page. Possible values are: `lock-page-scroll` (in which users can't scroll), `close-on-scroll` (Popover is closed when users are scrolling) or `default` (Scroll does not affect the Popover). | `default` |
| `backdrop` | `Enum` | Once the Popover is rendered, it defines whether a backdrop overlay will be displayed (`visible`) or not (`none`). When set as `visible`, the backdrop overlay will close the Popover when clicked on. Otherwise, the Popover will be closed only if any component from the page is clicked on. | `none` |
| `showArrow`  | `Boolean` | Whether an arrow pointing to the `popover-trigger` component should be displayed (`true`) or not (`false`). | `false` |
| `offsets` | `Array` | Offsets of the `popover-layout` (Unit = `px`) | `{ skidding: 0, distance: 0 }` |

- **`offsets` array:**

| Prop | Type | Description |
| --- | --- | --- |
| `skidding` | `Number` | Displaces the `popover-layout` along the `popover-trigger`. |
| `distance` | `Number` | Displaces the `popover-layout` away from, or toward, the `popover-trigger` in the direction of its placement. A positive number displaces it further away, while a negative number lets it overlap the `popover-trigger`. |

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles |
| --- |
| `arrow` |
| `container` |
| `outsideClickHandler` |
| `paper` |
| `popper` |
| `popperArrow` |
| `trigger` |

## Contributors ✨

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!


