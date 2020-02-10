📢 Don't fork this project. Use, [contribute](https://github.com/vtex-apps/popover-layout), or open issues through [Store Discussion](https://github.com/vtex-apps/store-discussion).

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
| placement | `Placement` | Describes the preferred placement of the popover. If there is no space to put the popover in the placement that you choose it will fit in a fallback position | `'bottom`' |

### PopoverTrigger

| Prop name | Type | Description | Default value |
| --- | --- | --- | --- |
| trigger | `TriggerMode` | What kind of user action must happen to open the popover | `'click'` |

### TriggerMode
| --- | --- |
| `'click'` | Open when you click the trigger |
| `'hover'` | Open when you hover the trigger | 

### Placement

| Value | Description |
| `'bottom'` | Render the Popover at the bottom of the `PopoverTrigger` |
| `'left'` | Render the Popover at the left of the `PopoverTrigger` |
| `'right'` | Render the Popover at the right of the `PopoverTrigger` |
| `'top'` | Render the Popover at the top of the `PopoverTrigger` |

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles |
| --- |
| `outsideClickHandler` |
| `paper` |
| `popper` |
| `trigger` |
