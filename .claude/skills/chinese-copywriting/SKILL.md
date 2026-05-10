---
name: chinese-copywriting
description: "用于编写 Markdown 文档时的中文排版规范和文档风格指南，当修改 Markdown 文件或进行中文排版时使用"
allowed-tools:
  - Read
  - Edit
  - Write
---

<objective>
检查 Markdown 文档的排版和风格，确保符合中文文案排版规范和 Google 文档风格标准。

不输出任何分析或建议，直接执行排版检查和修正。
</objective>

<execution_context>
本 skill 结合两个来源：
- 中文文案排版指北：https://github.com/sparanoid/chinese-copywriting-guidelines
- Google 文档风格指南：https://github.com/google/styleguide/blob/gh-pages/docguide/style.md
</execution_context>

<rules>

## 第一部分：中文文案排版规则

### 1. 空格（间距）

**中英文之间**需要添加空格：
- 正确：`在 LeanCloud 上，新员工需要签署劳动合同`
- 错误：`在LeanCloud上，新员工需要签署劳动合同`

**中文与数字之间**需要添加空格：
- 正确：`花了 5000 元购买设备`
- 错误：`花了5000元购买设备`

**数字与单位之间**需要添加空格：
- 正确：`10 Gbps 带宽`、`内存 16 GB`
- 错误：`10Gbps带宽`、`内存16GB`

**例外**：度数和百分比不需要空格：
- 正确：`90°`、`15%` 提升
- 错误：`90 °`、`15 %` 提升

**全角标点与其它字符之间不添加空格**：
- 正确：`你好，世界！`
- 错误：`你好 ， 世界 ！`

### 2. 标点符号

**不要重复使用标点**：
- 正确：`你好！`
- 错误：`你好！！` 或 `你好！！！`

**使用全角中文标点**：
- 正确：`你好，世界！今天天气不错。`
- 错误：`你好,世界!今天天气不错.`

### 3. 全角/半角

**数字使用半角**：
- 正确：`MacBook Pro 有 15% 的提升`，`2023 年`
- 错误：`MacBook Pro 有 15％ 的提升`，`二零一三年`

**英文整句内部使用半角标点**：
- 正确：`Stay hungry, stay foolish. 这是乔布斯的名言。`
- 错误：`Stay hungry，stay foolish。 这是乔布斯的名言。`

### 4. 名词规范

**专有名词大小写正确**：
- 正确：GitHub、Microsoft、Apple、JavaScript、Python
- 错误：github、microsoft、GITHUB

**避免不专业的缩写**：
- 错误示例：Ts（typescript）、h5（HTML5）、FED（前端）、IOS（应为 iOS）

### 5. 引号

**简体中文推荐使用直角引号**：
- 正确：`他说：「你好。」`
- 错误：`他说："你好。"`

### 6. 链接

**链接文本与其他文字之间**：增加空格
- 正确：`请 [提交一个 issue](#) 并分配给相关同事。`
- 错误：`访问我们网站的最新动态，请 [点击这里](#) 进行订阅！`

---

## 第二部分：Google 文档风格规则

### 1. 核心目标

1. **源文本可读性强**：Markdown 源文件应当易于阅读和迁移
2. **文档库可维护**：跨团队长期维护 Markdown 文档
3. **语法简单易记**：保持语法简洁

### 2. 最小可行文档

小而准确的文档优于庞大但过时的文档。经常删除冗余内容，工程师应当像维护测试一样维护文档。

### 3. 文档结构

标准文档布局：
```markdown
# Document Title

简短介绍（1-3 句话）。

[TOC]

## 主题

内容。

## See also

* 链接
```

- **标题**：使用单个 H1（`#`）作为文档主标题
- **简介**：开头写 1-3 句话简要说明文档目的
- **目录**：如果内容较长，在简介后添加 `[TOC]` 目录指令
- **章节**：使用 H2（`##`）作为主要章节标题
- **结尾**：包含 "See also" 部分，链接相关文档

### 4. 标题规则

**ATX 风格标题**：
```markdown
# Heading 1

## Heading 2
```

**不要使用下划线风格**：
```markdown
Heading - do you remember what level? DO NOT DO THIS.
---------
```

**使用独特、完整的标题名称**：
```markdown
## Foo
### Foo summary
### Foo example
```

