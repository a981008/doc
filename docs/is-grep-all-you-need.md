# Grep 就是你所需的一切吗？

> 原文：https://arxiv.org/pdf/2605.15184

Agent Harness 如何重塑 Agentic 搜索

**作者**：Sahil Sen, Akhil Kasturi, Elias Lumer,
Anmol Gulati, Vamse Kumar Subbiah

**机构**：普华永道（美国）

**引用**：arXiv:2605.15184 [cs.CL]

大型语言模型（LLM）智能体的最新进展使得复杂的 agentic
工作流程成为可能，其中模型能够自主检索信息、调用工具，
并在大型语料库上进行推理以完成用户任务。尽管检索增强生成
（RAG）在 agentic 搜索系统中的应用日益广泛，但现有文献缺乏
对检索策略选择如何与智能体架构和工具调用范式相互作用的
系统性比较。一些重要的实践维度——包括工具输出如何呈现给
模型，以及当搜索需要处理更多无关周围文本时性能如何变化——
在智能体循环中仍未得到充分探索。

本文报告了一项分为两个实验的实证研究。实验 1 在来自
LongMemEval 的 116 个问题样本上比较了 grep 和向量检索，使用了
自定义智能体 harness（Chronos）和提供商原生 CLI harnesses
（Claude Code、Codex 和 Gemini CLI），同时针对内联工具结果和
模型单独读取的基于文件的工具结果。实验 2 比较了仅 grep 和
仅向量检索，同时逐步混入更多无关的对话历史，使每个查询嵌入
在更多干扰材料中以及相关段落旁边。在 Chronos 和提供商 CLI 中，
grep 在我们的实验 1 比较中通常比向量检索产生更高的准确率；
同时，总体得分仍然强烈依赖于所使用的 harness 和工具调用风格，
即使底层对话数据相同。

[TOC]

## 1. 引言

现代 LLM 智能体越来越依赖 RAG 来在推理时访问外部知识
[Lewis et al., 2020; Gao et al., 2024]，使它们能够对远超出其
上下文窗口的语料库进行推理。通过工具调用，智能体发出搜索查询、
接收排序结果，并在产生答案前迭代细化其理解
[Yao et al., 2023; Schick et al., 2023; Qin et al., 2023]。
两种检索范式在这一领域占主导地位：语义向量搜索，将查询和
文档嵌入到共享的潜在空间中进行近似最近邻匹配
[Karpukhin et al., 2020]，以及词汇搜索（如 grep、BM25、正则表达式），
对原始文本执行精确或基于模式的匹配。虽然向量搜索已成为大多数
RAG 系统的默认选择[Gao et al., 2024; Wang et al., 2024]，但由于其
简单性、稳定性和低嵌入成本，词汇搜索在实践中仍被广泛使用
[Lin, 2019; Thakur et al., 2021]。然而，检索策略如何与端到端
agentic 工作流中的智能体架构和工具调用范式相互作用仍未得到
充分理解。

尽管 agentic 搜索的应用日益广泛
[Asai et al., 2024; Jiang et al., 2023; Trivedi et al., 2023]，
现有研究在很大程度上将检索策略评估与智能体架构分离。信息检索
社区已经广泛基准测试了词汇和密集检索方法
[Thakur et al., 2021; Luan et al., 2021; Formal et al., 2021]，
并在独立管道中研究了检索质量、分块和重排
[Gao et al., 2024; Wang et al., 2024]。然而，这些评估通常假设
一个固定的管道，其中检索到的文档被连接成提示，忽略了现代
agentic 系统所特有的迭代式、工具介导的检索循环
[Qin et al., 2023; Patil et al., 2023]。在实践中，智能体接收
排序列表但并不将其视为终态：它们决定搜索什么、发出多少查询，
以及检索结果是否足够或需要进一步细化，所有这些都由智能体
harness 及其工具调用接口调解
[Sumers et al., 2023; Wang et al., 2023]。此外，工具结果如何
呈现给模型——无论是内联注入上下文窗口还是写入智能体必须明确
读取的文件——引入了一个先前工作未检查的额外架构考虑因素。

与此同时，提供商原生 CLI 智能体（如 Anthropic 的 Claude Code、
OpenAI 的 Codex 和 Google 的 Gemini CLI）的出现创造了一类新的
agentic 系统，它们与自定义构建的 harness 有着根本不同
[Yang et al., 2024]。这些提供商 harness 将工具调用嵌入到基于
shell 的接口中，模型可以直接访问命令行执行工具如 grep，
而自定义 harness 和智能体 SDK 对工具调用循环、上下文构建和
结果格式化提供细粒度控制。检索策略有效性如何在这类架构上
不同的 harness 之间变化尚未得到研究。此外，检索质量一个
较少被审视的维度是语料库噪声的鲁棒性：随着无关文档与相关
文档的比例增加，检索策略可能以不同速率退化
[Liu et al., 2023]，理解这种扩展行为对于针对大型、噪声语料库
部署 RAG 系统至关重要。

本文旨在通过一项对配备工具的 LLM 智能体检索策略的实证研究
来弥补这些差距，通过实验组织（见第 4 节）。我们在自定义
harness（Chronos）和提供商原生 CLI harnesses（Claude Code、Codex、
Gemini CLI）上评估了词汇搜索和语义向量搜索，在标准内联上下文
传递和程序化基于文件的结果传递两种情况下。我们评估了多个 LLM
在 LongMemEval 基准测试的 116 个问题样本上，涵盖六类信息检索任务。
本文做出以下贡献：

