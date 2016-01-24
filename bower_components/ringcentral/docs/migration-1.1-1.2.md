# Migration Guide 1.1 to 1.2

Key differences:

- AJAX object is now represented by 2 separate objects:
    - `Request`
    - `Response`
- AJAX error has 2 properties: `e.request` and `e.response` and backward-compatible `e.ajax` which is equal to
    `e.response`.
- AJAX Response now has `responses` property and `json` property along with backward-compatible `data` property