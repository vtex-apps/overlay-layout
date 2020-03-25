📢 Don't fork this project. Use, [contribute](https://github.com/vtex-apps/popover-layout), or open issues through [Store Discussion](https://github.com/vtex-apps/store-discussion).
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

# [DO NOT USE THIS] Popover Layout

This repository provides blocks that can help you create a Dropdown, Select or a Tooltip component.

## Configuration

1. Import the popover layout app to your theme's dependencies in the `manifest.json`, for example:

```jsonc
{
  "dependencies": {
    "vtex.popover-layout": "0.x"
  }
}
```

2. Now you can use the two blocks exported by `vtex.popover-layout`. Notice that you need to configure your own popover-layout and pass it as a child of popover-trigger.

```jsonc
{
  "popover-trigger": {
    "children": [
      "rich-text#question",
      "popover-layout"    
    ]
  },
  "rich-text#question": {
    "props": {
      "text": "**Click to open the popoer layout**",
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

### Popover

| Prop name | Type | Description | Default value |
| --- | --- | --- | --- |
| `placement` | `Placement` | Describes the preferred placement of the popover. If there is no space to put the popover in the placement that you choose it will fit in a fallback position | `'bottom`' |
| `scrollBehavior` | `ScrollBehavior` | How the popover should behave if the user tries to scroll the page | `'default'` |
| `backdrop` | `BackdropOptions` | If it should display a backdrop overlay | `'none'` |

### Placement

| Value | Description |
| `'bottom'` | Render the Popover at the bottom of the `PopoverTrigger` |
| `'left'` | Render the Popover at the left of the `PopoverTrigger` |
| `'right'` | Render the Popover at the right of the `PopoverTrigger` |
| `'top'` | Render the Popover at the top of the `PopoverTrigger` |

### ScrollBehavior

| Value | Description |
| --- | --- |
| `'lock-page-scroll'` | The user can't scroll |
| `'close-on-scroll'` | If the user tries to scroll it will close the popover |
| `'default'` | Doesn't do anything on scroll |

### BackdropOptions

| Value | Description |
| --- | --- |
| `'visible'` | Displays a backdrop overlay which blocks the click on other items of the page, if you click on the overlay it will close the popover |
| `'none'` | Doesn't display any backdrop overlay and if you click any item in the page it will close the popover and click the element |

### PopoverTrigger

| Prop name | Type | Description | Default value |
| --- | --- | --- | --- |
| trigger | `TriggerMode` | What kind of user action must happen to open the popover | `'click'` |

### TriggerMode
| --- | --- |
| `'click'` | Open when you click the trigger |
| `'hover'` | Open when you hover the trigger | 

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles |
| --- |
| `outsideClickHandler` |
| `paper` |
| `popper` |
| `trigger` |

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