1. **检索、harness 和呈现**：关于词汇和密集检索之间的选择
   如何与智能体编排层以及工具输出是通过内联还是文件呈现相结合的证据。
2. **噪声和规模**：当无关周围内容相对于任务相关材料增长时，
   端到端行为如何演变，包括检索器行为与更广泛的智能体循环之间的相互作用。
3. **智能体堆栈的异质性**：直接比较表明，即使底层文本语料库
   保持固定，检索有效性在架构上不同的 harness（自定义与提供商原生 CLI）
   之间并不稳定。



## 2. Agentic 系统中检索的概述

Agentic 系统中的检索指的是 LLM 智能体识别、执行和消费搜索操作
以回答用户查询的过程。与独立检索管道不同——其中固定查询与
文档索引匹配，顶部 $k$ 结果被连接成提示
[Lewis et al., 2020; Gao et al., 2024]——agentic 检索是迭代式的且由
智能体主导：模型决定搜索什么、发出多少查询，以及检索结果是否足够
或需要细化[Yao et al., 2023; Jiang et al., 2023; Asai et al., 2024]。
这个过程由两个设计维度共同决定端到端有效性：检索策略（词汇、语义
或混合）和智能体 harness（自定义或提供商原生）。

### 2.1 检索策略

Agentic 搜索系统的检索策略分为三大类：词汇、语义和混合。
每种在准确性、延迟、成本和对查询公式化的鲁棒性方面提供独特的权衡。

#### 词汇搜索

词汇检索方法对原始文本执行精确或基于模式的匹配。经典方法如 BM25
[Lin, 2019]通过词频和逆文档频率对文档评分，而 grep 搜索使用正则
表达式或子字符串匹配来定位包含特定关键词的段落
[Lumer et al., 2025]。词汇方法不需要嵌入模型或向量索引，除了
文本扫描本身之外几乎不产生计算成本。BEIR 基准测试表明 BM25 在
多样化的检索任务中保持竞争力的基线，在零样本设置中通常优于早期
密集检索模型[Thakur et al., 2021]。学习的稀疏表示如 SPLADE
[Formal et al., 2021]通过学习的词汇扩展查询和文档术语来扩展词汇
匹配，在保持稀疏表示的可解释性和效率的同时，弥合了精确匹配和
语义理解之间的差距。

#### 语义搜索

语义或密集检索将查询和文档编码为密集向量在共享嵌入空间中并检索
最近邻，最常见的方式是近似最近邻（ANN）搜索
[Karpukhin et al., 2020]。密集段落检索（DPR）通过在问答对问题上
训练双编码器建立这一范式，使得检索基于含义而非表面术语重叠
[Karpukhin et al., 2020]。RAG 系统通过将密集检索与生成模型耦合
来扩展这一点，允许检索器和生成器联合优化[Lewis et al., 2020]。
现代 RAG 管道通常使用预训练的嵌入模型在索引时对文档编码，在推理时
对查询编码，并带有可选的检索后重排来细化初始候选集
[Gao et al., 2024; Wang et al., 2024]。虽然语义搜索擅长处理释义和
语义相似性，但它引入了对嵌入模型质量、向量索引基础设施和索引
延迟的依赖，而词汇方法避免了这些。

#### 混合方法

混合检索结合词汇和语义信号以利用两种范式的优势。倒数排名融合（RRF）
[Cormack et al., 2009; Gulati et al., 2026]从独立的词汇和密集检索器
合并排名列表，无需分数校准。晚期交互模型如 ColBERT
[Khattab and Zaharia, 2020]计算查询和文档表示之间细粒度的 token 级
相似性，在单向量检索的效率和交叉编码器重排的表现力之间取得中间地带。
对稀疏和密集表示互补性的研究表明，词汇和语义方法经常检索不同的
相关文档，使它们的组合比单独使用任何一种更有效
[Luan et al., 2021]。在 agentic 设置中，当智能体可以访问词汇和
语义搜索工具并根据查询在它们之间选择时，混合检索也可以有机地出现。

### 2.2 Agent Harnesses

智能体 harness 是管理工具调用循环的环境层：它构建提示、调度工具调用、
接收结果，并决定是继续迭代还是产生最终答案。我们区分两类在对此
过程提供控制程度方面根本不同的 harnesses。

#### 自定义 Harnesses

自定义 harnesses 使用智能体框架、提供商开放 SDK 或自定义代码构建
[Yao et al., 2023; Sumers et al., 2023]。这些对 agentic 循环的每个阶段
提供细粒度控制：系统提示、工具定义、上下文构建、结果格式化和迭代
终止标准。ReAct 范式[Yao et al., 2023]是最广泛采用的自定义 harness 模式，
它将推理轨迹与工具动作交错。开发者可以实施领域特定的优化，如动态提示
（根据每个查询定制系统提示）、结果截断策略和检索段落的重排。
自定义 harness 还允许明确管理上下文窗口，例如通过在对话增长时
总结或丢弃早期的工具结果[MemTool, 2025; Packer et al., 2023]。
权衡是开发开销：构建和维护自定义 harness 需要大量的工程工作量和
提示工程、工具接口设计和上下文管理方面的专业知识。

#### 提供商原生 CLI Harnesses

