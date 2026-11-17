# WorldAsGame.com

海外网站项目。域名已购买，以后用 **WorldAsGame.com**。

这里存放产品决定，以及已经开始的网站外壳。外壳可以在本机打开，还没有数据库、账户和剧情。

本机预览：`npm run dev`，然后打开 `http://127.0.0.1:3000`。默认进入英文首页，顶栏可以切换中文。

账户已经可以注册、验证邮箱、登录、改名字、退出，以及申请删除。没有配置邮件服务时，验证链接只出现在开发页面上。数据库默认写在本机 `.data/`，设置 `DATABASE_URL` 后改用 Neon。

内部项目仍叫梦游迹，代码在旁边的小程序仓库里。小程序继续用微信云开发，不因为这个域名改数据库。

## 文档

| 文件 | 内容 |
|---|---|
| [docs/direction.md](docs/direction.md) | 产品、市场、定价、品牌与作品怎么分开 |
| [docs/episode-01.md](docs/episode-01.md) | 英语第一集：一个选择、一次拍照、停在付费前 |
| [docs/web-v1.md](docs/web-v1.md) | 第一版网站做什么、不做什么 |
| [docs/hosting.md](docs/hosting.md) | 低成本托管，以及和小程序的边界 |
| [docs/decision-log.md](docs/decision-log.md) | 已排除的名称和已确认的做法 |
| [docs/site-framework.md](docs/site-framework.md) | 网站外壳方案。剧情以后再装 |

作品工作标题是 The Other Side。主角名 Jordan Hale、姓氏 Evelyn Carter 仍待确认。确认前不写对白定稿，不开始开发。