不要这样：
```markdown
## Foo
### Summary  <!-- 模糊不清 -->
### Example
```

**标题前后添加空行**：
```markdown
...text before.

## Heading 2

Text after...
```

不要这样：
```markdown
...text before.
##Heading 2  <!-- 缺少空行 -->
Text after...
```

### 5. 字符行数限制

Markdown 内容遵循 80 字符行数限制。

**工具集成**：所有工具都是围绕代码设计的，格式越一致效果越好。例如 Code Search 不支持软换行。

**例外情况**（不需限制行长度）：
- 链接
- 表格
- 标题
- 代码

```markdown
*   See the
    [foo docs](https://example.com/docs).
    and find the logfile.
```

### 6. 尾随空格

不要使用尾随空格。使用尾随反斜杠来换行。

```markdown
For some reason I just really want a break here,\
though it's probably not necessary.
```

### 7. 列表规则

**长列表使用懒编号**：
```markdown
1.  Foo.
1.  Bar.
    1.  Foofoo.
    1.  Barbar.
1.  Baz.
```

小列表可以使用完整编号（更美观）：
```markdown
1.  Foo.
2.  Bar.
3.  Baz.
```

**嵌套列表使用 4 空格缩进**：
```markdown
1.  Use 2 spaces after the item number, so the text itself is indented 4 spaces.
    Use a 4-space indent for wrapped text.
2.  Use 2 spaces again for the next item.

*   Use 3 spaces after a bullet, so the text itself is indented 4 spaces.
    Use a 4-space indent for wrapped text.
    1.  Use 2 spaces with numbered lists, as before.
        Wrapped text in a nested list needs an 8-space indent.
    2.  Looks nice, doesn't it?
*   Back to the bulleted list, indented 3 spaces.
```

**避免以下写法**：
```markdown
* One space,
with no indent for wrapped text.
     1. Irregular nesting... DO NOT DO THIS.
```

单行小列表可以使用 1 空格：
```markdown
* Foo
* Bar
* Baz.

1. Foo.
2. Bar.
```

### 8. 代码规则

**行内代码**：使用反引号标记文件名字、字段名等

```markdown
You'll want to run `really_cool_script.sh arg`.

Pay attention to the `foo_bar_whammy` field in that table.
```

泛指文件类型时使用行内代码（而非特定文件）：
```markdown
Be sure to update your `README.md`!
```

**代码块**：使用带语言声明的围栏代码块

```markdown
​```python
def Foo(self, bar):
  self.bar = bar
​```
```

始终声明语言以便语法高亮和编辑器识别。

**不要使用缩进代码块**（虽然 4 空格缩进也会被解释为代码块）：
```markdown
You'll need to run:

    bazel run :thing -- --foo

And then:

    bazel run :another_thing -- --bar
```

缩进代码块的问题：
- 无法指定语言
- 开始和结束不明确
- 难以在 Code Search 中搜索

**转义换行**：命令行需要换行时使用反斜杠

```shell
$ bazel run :target -- --flag --foo=longlonglonglonglongvalue \
  --bar=anotherlonglonglonglonglonglonglonglonglonglongvalue
```

**列表中嵌套代码块**：需要正确缩进

```markdown
*   Bullet.

    ​```c++
    int foo;
    ​```

*   Next bullet.
```

### 9. 链接规则

**尽量缩短长链接**：
```markdown
[...](/path/to/other/markdown/page.md)  <!-- 推荐 -->

[...](https://bad-full-url.example.com/path/to/other/markdown/page.md)  <!-- 避免 -->
```

**同一目录内可使用相对路径**：
```markdown
[...](other-page-in-same-dir.md)
[...](/path/to/another/dir/other-page.md)
```

避免使用 `../`：
```markdown
[...](../../bad/path/to/another/dir/other-page.md)  <!-- 避免 -->
```

**使用描述性链接文本**：

错误示例：
```markdown
See the Markdown guide for more info: [link](markdown.md), or check out the
style guide [here](style.md).

Check out a typical test result:
[https://example.com/foo/bar](https://example.com/foo/bar).
```

正确示例：
```markdown
See the [Markdown guide](markdown.md) for more info, or check out the
[style guide](style.md).

Check out a
[typical test result](https://example.com/foo/bar).
```