提供商原生 CLI harnesses 将工具调用嵌入到基于 shell 的接口中，
模型可以直接访问系统工具[Yang et al., 2024; Chen et al., 2021]。
在这些环境中，智能体可以执行任意 bash 命令，包括 grep、find、cat 和
其他 Unix 工具，作为原生工具动作。harness 根据提供商的内部实现
管理上下文构建和迭代控制，这对用户来说基本是不透明的。提供商原生
harnesses 提供最小的设置成本并利用提供商的优化上下文工程，但牺牲了
自定义 harness 中可用的细粒度控制。值得注意的是，当 grep 作为原生
bash 工具可用时，「检索策略」和「智能体能力」之间的界限变得模糊：
智能体可以动态构造自己的 grep 命令，选择搜索词、标志和文件目标，
而不是被限制在预定义的搜索 API。

### 2.3 工具调用架构

与 harness 的选择正交，工具调用架构管理在执行搜索后如何将检索结果
传递给模型。这个设计维度对上下文窗口利用和智能体处理大型结果集的
能力有重要影响。工具调用方法模式实际上是一个上下文工程决策：
内联传递直接填充上下文窗口，而程序化传递将上下文构建委托给
智能体本身。

#### 标准（内联）

在标准工具调用架构中，搜索结果作为工具响应消息返回，追加到对话上下文中
[Schick et al., 2023; Qin et al., 2023; Patil et al., 2023]。
模型在上下文窗口内直接接收完整结果集，可以立即对其推理。这是大多数
LLM API 和自定义 harness 中原生函数调用的默认模式。主要优点是简单：
检索结果出现在对话中的内联，不需要在获取和生成之间的单独缓冲区、
路由层或后处理步骤。然而，大型结果集与系统提示、对话历史和先前的
工具结果竞争上下文窗口空间，造成上下文压力——一种有时被称为
*上下文腐烂*的现象——可能在长期任务中降低性能[Liu et al., 2023]。
一种缓解方法是在可能丢弃相关信息的情况下应用结果截断。

#### 程序化（基于文件）

在程序化工具调用架构中，搜索结果被写入磁盘，模型仅接收文件路径或
摘要指针[Packer et al., 2023; Lumer et al., 2025]。智能体必须然后采取
明确动作访问结果，这本身可以是一次搜索操作（例如在结果文件上 grep）
或完整读取（例如 cat、read_file）。这将检索结果大小与上下文窗口压力
解耦：任意大的结果集可以写入磁盘而不消耗上下文 token，直到智能体
明确读取它们。权衡是间接性：智能体必须执行额外的工具调用来访问结果，
这增加了延迟并需要模型理解基于文件的工作流程。程序化架构还支持
渐进式披露，智能体仅根据元数据或摘要读取结果子集，这是一种在内联
传递中不可能的智能体驱动的检索后过滤。



## 3. 方法论

我们的实验评估第 2 节定义的两个维度上的检索策略有效性。

### 3.1 任务和数据集

我们在 LongMemEval 基准测试的 116 个问题代表性子集上进行评估，
该基准测试测试智能体在跨越多个会话的长时间对话上回答问题的能力。
每个问题伴有特定类型的会话：一个或多个包含正确回答所需信息的 oracle 会话，
以及与查询无关的可变数量的干扰会话。问题涵盖六类：
知识更新（跟踪随时间的状态变化）、多会话（跨会话聚合信息）、
单会话助手（回忆模型生成的内容）、单会话偏好（用户个人偏好）、
单会话用户（用户陈述的事实）和时间推理（计算持续时间、排序事件和解析日期）。
所有对话轮次和提取的时间事件都本地存储，作为 grep 和向量搜索的语料库。

### 3.2 检索实现

#### 通过 Chronos 的结构化事件

我们的搜索层在每个问题的文件上操作，将 LongMemEval 对话轮次与使用
Chronos 预处理管道从转录本中提取的结构化时间事件序列化
[Chronos, 2026]。Chronos 针对长时间-horizon 对话记忆，通过将显著的
时间结构（包括明确日期、间隔和相关时间跨度）作为一等文本记录浮出水面，
与原始话语耦合，与 Chronos 强调结构化事件检索用于时间感知智能体的
设计一致[Chronos, 2026]。我们采用这个层有两个原因：

1. 我们的研究评估智能体的搜索技术，而不是其时间推理。
   LongMemEval 项目中有相当比例依赖于分散在许多轮次中的明确时间表达；
   将这些作为规范化记录浮出水面在紧凑的并行通道中，确保时间项目的成功
   反映智能体是否能够定位相关证据，而不是模型是否可以从碎片化提及中
   重建日期和间隔。
2. Chronos 的结构化事件提取镜像了长期记忆智能体在部署中会使用的预处理，
   因此实验设置反映了现实的生产配置，而不是仅为评估构建的人工配置。

#### 词汇搜索（Grep）

grep 检索工具将对话轮次和提取的时间事件从每个问题的文件加载到内存中，
并对原始文本字段执行正则表达式（regex）匹配。结果按匹配计数评分并返回。
该实现不需要嵌入模型、向量索引或外部服务：所有匹配都是对本地文件的
进程内执行。

#### 语义搜索（向量）

向量搜索工具在摄入时填充的搜索索引上查询。每个对话轮次和时间事件都被
嵌入并存储在具有版本化模式的每个问题索引中。在查询时，该工具嵌入自然
语言查询并使用近似最近邻搜索检索最相关的结果。重排步骤在返回顶部 $k$
结果之前对检索到的段落重新评分，其中 $k$ 由智能体选择
[Gao et al., 2024]。

### 3.3 Agent Harnesses

#### 自定义 Harness

