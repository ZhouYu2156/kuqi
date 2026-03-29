# 秘术云阁

愿景：打造全球华人精神网络家园

slogan：秘术云阁，让你在云端获得精神自由

## 内容定位

认知、秘术、资源、搞钱、破局

## 一、项目定位

- 名称：秘术云阁
- Slogan：认知破局 | 底层翻身 | 绝版资源 | 经验传承
- 风格：老式论坛怀旧风（浅色、素雅、宋体、经典绿）
- 内核：严肃、深度、复古、信任感

### 二、Nuxt 4 项目目录结构

```plaintext
/app
  /assets
    /styles
      global.scss       # 全局复古样式
      vars.scss     # 色值 + 变量
  /components
    Logo.vue            # 复古logo
    Nav.vue             # 顶部导航
    Footer.vue          # 页脚
    LoginModal.vue      # 登录弹窗
    PostItem.vue        # 帖子列表项
    ResourceCard.vue    # 资源卡片
  /pages
    index.vue           # 首页
    /forum
      index.vue         # 板块列表
      [id].vue          # 帖子详情
    /resource
      index.vue         # 资源列表
      [id].vue          # 资源详情
    /user
      login.vue
      register.vue
  /layouts
    default.vue         # 统一布局
  /public
    favicon.ico
```

## 2. 字体

- 标题：宋体 (SimSun)
- 正文：宋体 + 微软雅黑
- 复古感：字间距稍大、文字偏实、不纤细

## 3. 复古 UI 特征

- 浅灰底色
- 淡绿标题栏
- 灰色实线 / 虚线分割
- 直角边框
- 无圆角、无投影、无渐变
- 文字为主、极简排版
