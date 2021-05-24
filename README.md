## mini-vue3

阅读[vue3](https://github.com/vuejs/vue-next)代码。没有搭建任何环境，直接使用 module script 简陋实现阅读的功能。

## 实现功能(仅实现部分基础功能，更方便阅读 vue3 原理)

#### 1. reactivity

- `src/reacivity/reactive.js` 90 行代码仅实现普通对象追踪
- `src/reacivity/effect` 150 行代码副作用函数，追踪和触发逻辑
- `src/reacivity/watch` 35 行代码仅支持 Function watch

### 2. runtime-core

### 阅读进度

- [@vue/reactivity](https://github.com/vuejs/vue-next/tree/master/packages/reactivity)
- [@vue/runtime-core](https://github.com/vuejs/vue-next/tree/master/packages/runtime-core) 阅读中