我们的自定义 harness Chronos 使用 LangChain 实现智能体，访问四个搜索工具
（对轮次和事件的 grep 和向量搜索）。此外，在程序化模式下启用了一个 grep 工具。
这些工具根据实验配置启用或禁用。按照 Chronos 对长期记忆智能体的设计
[Chronos, 2026]，我们使用动态提示：系统指令、搜索提示和工具使用指导取决于
检测到的问题类别（例如，时间推理与偏好回忆），而不是所有项目的单一静态
系统提示。因此，智能体在每个 episode 开始时获得类别条件指导，然后在工具
调用循环开始之前获得初始的广泛上下文块（顶部 15 个向量结果）。循环继续
直到模型产生最终答案。

#### 提供商原生 CLI Harnesses

我们评估三个提供商原生 CLI 智能体[Yang et al., 2024]。
每个接收问题并动态生成搜索策略，并且可以通过绝对路径调用 bash 可调用的
grep 和向量搜索包装脚本。在标准模式下，进程在沙箱中生成以确保模型只能
访问相关文件。

### 3.4 工具调用架构

#### 标准（内联）

在标准模式下，搜索脚本将结果直接打印到 stdout。对于 Chronos harness，
结果作为工具响应消息注入到对话上下文中。对于 CLI harnesses，stdout 由
shell 接口追加到智能体的工作上下文。结果与系统提示和对话历史竞争
上下文窗口空间。

#### 程序化（基于文件）

在程序化模式下，所有结果都被写入文件，智能体可以访问该文件。
然后文件被智能体读取或搜索以访问完整结果。这将检索结果大小与
上下文压力解耦，并强制智能体明确选择要消费的结果[Packer et al., 2023]。

### 3.5 模型

我们评估了五个 LLM 和一系列能力级别：Claude Opus 4.6 和
Claude Haiku 4.5、GPT-5.4，以及 Gemini 3.1 Pro 和 Gemini 3.1 Flash-Lite。

### 3.6 评估

按照 LongMemEval 基准测试论文[LongMemEval, 2025]中指定的评估协议，
我们使用辅助 LLM 评分器评估每个模型假设。我们实例化了 GPT-4o 作为
度量模型：对于每个问题，评分器接收问题文本、参考答案字段和智能体的假设，
并且必须在类别条件指令下输出二元判断（例如，对偏离一个的时间计数的容忍度、
偏好项的评分规则，以及对 `_abs` 变体的弃权处理）。我们报告准确率作为
评分器肯定回答的问题比例。在条件下保持评分器模型、提示模板和解码设置不变，
确保 harness、检索模式和会话限制设置之间的差异反映智能体管道的变化
而不是评估噪声。



## 4. 实验

### 4.1 实验 1：检索模式、Harness 和工具调用方法

#### 目标

我们隔离检索模式（仅 grep 与仅向量）、智能体 harness（Chronos 与
Claude Code 与 Codex 与 Gemini CLI）和工具调用方法（标准内联与程序化
基于文件）如何共同影响当完整每个问题的 haystack 暴露时的端到端长期记忆
问答准确率。析因设计回答词汇或密集检索在匹配的 harness 下是否有一致的
优势，以及将工具输出路由到文件而不是内联消息是否会改变该比较。

#### 实验设置

我们使用第 3 节中描述的 116 问题 LongMemEval-S 子集、语料库、grep 和
向量工具实现、harness 配置、模型和 GPT-4o 评分器。表 1 的每一行固定一个
harness-模型对，并按第 2.1-2.3 节定义的方式改变检索模式和工具调用方法。

#### 结果

表 1 报告了在 116 问题 LongMemEval-S 子集上的总体准确率（%），
覆盖 Chronos 处理的会话 JSON，具有完整的每个问题 haystack。
列交叉仅 grep 与仅向量检索与内联与程序化工具传递。

在内联传递下，词汇搜索始终比密集检索更强：内联 grep 在每个 harness-模型
对上超过内联向量。最大差距是 Chronos 与 Gemini 3.1 Flash-Lite
（86.2% 对 62.9%），最小差距是 Claude Code 与 Claude Opus 4.6
（76.7% 对 75.0%）。在 Chronos 上，内联 grep 在主干间跨越
83.6%--93.1%，而内联向量跨越 62.9%--83.6%。相同的 Claude Opus 4.6
主干在 Chronos 下达到 93.1% 但在 Claude Code 下达到 76.7%，
因此改变 harness 会以与在固定 harness 内交换检索器相当的幅度改变天花板。

Codex 与 GPT-5.4 持平最强的 Chronos 内联 grep（93.1%），
而其内联向量准确率为 75.9%。程序化传递重新安排了比较：
程序化向量在五个 harness-模型对上超过程序化 grep（Chronos 与
Claude Opus 4.6；Claude Code 与 Claude Opus 4.6；Codex 与 GPT-5.4；
Gemini CLI 与 Gemini 3.1 Flash-Lite；Gemini CLI 与 Gemini 3.1 Pro），
而程序化 grep 在其他 Chronos 主干和 Claude Code 与 Claude Haiku 4.5 上
保持更高。最剧烈的回归是 Codex 与 GPT-5.4，从内联 grep 下的 93.1%
下降到程序化 grep 的 55.2%，同一对的程序化向量为 67.2%。其他显著的
差距包括 Claude Haiku 4.5 在 Claude Code 上（内联 grep 55.2% 对向量 44.0%，
以及程序化 37.1% 对 32.8%）和 Gemini 3.1 Flash-Lite 在 Gemini CLI 上
（内联 87.1% 对 67.2%；程序化 68.1% 对 74.1%，这是在该 harness 上
程序化传递下向量领先少数情况之一）。完整数值网格见表 1。

