# axios-handle

axios 接口处理封装

# Install
```bash
npm install axios-handle -S
or
yarn add axios-handle -S
```

# Usage
```bash
const http = require('axios-handle');

http.fetch('/sku/v2/skus').then(res => {
  console.log(res)
}).catch(error => {
  console.log(error)
})
```