**参考链接**：用于长 URL 或重复链接

```markdown
See the [Markdown style guide][style], which has suggestions for making docs more
readable.

﻿[style]: http://example.com/markdown/style.md
```

**参考链接用于表格**（保持表格简洁）：

错误示例：
```markdown
Site                                                             | Description
---------------------------------------------------------------- | -----------------------
[site 1](http://example.com/excessively/long/path/example_site_1) | This is example site 1.
[site 2](http://example.com/excessively/long/path/example_site_2) | This is example site 2.
```

正确示例：
```markdown
Site     | Description
-------- | -----------------------
[site 1] | This is example site 1.
[site 2] | This is example site 2.

﻿[site 1]: http://example.com/excessively/long/path/example_site_1
﻿[site 2]: http://example.com/excessively/long/path/example_site_2
```

**参考链接定义位置**：
- 首次使用后、下一标题前
- 多节使用的链接放在文档末尾

错误示例：
```markdown
# Header FOR A BAD DOCUMENT

Some text with a [link][link_def].

Some more text with the same [link][link_def].

## Header 2

... lots of text ...

## Header 3

Some more text using a [different_link][different_link_def].

﻿[link_def]: http://reallyreallyreallylonglink.com
﻿[different_link_def]: http://differentreallyreallylonglink.com
```

正确示例：
```markdown
# Header

Some text with a [link][link_def].

Some more text with the same [link][link_def].

﻿[link_def]: http://reallyreallyreallylonglink.com

## Header 2

... lots of text ...

## Header 3

Some more text using a [different_link][different_link_def].

﻿[different_link_def]: http://differentreallyreallylonglink.com
```

### 10. 图片规则

- 谨慎使用图片
- 提供描述性 alt 文本
- 在无法用文字描述时使用图片（例如 UI 导航说明）

### 11. 表格规则

**使用场景**：仅在真正需要展示二维数据时使用表格

**避免的问题**：
- 列分布不均（某些列空值多）
- 维度不平衡（行少列多）
- 单元格中长篇大论

错误示例：
```markdown
Fruit  | Metrics      | Grows on | Acute curvature    | Attributes                                                                                                  | Notes
------ | ------------ | -------- | ------------------ | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------
Apple  | Very popular | Trees    |                    | [Juicy](http://example/long/url), Firm, Sweet               | Apples keep doctors away.
Banana | Very popular | Trees    | 16 degrees average | [Convenient](http://example/long/url2), Soft, Sweet | Contrary to popular belief...
```

正确示例（用列表替代）：
```markdown
## Fruits

Both types are highly popular, sweet, and grow on trees.

### Apple

*   [Juicy](http://example/long/url)
*   Firm

Apples keep doctors away.

### Banana

*   [Convenient](http://example/long/url2)
*   Soft
*   16 degrees average acute curvature.
```

**适合使用表格的情况**：
- 两维数据分布均匀
- 多个平行项各有不同属性

紧凑表格示例：
```markdown
Transport        | Favored by     | Advantages
---------------- | -------------- | -----------------------------------------------
Swallow          | Coconuts       | [Fast when unladen][airspeed]
Bicycle          | Miss Gulch     | [Weatherproof][tornado_proofing]
X-34 landspeeder | Whiny farmboys | [Cheap][tosche_station] since the XP-38 came out

﻿[airspeed]: http://example/airspeed
﻿[tornado_proofing]: http://example/kansas
﻿[tosche_station]: http://example/power
```

### 12. 大小写

**产品名**：保持产品、工具、二进制文件原始大小写

正确：`Markdown`、GitHub、Microsoft、Apple
错误：`markdown`、github、MICROSOFT

### 13. 优先使用 Markdown 而非 HTML

请优先使用标准 Markdown 语法，避免 HTML hack。除非必要不要使用，除了大表格，Markdown 几乎能满足所有需求。

### 14. Better/Best Rule

文档审查标准与代码审查不同。审查者应当：
1. 合理时立即 LGTM
2. 建议替代方案而非模糊评论
3. 对于重大变更，自己发起后续 CL
4. 仅在 CL 确实使文档变差时阻止提交

作者应当：
1. 避免在无聊争论中浪费精力
2. 尽可能使用 Better/Best Rule

</rules>

<process>