**表 1**：实验 1。116 问题 LongMemEval-S 子集上的总体准确率（%）。
我们报告了标准和程序化工具调用配置的结果。

| 模型                | Harness     | grep | vector | grep 程序化 | vector 程序化 |
|  | -- | - |  | -- |  |
| Claude Opus 4.6    | Chronos     | 93.1 | 83.6   | 80.2        | 81.9         |
| Claude Opus 4.6    | Claude Code | 76.7 | 75.0   | 68.1        | 79.3         |
| Claude Haiku 4.5   | Chronos     | 83.6 | 76.7   | 83.6        | 81.9         |
| Claude Haiku 4.5   | Claude Code | 55.2 | 44.0   | 37.1        | 32.8         |
| GPT-5.4            | Chronos     | 89.7 | 81.9   | 87.1        | 75.0         |
| GPT-5.4            | Codex CLI   | 93.1 | 75.9   | 55.2        | 67.2         |
| Gemini 3.1 Pro     | Chronos     | 91.4 | 82.8   | 79.3        | 76.7         |
| Gemini 3.1 Pro     | Gemini CLI  | 81.9 | 75.0   | 81.0        | 82.8         |
| Gemini 3.1 Flash-Lite | Chronos  | 86.2 | 62.9   | 85.3        | 72.4         |
| Gemini 3.1 Flash-Lite | Gemini CLI | 87.1 | 67.2   | 68.1        | 74.1         |

Chronos harness（仅 grep，程序化工具调用方式，完整 haystack）的
按类别准确率见附录。

#### 讨论

综上所述，析因布局提示两个解释要点。首先，LongMemEval 奖励恢复
文字见证人：精确的日期、计数、偏好和跨度，这些在 token 化下通常保持稳定。
词汇工具浮出水面那些字符串没有嵌入瓶颈，这可以解释为什么内联 grep
在表 1 中是一个强有力的默认。按类别的结果细分见附录。

其次，「检索模式」不是孤立测量的：harness 塑造系统提示、工具描述和
命中如何呈现回聊天，所有这些都影响模型如何调度查询和决定何时停止。
因此，相同的基础模型在跨 harnesses 的非常不同的框架下运作，这可能
促成了表 1 中观察到的 harness 级别的转变。

程序化传递将任务从「读取工具消息」更改为「定位、打开和整合工件」。
当第二个阶段脆弱时，准确率可能会独立于检索质量崩溃，这有助于解释
为什么程序化条件在索引没有任何变化的情况下重新排序了 grep--向量比较。
实际含义是 agentic 论文应该同时报告检索机制和传递路径，因为基于文件的
路由本身就是一种工具使用压力测试。

词汇和密集搜索在智能体循环中优化不同的失败模式，而不仅仅是在排名指标中。
Grep 故意狭窄：它奖励模型生成高精度模式，但惩罚词汇不匹配——如果智能体
从未猜到独特的子字符串，就不会检索到任何内容。密集检索故意广泛：它可以
发现释义和斜述提及，但它也提升了在主题上与问题有重叠的语义「接近」
干扰物，这在智能体发出短或未指定查询时很重要。表 1 与一种情况一致，
其中 LongMemEval 的答案通常由一小部分文字跨度授权，因此当命中被内联
注入并立即可操作时，词汇匹配的精度偏见获胜。

将相同的主干（例如 Claude Opus 4.6）在 Chronos 和提供商 CLI 之间移动
会以与在固定 harness 内交换检索器相当的幅度改变准确率。一种阅读方式是
harness 不是被动基础设施：Chronos 的类别条件提示和受控工具表面区域
塑造了首先搜索什么以及如何修复失败，而 CLI 智能体继承提供商特定的工具
人体工程学、沙箱化和转录格式化。换句话说，表 1 中的「检索」实际上是
检索加编排。这是对基准测试的建设性建议：仅在静态管道中报告 BM25 与 ANN
会低估智能体脚手架引入的方差。

基于文件的传递通常被动机为缓解上下文压力，这应该不成比例地有益于
内联向量转储拥挤窗口的设置。我们确实看到程序化向量在多行上超过
程序化 grep。然而，相同的机制可以反转：如果模型努力完成读取-整合-重试
循环，收益永远不会到达答案层。极端的 Codex/GPT-5.4 程序化 grep 回归是
一个有用的警示故事：廉价检索（本地 JSON 上的正则表达式）如果不是将每个
命中变成栈无法可靠执行的多步骤工作流程，也不是「简单」的端到端。这建议了
一个设计权衡：程序化路由用组合工具能力换取上下文带宽；收益只有在智能体
可靠地关闭循环时才能实现。

Claude Haiku 4.5 在 Claude Code 上的行显示了特别大的内联 grep--向量差距。
没有 trace 级因果归因， plausible hypothesis 是较弱模型在迭代查询细化和
重排器感知阅读方面不太一致，这比模式触发的词汇恢复更伤害密集检索，
而证据确实存在。如果是这样，「默认为向量」的建议应该以主干强度和任务
是否奖励文字跨度恢复与概念混合为条件：这是总排行榜比较经常模糊的细微差别。

### 4.2 实验 2：随噪声增加而扩展的上下文

#### 目标

