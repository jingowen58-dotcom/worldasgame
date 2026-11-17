# 第一集

> 工作标题：The Other Side  
> 网站：WorldAsGame.com  
> 状态：约束已定，正文是草案。人名和标题待确认。尚未开发。

这一集是一条不注册就能玩完的免费体验。六集正文、角色圣经、高保真页面都不在这里。

## 要发生的四件事

1. 收到一封来自自己的信，信里点了一个尚未出场的人。
2. 做一个会留下后果的选择。
3. 在自己所在的任何地方拍一张照片并提交。
4. 看到一张自己没拍过的照片，然后停住。

停住的问题是：照片里的人为什么好像过着我的生活。答案、记忆揭晓、Evelyn 本人出场，都在付费之后，这一集不写。

宣传句：

> Someone is living your life. And they know you're watching.

## 人物

第一集只出场两个人。

| 人物 | 用法 | 状态 |
|---|---|---|
| Jordan Hale | 玩家扮演的调查记者 | 人名待确认 |
| 另一个 Jordan | 只通过邮件和最后那张照片出现 | 同名同脸。这一集不证明他拥有玩家的记忆 |
| Evelyn Carter | 只在信里被点名，人不出现 | 姓氏待确认。付费后才出场 |

Noah、观察者、许知遥、零号不进入这一集。

## 开场

发件人是 Jordan 自己的地址。发送时间显示为三天后。正文只有一句：

> Do not trust Evelyn. She has already replaced you.

## 选择

两条路都进入同一个拍照任务。

| 标识 | 玩家看到的 | 后果 |
|---|---|---|
| `open_attachment` | 附件是一张没有人脸的街景，拍摄时间也是三天后 | `opened_first_attachment = true` |
| `leave_it_closed` | 邮件随后自己展开同一张街景 | `opened_first_attachment = false` |

这个变量只改任务前的一句态度，不改任务，也不改付费点。由服务端在选择时写入。

打开过附件：

> You opened it. The timestamp is three days from now. Either someone forged it, or you are already late.

没有打开：

> You left it closed. It opened anyway. Whoever sent this does not need your permission.

## 任务

标识：`photograph_anomaly`。

任何城市、室内或室外都可以完成。不采集位置。

任务前：

> The street in the attachment is ordinary. Too ordinary.  
> Photograph one detail around you that feels out of place.  
> Keep it. This is your evidence, not a test you can pass or fail.

完成规则：这一局提交了一张 jpeg、png 或 webp，不超过 8MB。服务端记下哈希。画面内容不影响通过。文案不能写「我们认出了某种颜色」。

不合格的文件留在任务页，可以再交。离开后任务还在。

提交成功后：

> Your photograph is in the file.  
> Then another image arrives. You did not take it.  
> It is your face, in a room you do not recognize. The message under it is only four words:  
> Now you are looking.

这里停。

## 付费页句子

接在上面这段之后。第一版可以做成未解锁占位，不接真实扣款。后面的正文不能发给浏览器。

> The truth is waiting.

> $9.99 · one-time unlock of Season 01.  
> This is a test price, not a subscription.

获得：

> The rest of Season 01.  
> The branches that follow this choice.  
> Every ending in this season.  
> The investigation tasks that belong to this season.

同时写明：

> Later seasons are not included.  
> This purchase does not renew.  
> Access follows the terms shown at checkout.

按钮：Unlock Season 01。

未付款离开后，再打开仍停在这张陌生照片上。

## 待确认

1. 主角是否就用 Jordan Hale。
2. 作品标题是否就用 The Other Side。
3. Evelyn Carter 这个姓是否保留。
