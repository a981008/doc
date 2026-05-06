# 我认为"agent（智能体）"终于有了足够广泛认可的定义为，可以成为有用的专业术语了

**作者**：Simon Willison
**发布日期**：2025年9月18日

---

在过去几周里，我注意到一个有趣的现象：我开始在对话中使用"agent"这个词，而不再觉得需要随后去定义它、翻白眼或用引号包裹它。

这对我个人来说是一个很大的成长！

展望未来，当谈到 agents 时，我将使用这个定义：

> **An LLM agent runs tools in a loop to achieve a goal.**
>
> （LLM agent 在循环中运行 tools 来达成目标。）

在过去的几年里，我一直非常犹豫是否将"agent"这个术语用于有意义的交流。对我来说，这感觉像是终极的流行语 Bingo——每个人都在谈论 agents，但如果你追问，每个人似乎对 agents 的实际定义都有不同的心智模型。

我甚至开始在我博客的 [agent-definitions 标签](https://simonwillison.net/tags/agent-definitions/) 中收集各种定义，包括在 Twitter 上众包了 211 个定义，并尝试用 Gemini 对它们进行总结和分组（我得到了 [13 个分组](https://gist.github.com/simonw/beaa5f90133b30724c5cc1c4008d0654#response)，这是其中之一的 [tool-using LLMS](https://gist.github.com/simonw/beaa5f90133b30724c5cc1c4008d0654#2-tool-using-llms)）。

专业术语只有在你能确信与你交谈的人持有相同定义时才有价值！如果他们不认同，那么交流就会变得*更*低效——你可能会浪费大量时间热烈讨论完全不同的概念。

原来这并不是一个新问题。在 1994 年的《Intelligent Agents: Theory and Practice》中，[Michael Wooldridge 写道](https://www.cs.ox.ac.uk/people/michael.wooldridge/pubs/ker95/subsection3_1_1.html)：

> Carl Hewitt 最近评论说，*什么是 agent？*
>
> 这个问题让 agent 计算社区感到尴尬，就像*什么是 intelligence*？这个问题让主流 AI 社区感到尴尬一样。
>
> 问题在于，尽管这个术语被广泛使用，被许多密切相关的领域工作者使用，但它无法被赋予一个单一、普遍接受的定义。

只要 agents 缺乏一个普遍共享的定义，使用这个术语就会降低而不是增加对话的清晰度。

在 AI 工程领域，我认为我们可能终于趋于一个足够广泛接受的定义，现在可以就 agents 进行富有成效的对话了。

## 在循环中运行工具达成目标

An LLM agent **runs tools in a loop to achieve a goal**. 让我们来分解一下。

"Tools in a loop" 的定义已经流行了一段时间——尤其是 Anthropic 特别[采用了这个定义](https://simonwillison.net/2025/May/22/tools-in-a-loop/)。这是许多 LLM API 中内置的模式，作为 tools 或 function calls —— LLM 被赋予请求其框架执行操作的能力，这些 tools 的结果被反馈给模型，以便它可以继续推理并解决给定的问题。

"To achieve a goal" 反映了这些不是无限循环——有一个停止条件。

我曾犹豫是否要指定"……由用户设定的目标"。我决定这不是这个定义的必要部分：我们已经有 sub-agent 模式，其中另一个 LLM 设置目标（参见 [Claude Code](https://simonwillison.net/2025/Jun/2/claude-trace/) 和 [Claude Research](https://simonwillison.net/2025/Jun/14/multi-agent-research-system/)）。

仍然存在几乎无限多的替代定义：如果你与技术领域之外的人交谈，你仍然可能遇到 travel agent（旅行代理商）的类比或员工替代品或对"autonomous（自主的）"这个词的热情使用。在这些背景下，澄清他们使用的定义对于进行富有成效的对话很重要。

但从现在开始，如果一个技术实现者告诉我他们正在构建一个"agent"，我假设他们意思是他们正在将 tools 连接到 LLM，以便在有界的循环中使用这些 tools 来达成目标。

有些人可能坚持认为 agents 必须有 memory。"Tools in a loop" 模式内置了一种基本形式的记忆：这些 tool calls 是作为与模型的对话的一部分构建的，而对话中之前的步骤提供了对于实现当前指定目标至关重要的短期记忆。

如果你想要长期记忆，最有希望的实现方式是[通过额外的 tools](https://simonwillison.net/2025/Sep/12/claude-memory/)！

## agents 作为人类替代品是我最不喜欢的定义

如果你与非技术业务人员交谈，你可能会遇到一个令人沮丧的常见替代定义：agents 作为人类员工的替代品。这通常以"customer support agents（客服智能体）"的形式出现，但你也可能会看到人们假设应该有 marketing agents、sales agents、accounting agents 等等。

如果有人对"财星美国500强"进行关于其"agent 战略"的调查，很可能在暗示这意味着什么。不过，如果你向他们提出"什么是 agent？"这个问题，想从他们那里得到一个清晰、明确的答案可不太容易！

这类 agent 仍然是科幻小说。如果你的 agent 战略是用一些模糊定义的 AI 系统（最可能是一个 system prompt（系统提示词）和一套 tools 在背后）来取代你的人类员工，你最终会大失所望。

这是因为有一个关键特征仍然是人类员工独有的：**accountability（问责制）**。人类可以为自己的行为承担责任并从错误中学习。把一个 AI agent 放在[performance improvement plan（绩效改进计划）](https://en.m.wikipedia.org/wiki/Performance_improvement#Performance_improvement_plans)上完全说不通！

有趣的是，人类还拥有 **agency（能动性）**。他们可以形成自己的目标并主动采取行动来实现这些目标——同时为这些决定承担责任。尽管名字里有"agent"，AI agents 根本无法做到这一点。

这张[1979 年传奇的 IBM 培训幻灯片](https://simonwillison.net/2025/Feb/3/a-computer-can-never-be-held-accountable/)说明了我们需要知道的一切：

![A computer can never be held accountable. Therefore a computer must never make a management decision](https://static.simonwillison.net/static/2025/a-computer-can-never-be-held-accountable.jpg)

## OpenAI 需要理清他们的说法

据我所知，agent 定义混乱的最大来源是 OpenAI 本身。

OpenAI CEO Sam Altman 喜欢[称 agents](https://simonwillison.net/2025/Jan/23/introducing-operator/)为"能够独立为你工作的AI系统"。

早在 7 月，OpenAI [发布了一个名为"ChatGPT agent"](https://openai.com/index/introducing-chatgpt-agent/)的产品功能，它实际上是一个浏览器自动化系统——在 ChatGPT 中开启该选项后，它可以启动一个真正的 Web 浏览器并直接与网页交互。

而在 3 月，OpenAI [发布了 Agents SDK](https://openai.com/index/new-tools-for-building-agents/)，包含 Python（[openai-agents](https://pypi.org/project/openai-agents/)）和 JavaScript（[@openai/agents](https://www.npmjs.com/package/@openai/agents)）的库。这一次就非常符合"tools in a loop"的概念。

OpenAI 可能已经太晚了，无法统一他们的定义。我会忽略他们其他的各种定义，坚持使用"tools in a loop"！

## 关于这个已经有了表情包

Josh Bickett 在 2023 年 11 月[发了这条推文](https://twitter.com/josh_bickett/status/1725556267014595032)：

> What is an AI agent?

![Meme showing a normal distribution curve with IQ scores from 55 to 145 on x-axis, featuring cartoon characters at different points](https://static.simonwillison.net/static/2025/agents-meme-card.jpg)

我想我已经从那条曲线的左侧爬到了右侧。

---

**原文链接**：<https://simonwillison.net/2025/Sep/18/agents/>