实验 2 询问当模型暴露于更多来自相同每个问题捆绑的会话时，词汇和密集
检索如何发散，而不是仅仅记录当更多无关对话存在时准确率下降。
长期记忆问答将 oracle 会话与干扰物交织；随着在固定采样协议下会话限制增加，
两个检索器都看到额外的无关材料。我们保持工具传递约定不变，
扫过一个离散的网格设置，并在报告中配对仅 grep 和仅向量表，
以便每列反映两个检索器系列的相同干扰物暴露，而不是单个完整 haystack 快照。

#### 实验设置

为了在 oracle 证据周围积累无关会话时对鲁棒性进行压力测试，
我们改变了每个问题的会话限制，实例化标记为 s5、s10、s20、s30 和 full
的配置，其中 full 表示完整的 haystack（每个项目 39-66 个会话）。
回答所需的 oracle 会话始终保留；直到活动限制的剩余槽位从同一每个问题
捆绑中的其他会话填充的干扰物中采样。我们使用第 3 节中的任务、模型、
harness 和工具。我们报告了实验 1 中评估的每个模型和 harness 在
标准 grep 和标准向量搜索上的结果。

![图 1：随噪声添加到检索池时，平均性能变化。
两种方法都面临最小的退化，但 GREP 平均优于向量。](.images/is-grep-all-you-need/fig1.png)

#### 结果

表 2 和表 3 在会话限制配置上配对仅 grep 和仅向量总体准确率（%）
在 116 问题子集上。Chronos 使用仅 grep 或仅向量检索 harness；
Claude Code 和 Gemini CLI 使用相同语料库上的 bash 搜索。
Codex 向量行仅在 full 完成；中间配置待定。

Grep 准确率不是单调的：Chronos Opus 在 s20 上升到 90.5%，
在 s30 下降到 85.3%，然后在 full 达到 89.7%；Claude Code Opus
在 s20 达到峰值（95.7%）但在 full 结束于 94.0%；
Gemini CLI Pro 在 s30 最低（74.7%）。在 s5，Chronos grep 在主干间
跨越 83.2%--89.7%，而相同配置的 Chronos 向量跨越 87.9%--94.0%。
向量轨迹在不同的配置达到峰值：Chronos Opus 在 s10 最高（94.8%），
在 s30 最低（84.5%），在 full 为 92.2%；Claude Code Opus 在 s10 最弱
（72.4%）在 s30 最好（78.4%）。检索器排序取决于 harness：
Claude Code 在每个配置的 Opus 和 Haiku 上青睐 grep，Gemini CLI Pro 始终
青睐向量，Chronos 显示随着更多会话包含的交叉（例如，Opus 从 s5--s20
和 full 时向量领先，但在倒数第二个限制：85.3% 对 84.5% 时 grep 领先）。
在 Chronos 的 full 上，Gemini 3.1 Pro 是后期逆转的例子：grep 达到 86.6%
而向量为 84.5%，尽管向量在 s5--s20 具有竞争力或更强。然而在 Gemini CLI
下，Gemini 3.1 Pro 在每个配置上保持向量领先，grep--向量差距扩大到
full 时的 89.7% 对 78.5%。对于 Flash-Lite，Chronos 在 grep 和向量之间
显示混合交叉，而两个 Gemini CLI Flash-Lite 轨迹相对 Opus 保持相对平坦。
完整网格出现在表 2 和表 3 中。

**表 2**：实验 2（仅 grep）：116 问题子集上按会话限制配置的总体准确率（%）。

| 模型                | Harness    | s5  | s10 | s20 | s30 | full |
|  | - |  |  |  |  | - |
| Claude Opus 4.6    | Chronos    | 89.3| 89.7| 90.5| 85.3| 89.7 |
| Claude Opus 4.6    | Claude Code| 91.4| 94.0| 95.7| 90.5| 94.0 |
| Claude Haiku 4.5   | Chronos    | 83.7| 84.5| 86.2| 85.3| 83.6 |
| Claude Haiku 4.5   | Claude Code| 89.7| 87.1| 83.6| 80.2| 81.9 |
| GPT-5.4            | Chronos    | 83.2| 82.8| 81.9| 78.5| 78.5 |
| Gemini 3.1 Pro     | Chronos    | 86.2| 86.6| 87.4| 82.2| 86.6 |
| Gemini 3.1 Pro     | Gemini CLI | 78.1| 78.5| 79.2| 74.7| 78.5 |
| Gemini 3.1 Flash-Lite | Chronos  | 88.8| 89.2| 90.0| 84.8| 89.2 |
| Gemini 3.1 Flash-Lite | Gemini CLI| 70.4| 70.7| 71.3| 67.2| 70.7 |

**表 3**：实验 2（仅向量）：按会话限制配置的准确率（%）。

| 模型                | Harness    | s5  | s10 | s20 | s30 | full |
|  | - |  |  |  |  | - |
| Claude Opus 4.6    | Chronos    | 94.0| 94.8| 92.2| 84.5| 92.2 |
| Claude Opus 4.6    | Claude Code| 77.6| 72.4| 75.0| 78.4| 72.4 |
| Claude Haiku 4.5   | Chronos    | 87.9| 89.7| 90.5| 87.1| 87.9 |
| Claude Haiku 4.5   | Claude Code| 50.0| 47.4| 50.9| 48.3| 44.0 |
| GPT-5.4            | Chronos    | 88.8| 94.0| 86.2| 82.8| 82.8 |
| Gemini 3.1 Pro     | Chronos    | 92.2| 91.4| 87.1| 85.3| 84.5 |
| Gemini 3.1 Pro     | Gemini CLI | 84.5| 83.6| 82.8| 85.3| 89.7 |
| Gemini 3.1 Flash-Lite | Chronos  | 88.8| 88.8| 87.9| 88.8| 83.6 |
| Gemini 3.1 Flash-Lite | Gemini CLI| 69.8| 69.8| 76.7| 70.7| 74.1 |

