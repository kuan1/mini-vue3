## mini-vue3

阅读[vue3](https://github.com/vuejs/vue-next)代码。没有搭建任何环境，直接使用 module script 简陋实现阅读的功能。

## 项目目录介绍(仅实现部分基础功能，更方便阅读 vue3 原理)

```shell
src
|____index.js
|____shared
| |____index.js # isObject isArray isFunction hasChanged
|____runtime-core
| |____index.js
| |____scheduler.js # nextTick
| |____apiWatch.js # 65 行代码实现 watch 函数，仅支持函数和 reactive
|____reacivity
| |____reactive.js # 90行代码仅实现普通对象追踪
| |____index.js
| |____computed.js # 35行代码仅支持 function reactive
| |____effect.js # 150行代码副作用函数，追踪和触发逻辑
| |____ref.js # 35行代码实现简单的 ref
```

### 阅读进度

- [@vue/reactivity](https://github.com/vuejs/vue-next/tree/master/packages/reactivity)
- [@vue/runtime-core](https://github.com/vuejs/vue-next/tree/master/packages/runtime-core) 阅读中