编写或修改 Markdown 文档时，按照以下顺序检查和修正：

### 第一步：标点符号
- 确保使用全角中文标点
- 不重复使用标点符号

### 第二步：空格
- 检查中英文之间的空格
- 检查中文与数字之间的空格
- 检查数字与单位之间的空格（度数和百分比除外）

### 第三步：全角/半角
- 确保数字使用半角
- 英文整句使用半角标点

### 第四步：名词
- 检查专有名词大小写
- 避免不专业缩写

### 第五步：引号
- 确保使用直角引号「」

### 第六步：文档结构
- 标题层级是否清晰
- 行长度是否控制在 80 字符内（链接、表格、标题、代码除外）
- 链接文本是否描述性
- 是否使用 ATX 风格标题
- 标题前后是否有空行

### 修正示例

**中文排版**：

| 错误写法 | 正确写法 |
|---------|---------|
| `在github上` | `在 GitHub 上` |
| `花了5000元` | `花了 5000 元` |
| `90°温度` | `90° 温度` |
| `你好！！` | `你好！` |
| `你好,世界!` | `你好，世界！` |
| `他说:"你好"` | `他说：「你好」` |

**文档风格**：

| 错误写法 | 正确写法 |
|---------|---------|
| `[点击这里](url)` | `[查看完整指南](url)` |
| 行长度超过 200 字符 | 将长行控制在 80 字符内 |
| `# 标题`（无空行） | 在标题前后添加空行 |
| `1. 项目 2. 项目` | `1. 项目 1. 项目`（懒编号） |
| 使用 `---` 标题 | 使用 `#` ATX 风格标题 |
| 表格单元格中长篇大论 | 使用列表替代 |

</process>

<tools>

- Read：读取文件内容
- Edit：修改文件中的问题

</tools>

<examples>

### 示例 1：中文排版修正

输入：
```
在github上,有5000个项目。
```

修正后：
```
在 GitHub 上，有 5000 个项目。
```

### 示例 2：标点符号修正

输入：
```
你好！！今天天气不错！！
```

修正后：
```
你好！今天天气不错。
```

### 示例 3：引号修正

输入：
```
他说:"你好,世界!"
```

修正后：
```
他说：「你好，世界！」
```

### 示例 4：链接文本修正

输入：
```
请阅读[点击这里](https://example.com)了解更多。
```

修正后：
```
请阅读[查看完整指南](https://example.com)了解更多。
```

### 示例 5：标题结构修正

输入：
```
# 标题
内容
## 子标题
更多内容
```

修正后：
```
# 标题

内容

## 子标题

更多内容
```

### 示例 6：懒编号列表

输入：
```
1. 第一项
2. 第二项
3. 第三项
```

修正后：
```
1. 第一项
1. 第二项
1. 第三项
```

### 示例 7：嵌套列表缩进

输入：
```
* 项目
  * 子项目
    * 子子项目
```

修正后：
```
*   项目
    *   子项目
        *   子子项目
```

### 示例 8：长链接使用参考链接

输入：
```
请查看 [http://example.com/very/long/path/that/exceeds/character/limit/and/makes/source/difficult/to/read](http://example.com/very/long/path/that/exceeds/character/limit/and/makes/source/difficult/to/read)。
```

修正后：
```
请查看 [这个链接][long_link]。

﻿[long_link]: http://example.com/very/long/path/that/exceeds/character/limit/and/makes/source/difficult/to/read
```

### 示例 9：表格改为列表

输入（表格）：
```markdown
Fruit  | Metrics      | Grows on
------ | ------------ | --------
Apple  | Very popular | Trees
Banana | Very popular | Trees
```

修正后（列表）：
```markdown
## Fruits

Both types are highly popular and grow on trees.

### Apple
* Very popular
* Grows on trees

### Banana
* Very popular
* Grows on trees
```

### 示例 10：命令换行转义

输入：
```
$ bazel run :target -- --flag --foo=longvalue --bar=anotherlongvalue
```

修正后：
```
$ bazel run :target -- --flag --foo=longvalue \
  --bar=anotherlongvalue
```

</examples>

<notes>

- 代码块内容不受排版规则限制
- 英文专有名词遵循官方大小写
- 表格内容根据实际情况判断
- 文档结构优先保证可读性

</notes>