#### 讨论

一种常见的从业者直觉认为，词汇搜索在小语料库上足够但在规模上崩溃，
而更表达性的语义搜索在语料库大小增长时变得必要。我们的扩展研究部分
支持这一点——向量检索在低会话计数时通常更强——但揭示了交叉点取决于
harness 和主干而不是仅取决于语料库大小。因此，扩展研究最有用于作为
交互的压力测试：检索族不会随着「噪声增加」而平行退化；它们与
(i) 如何为每个会话限制配置重新采样干扰物、(ii) harness 特定的工具转录本和
(iii) 模型关于何时停止搜索的隐式策略相互作用。

一个有用的抽象是密集检索倾向于在嵌入空间中探索邻域：它可以恢复
间接提及，但也随着会话积累承认主题假朋友。词汇检索倾向于利用表面线索：
它对措辞脆弱，但当智能体发现区分性模式时它可以非常精确。
Chronos 扩展网格——向量通常在较小的会话限制时更强，但 grep 可以在以后
关闭或超越，取决于主干和列——与一个故事一致，其中语义检索在捆绑仍然
可管理时购买早期覆盖，而正则表达式风格的证据在智能体必须在已经消耗
工具预订的转录 tokens 的工作流下从针分离 haystack 时变得相对稳定。
我们这样陈述作为一个假设：我们的表格没有隔离查询字符串或检索集，
但定性交叉很难解释如果「噪声」是一维单调的。

Claude Code 上 Opus/Haiku 的持续 grep 优势和 Gemini CLI 上 Gemini 3.1 Pro
的持续向量优势暗示了由提供商工具引入的稳定归纳偏差：默认提示、stdout
如何分块成转录、工具错误表面，甚至 CLI 智能体措辞搜索的文化默认值。
这提醒「grep」在生产中很少是单一的原始值——它是 grep 加 shell 加提示。
供应商稳定模式在科学上有趣，因为它们意味着 CLI 堆栈之间的迁移在磁盘上的
语料库字节相同的情况下不是检索可互换的。

由于干扰物在会话限制改变时重新绘制，中网格峰值不需要指示「30 个会话
比 20 个更容易」在任何绝对意义上；它们可以指示特定采样的干扰物集与
智能体搜索轨迹之间的有利干扰。这不会降低配对比较：grep 和 vector 仍然
面对每个配置的相同采样捆绑。它确实意味着扩展曲线应该被读作随机外循环的
样本，而不是平滑容量定律。

最后，不完整的行（Codex 向量中间体；尚无 Codex grep 扩展行）意味着我们
尚无法声明供应商完整的图片，说明「CLI grep」与「CLI vector」在匹配上限下
相对于干扰物的老化情况。在这些行存在之前，最强的跨实验声明是有条件的：
第 4.1 节在异构 harness 下的完整 haystack 建立大的端到端差异；
第 4.2 节显示 grep--向量排序在扩展下不保留，即使干扰物采样是配对的，
但那种不保留的形状仍然取决于观察哪个堆栈。



## 5. 局限性

从概念上讲，我们的结论与长期记忆会话问答相关：问题基于多会话聊天、
明确时间表达和个人/用户事实。词汇工具可能在这里不成比例地有帮助，
因为答案通常在文字跨度上授权；在证据很少是文字的领域（例如，对释义
摘要的科学综合、视觉重的文档或代码语义），密集检索和混合路由可能
看起来不同。我们不声称 grep「击败」向量一般，而只是说它可以在我们
研究的任务分布和语料库上赢得端到端。



## 6. 结论和未来工作

随着 LLM 智能体承担越来越复杂的 agentic 工作流程，自主检索信息、调用工具
并对大型语料库进行推理，检索策略的选择与智能体架构和工具调用范式的
相互作用方式在现有文献中尚未得到系统性比较。实践维度如工具输出如何
呈现给模型，以及当搜索需要处理更多无关周围文本时性能如何变化，
在智能体循环中仍未得到充分探索。

在本文中，我们报告了一项分为两个实验的实证研究。实验 1 在来自
LongMemEval 的 116 个问题样本上比较了 grep 和向量检索，跨越四个 harness：
一个自定义智能体 harness（Chronos）和三个提供商原生 CLI harnesses
（Claude Code、Codex 和 Gemini CLI），在两种内联工具结果和模型单独读取的
基于文件工具结果下。实验 2 比较了仅 grep 和仅向量检索，同时逐步混入更多
无关的对话历史，使每个查询嵌入在更多干扰材料中以及相关段落旁边。

在 Chronos 和提供商 CLI 中，grep 在我们的比较中始终比向量检索产生更高的
准确率，内联 grep 在每个我们评估的 harness-模型对上超过内联向量。
同时，总体得分强烈依赖于所使用的 harness 和工具调用风格，即使底层对话
数据相同，基于文件的传递和提供商 CLI shell 可以反转或消除词汇优势而对
语料库没有任何更改。这些结果强调检索机制、harness 编排和传递路径作为
单一联合评估的系统而不是独立的设计选择，激励未来在混合检索策略、
非聊天语料库和更广泛的供应商覆盖方面开展工作，以澄清智能体何时应该
使用词汇相比语义搜索。



