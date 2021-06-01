/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 把模板 转为 ast抽象语法树，即用树形的方式描述代码结构
  const ast = parse(template.trim(), options)
  // 优化 抽象语法树, 即标记静态节点以及静态根节点，在patch节点时会跳过静态节点的对比与重新渲染
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  // 将抽象语法树 生成 字符串形式的 js代码
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