## 参考文献

* Lewis, P., et al. (2020). Retrieval-Augmented Generation for
  Knowledge-Intensive NLP Tasks. NeurIPS.

* Gao, Y., et al. (2024). Retrieval-Augmented Generation for Large
  Language Models: A Survey. arXiv:2312.10997.

* Wang, X., et al. (2024). Searching for Best Practices in Retrieval-Augmented
  Generation. arXiv:2407.01219.

* Thakur, N., et al. (2021). BEIR: A Heterogeneous Benchmark for Zero-shot
  Evaluation of Information Retrieval Models. NeurIPS.

* Karpukhin, V., et al. (2020). Dense Passage Retrieval for Open-Domain
  Question Answering. EMNLP.

* Lin, J. (2019). The Neural Hype and Comparisons Against Weak Baselines.
  SIGIR Forum.

* Formal, T., et al. (2021). SPLADE v2: Sparse Lexical and Expansion Model
  for Information Retrieval. arXiv:2109.10086.

* Khattab, O. & Zaharia, M. (2020). ColBERT: Efficient and Effective Passage
  Search via Contextualized Late Interaction over BERT. SIGIR.

* Cormack, G., et al. (2009). Reciprocal Rank Fusion Outperforms Condorcet and
  Individual Rank Learning Methods. SIGIR.

* Luan, Y., et al. (2021). Sparse, Dense, and Attentional Representations for
  Text Retrieval. TACL.

* Gulati, A., et al. (2026). From Rows to Reasoning: A Retrieval-Augmented
  Multimodal Framework for Spreadsheet Understanding. arXiv:2601.08741.

* Yao, S., et al. (2023). ReAct: Synergizing Reasoning and Acting in Language
  Models. ICLR.

* Schick, T., et al. (2023). Toolformer: Language Models Can Teach Themselves
  to Use Tools. NeurIPS.

* Qin, Y., et al. (2023). ToolLLM: Facilitating Large Language Models to Master
  16000+ Real-world APIs. ICLR.

* Patil, S., et al. (2023). Gorilla: Large Language Model Connected with Massive
  APIs. arXiv:2305.15334.

* Qin, Y., et al. (2023). Tool Learning with Foundation Models.
  arXiv:2304.08354.

* Sumers, T., et al. (2023). Cognitive Architectures for Language Agents.
  arXiv:2309.02427.

* Wang, L., et al. (2023). A Survey on Large Language Model based Autonomous
  Agents. arXiv:2308.11432.

* Asai, A., et al. (2024). Self-RAG: Learning to Retrieve, Generate, and
  Critique through Self-Reflection. ICLR.

* Jiang, Z., et al. (2023). Active Retrieval Augmented Generation. EMNLP.

* Trivedi, H., et al. (2023). Interleaving Retrieval with Chain-of-Thought
  Reasoning for Knowledge-Intensive Multi-Step Questions. ACL.

* Liu, N., et al. (2024). Lost in the Middle: How Language Models Use Long
  Contexts. TACL.

* Packer, C., et al. (2023). MemGPT: Towards LLMs as Operating Systems.
  arXiv:2310.08560.

* Wu, D., et al. (2025). LongMemEval: Benchmarking Chat Assistants on Long-Term
  Interactive Memory. ICLR.

* Yang, J., et al. (2024). SWE-agent: Agent-Computer Interfaces Enable Automated
  Software Engineering. arXiv:2405.15793.

* Chen, M., et al. (2021). Evaluating Large Language Models Trained on Code.
  arXiv:2107.03374.

* Lumer, E., et al. (2025). Tool and Agent Selection for Large Language Model
  Agents in Production: A Survey. Preprints.

* MemTool (2025). MemTool: Optimizing Short-Term Memory Management for Dynamic
  Tool Calling in LLM Agent Multi-Turn Conversations. arXiv:2507.21428.

* Chronos (2026). Chronos: Temporal-Aware Conversational Agents with Structured
  Event Retrieval for Long-Term Memory. arXiv:2603.16862.



## 附录：按类别准确率

表 4 报告了 Chronos harness 下每个推理模型在仅 grep 检索、内联工具调用
方式和完整 haystack（n=116）下按 LongMemEval-S 类别的准确率。评分器：GPT-4o。

**表 4**：116 问题子集上每个推理模型在 Chronos harness（仅 grep）
完整 haystack 下按类别的准确率（%）。评分器：GPT-4o。

| 模型                | KU  | MS  | SS-A | SS-P | SS-U | TR  |
|  |  |  | - | - | - |  |
| Claude Opus 4.6    | 94.4| 83.9| 100.0| 100.0| 87.5| 87.1|
| Claude Haiku 4.5   | 83.3| 71.0| 100.0| 85.7 | 87.5| 87.1|
| GPT-5.4            | 77.8| 74.2| 92.3 | 85.7 | 93.8| 67.7|
| Gemini 3.1 Pro     | 88.8| 69.3| 100.0| 85.7 | 81.3|100.0|
| Gemini 3.1 Flash-Lite | 94.3|72.6|100.0|100.0| 81.3|100.0|

**类别说明**：KU=知识更新，MS=多会话，SS-A=单会话助手，
SS-P=单会话偏好，SS-U=单会话用户，TR=时间推理。



*论文原文：arXiv:2605.15184 [cs.CL]*