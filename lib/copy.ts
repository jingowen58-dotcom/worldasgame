import type { Locale } from "@/lib/i18n";

export type Copy = {
  meta: { title: string; description: string };
  nav: {
    discover: string;
    explore: string;
    about: string;
    help: string;
    login: string;
    signup: string;
    library: string;
    account: string;
  };
  footer: { privacy: string; terms: string; refund: string; domain: string };
  home: {
    heroA: string;
    heroB: string;
    enter: string;
    scroll: string;
    featured: string;
    start: string;
    chips: string[];
    clips: string[];
    howLead: string;
    learnMore: string;
    realityTitle: string;
    realityBody: string;
    aboutCta: string;
    exploreMore: string;
    eyebrow: string;
    title: string;
    lead: string;
    ideaTitle: string;
    ideas: string[];
    flagshipEyebrow: string;
    flagshipTitle: string;
    flagshipBody: string;
    discoverTitle: string;
    howTitle: string;
    steps: { title: string; body: string }[];
    aboutTitle: string;
    aboutBody: string;
    listTitle: string;
    listBody: string;
  };
  common: {
    comingSoon: string;
    notOpen: string;
    draftNotice: string;
    backHome: string;
  };
  discover: { title: string; lead: string };
  world: {
    title: string;
    body: string;
    missingTitle: string;
    missingBody: string;
    episodes: string;
    preview: string;
    locked: string;
  };
  auth: {
    loginTitle: string;
    signupTitle: string;
    forgotTitle: string;
    resetTitle: string;
    forgotLink: string;
    email: string;
    password: string;
    newPassword: string;
    displayName: string;
    timezone: string;
    submitLogin: string;
    submitSignup: string;
    sendReset: string;
    save: string;
    logout: string;
    deleteAccount: string;
    hasAccount: string;
    noAccount: string;
    sent: string;
    forgotSent: string;
    resetDone: string;
    verified: string;
    verifyFailed: string;
    devLink: string;
    saved: string;
    deletionDone: string;
    errors: Record<string, string>;
  };
  account: {
    title: string;
    profile: string;
    security: string;
    orders: string;
    settings: string;
    empty: string;
    signedOut: string;
  };
  library: { title: string; empty: string; owned: string; pending: string; notUnlocked: string };
  commerce: {
    placeOrder: string;
    loginToOrder: string;
    inLibrary: string;
    paymentClosed: string;
    orderPlaced: string;
    storyClosed: string;
  };
  checkout: {
    title: string;
    closed: string;
    successTitle: string;
    successBody: string;
    cancelTitle: string;
    cancelBody: string;
    pay: string;
    payNote: string;
    owned: string;
  };
  orderStatus: {
    PENDING: string;
    PAYMENT_PROCESSING: string;
    PAID: string;
  };
  pages: {
    aboutTitle: string;
    aboutBody: string[];
    helpTitle: string;
    helpBody: string[];
    privacyTitle: string;
    privacyBody: string[];
    termsTitle: string;
    termsBody: string[];
    refundTitle: string;
    refundBody: string[];
  };
  admin: {
    title: string;
    body: string;
    home: string;
    closed: string;
    login: string;
    publish: string;
    grant: string;
    reason: string;
    saved: string;
    granted: string;
    already: string;
    orders: string;
    confirm: string;
    confirmed: string;
    mailLog: string;
    mailLogged: string;
    mailSent: string;
    mailFailed: string;
    users: string;
    access: string;
    noAccess: string;
    revoke: string;
    eventLog: string;
    auditLog: string;
    errorLog: string;
    errorLabels: {
      api_failed: string;
      payment_failed: string;
      mail_failed: string;
    };
    auditLabels: {
      "order.paid": string;
      "entitlement.grant": string;
      "entitlement.revoke": string;
      "product.published": string;
      "price.changed": string;
    };
    eventLabels: {
      signup_completed: string;
      login_completed: string;
      order_created: string;
      payment_started: string;
      payment_confirmed: string;
    };
  };
  error: { title: string; body: string; retry: string };
  loading: string;
};

const en: Copy = {
  meta: {
    title: "World As Game",
    description: "Stories don't just happen on screen. They happen in your world.",
  },
  nav: {
    discover: "Stories",
    explore: "Explore",
    about: "About",
    help: "Help",
    login: "Log in",
    signup: "Create account",
    library: "Library",
    account: "Account",
  },
  footer: {
    privacy: "Privacy",
    terms: "Terms",
    refund: "Refunds",
    domain: "WorldAsGame.com",
  },
  home: {
    heroA: "Stories Don't Just Happen on Screen.",
    heroB: "They Happen in Your World.",
    enter: "Enter the Story",
    scroll: "Scroll to Explore",
    featured: "Featured Story",
    start: "Start the Journey",
    chips: ["6 Episodes", "Season 01", "Real-World Tasks"],
    clips: ["Trailer", "Episode 1 Preview", "Your Choice, Your Ending"],
    howLead: "A new entertainment experience that blends storytelling with the real world.",
    learnMore: "Learn More",
    realityTitle: "Reality-Integrated Interactive Storytelling",
    realityBody: "A new form of entertainment, where stories live beyond the screen.",
    aboutCta: "About World As Game",
    exploreMore: "Explore More Stories",
    eyebrow: "A new form of story",
    title: "The World Is Your Playground.",
    lead: "Enter a story. Make choices. Explore the real world. Change what happens next.",
    ideaTitle: "What this place is for",
    ideas: [
      "Enter a story instead of only watching one.",
      "Make a choice that the story keeps.",
      "Use a real-world action when a story asks for one.",
    ],
    flagshipEyebrow: "First story",
    flagshipTitle: "Parallel World: Anomaly Signal",
    flagshipBody: "A mysterious signal. A parallel world. And a journey that changes everything.",
    discoverTitle: "Worlds",
    howTitle: "How It Works",
    steps: [
      { title: "Watch the Story", body: "Watch the opening." },
      { title: "Make Choices", body: "Choose what happens next." },
      { title: "Explore the Real World", body: "Step outside the screen." },
      { title: "Discover the Truth", body: "Follow the signal." },
      { title: "Change the Story", body: "Your action changes the ending." },
    ],
    aboutTitle: "World As Game",
    aboutBody: "A site for interactive stories. The first one is still being written.",
    listTitle: "Accounts",
    listBody: "Create an account with email and a password. Until mail delivery is connected, the verification link is shown on the next screen.",
  },
  common: {
    comingSoon: "Coming soon",
    notOpen: "Not open",
    draftNotice: "This page is a draft. It is not a finished legal policy.",
    backHome: "Back to home",
  },
  discover: {
    title: "Discover",
    lead: "One story slot is reserved. It is not open.",
  },
  world: {
    title: "First story",
    body: "This page will hold the story when it is ready. There is no episode, choice, or task here yet.",
    missingTitle: "This world does not exist",
    missingBody: "There is no story at this address.",
    episodes: "Episodes",
    preview: "Preview",
    locked: "Not open",
  },
  auth: {
    loginTitle: "Log in",
    signupTitle: "Create account",
    forgotTitle: "Reset password",
    resetTitle: "Choose a new password",
    forgotLink: "Forgot password",
    email: "Email",
    password: "Password",
    newPassword: "New password",
    displayName: "Name",
    timezone: "Timezone",
    submitLogin: "Log in",
    submitSignup: "Create account",
    sendReset: "Send reset link",
    save: "Save",
    logout: "Log out",
    deleteAccount: "Request account deletion",
    hasAccount: "Already have an account?",
    noAccount: "Need an account?",
    sent: "Check your email to verify this account.",
    forgotSent: "If an account exists for that email, a reset link is ready.",
    resetDone: "Password updated. Log in with the new password.",
    verified: "Email verified. You can log in.",
    verifyFailed: "This verification link is no longer valid.",
    devLink: "Mail delivery is not connected. Open the verification link:",
    saved: "Saved.",
    deletionDone: "Deletion requested. You have been logged out.",
    errors: {
      ACCOUNT_EXISTS: "An account with this email already exists.",
      INVALID_EMAIL: "Enter a valid email address.",
      PASSWORD_TOO_SHORT: "Use at least 8 characters.",
      PASSWORD_TOO_LONG: "Use a shorter password.",
      INVALID_LOGIN: "Email or password is incorrect.",
      EMAIL_NOT_VERIFIED: "Verify your email before logging in.",
      ACCOUNT_CLOSED: "This account is closed.",
      INVALID_TOKEN: "This link is no longer valid.",
      RATE_LIMITED: "Too many attempts. Try again later.",
      generic: "Something went wrong. Try again.",
    },
  },
  account: {
    title: "Account",
    profile: "Profile",
    security: "Security",
    orders: "Orders",
    settings: "Settings",
    empty: "Log in to see this page.",
    signedOut: "You are not logged in.",
  },
  library: {
    title: "Library",
    empty: "Nothing is in your library yet.",
    owned: "Available",
    pending: "Order placed",
    notUnlocked: "This order is unpaid, so the story stays locked.",
  },
  commerce: {
    placeOrder: "Place order",
    loginToOrder: "Log in to place an order",
    inLibrary: "In your library",
    paymentClosed: "PayPal checkout is open. The story stays locked until the payment is confirmed.",
    orderPlaced: "Order placed. Continue to PayPal to pay.",
    storyClosed: "The story itself is not playable yet.",
  },
  checkout: {
    title: "Checkout",
    closed: "Place an order on the story page before paying.",
    successTitle: "Back from PayPal",
    successBody: "Opening this page does not unlock the story. Access is added only after the payment is confirmed.",
    cancelTitle: "Payment not finished",
    cancelBody: "No access was added. You can return to checkout and pay with PayPal.",
    pay: "Pay $9.99 with PayPal",
    payNote: "This opens PayPal for one payment of $9.99, described as Continue to play. Keep the quantity at 1.",
    owned: "You already have this story.",
  },
  orderStatus: {
    PENDING: "Awaiting payment",
    PAYMENT_PROCESSING: "Sent to PayPal",
    PAID: "Paid",
  },
  pages: {
    aboutTitle: "About",
    aboutBody: [
      "World As Game is a place to enter stories, not a catalog of finished games.",
      "The first story, accounts, and payments are still being built.",
    ],
    helpTitle: "Help",
    helpBody: [
      "There is no live support desk yet.",
      "If a page says it is not open, it does not save what you type.",
    ],
    privacyTitle: "Privacy",
    privacyBody: [
      "This site does not create accounts or store a mailing list yet.",
      "A finished privacy policy will be published before anyone can register or pay.",
    ],
    termsTitle: "Terms",
    termsBody: [
      "These terms are a placeholder.",
      "They will be replaced before the site sells anything.",
    ],
    refundTitle: "Refunds",
    refundBody: [
      "Nothing is for sale yet, so there is nothing to refund.",
      "A refund policy will be published before checkout opens.",
    ],
  },
  admin: {
    title: "Admin",
    body: "Publish one product and grant access. This does not take payment.",
    home: "Public site",
    closed: "This account cannot open the admin console.",
    login: "Log in with an admin account.",
    publish: "Publish product",
    grant: "Grant access",
    reason: "Reason",
    saved: "Product published.",
    granted: "Access granted.",
    already: "This account already has access.",
    orders: "Orders",
    confirm: "Confirm payment",
    confirmed: "Already confirmed",
    mailLog: "Mail log",
    mailLogged: "Not sent",
    mailSent: "Sent",
    mailFailed: "Failed",
    users: "Users",
    access: "Has access",
    noAccess: "No access",
    revoke: "Revoke access",
    eventLog: "Events",
    auditLog: "Audit",
    errorLog: "Errors",
    errorLabels: {
      api_failed: "API failed",
      payment_failed: "Payment failed",
      mail_failed: "Mail failed",
    },
    auditLabels: {
      "order.paid": "Payment confirmed",
      "entitlement.grant": "Access granted",
      "entitlement.revoke": "Access revoked",
      "product.published": "Product published",
      "price.changed": "Price changed",
    },
    eventLabels: {
      signup_completed: "Signed up",
      login_completed: "Logged in",
      order_created: "Order placed",
      payment_started: "Went to PayPal",
      payment_confirmed: "Payment confirmed",
    },
  },
  error: {
    title: "This page failed to load",
    body: "The rest of the site is still available.",
    retry: "Try again",
  },
  loading: "Loading",
};

const zh: Copy = {
  meta: {
    title: "World As Game",
    description: "故事不只发生在屏幕里，也发生在你的世界里。",
  },
  nav: {
    discover: "故事",
    explore: "探索",
    about: "关于",
    help: "帮助",
    login: "登录",
    signup: "创建账户",
    library: "内容库",
    account: "账户",
  },
  footer: {
    privacy: "隐私",
    terms: "条款",
    refund: "退款",
    domain: "WorldAsGame.com",
  },
  home: {
    heroA: "故事不只发生在屏幕上。",
    heroB: "它发生在你的世界里。",
    enter: "进入故事",
    scroll: "向下探索",
    featured: "旗舰故事",
    start: "开始旅程",
    chips: ["6 集", "第一季", "现实任务"],
    clips: ["预告", "第一集预览", "你的选择，你的结局"],
    howLead: "一种把叙事和现实世界接在一起的新娱乐体验。",
    learnMore: "了解更多",
    realityTitle: "现实互动叙事",
    realityBody: "一种新的娱乐方式：故事活在屏幕之外。",
    aboutCta: "关于 World As Game",
    exploreMore: "探索更多故事",
    eyebrow: "一种新的故事",
    title: "世界是你的游乐场。",
    lead: "进入故事。做出选择。探索现实。改变接下来发生的事。",
    ideaTitle: "这个网站用来做什么",
    ideas: ["进入故事，而不只是观看。", "做出一个会被记住的选择。", "在故事要求时，完成一次现实中的行动。"],
    flagshipEyebrow: "第一部故事",
    flagshipTitle: "平行世界：异常信号",
    flagshipBody: "一个神秘信号。一个平行世界。一段会改变一切的旅程。",
    discoverTitle: "故事世界",
    howTitle: "如何进行",
    steps: [
      { title: "观看故事", body: "先看开场。" },
      { title: "做出选择", body: "选择会留在进度里。" },
      { title: "探索现实", body: "走到屏幕之外。" },
      { title: "发现真相", body: "顺着信号查下去。" },
      { title: "改变故事", body: "你的行动会改变结局。" },
    ],
    aboutTitle: "World As Game",
    aboutBody: "一个用来进入故事的网站。第一部故事还在写。",
    listTitle: "账户",
    listBody: "可以用邮箱和密码创建账户。在接上邮件服务之前，验证链接会显示在下一屏。",
  },
  common: {
    comingSoon: "即将开放",
    notOpen: "尚未开放",
    draftNotice: "这一页是草稿，还不是最终的法律文本。",
    backHome: "回到首页",
  },
  discover: {
    title: "发现",
    lead: "保留了一个故事位。它还没有开放。",
  },
  world: {
    title: "第一部故事",
    body: "故事准备好之后，会放在这一页。现在没有章节、选择或任务。",
    missingTitle: "没有这个世界",
    missingBody: "这个地址上没有故事。",
    episodes: "分集",
    preview: "预览",
    locked: "尚未开放",
  },
  auth: {
    loginTitle: "登录",
    signupTitle: "创建账户",
    forgotTitle: "重置密码",
    resetTitle: "设置新密码",
    forgotLink: "忘记密码",
    email: "邮箱",
    password: "密码",
    newPassword: "新密码",
    displayName: "名字",
    timezone: "时区",
    submitLogin: "登录",
    submitSignup: "创建账户",
    sendReset: "发送重置链接",
    save: "保存",
    logout: "退出",
    deleteAccount: "申请删除账户",
    hasAccount: "已经有账户？",
    noAccount: "还没有账户？",
    sent: "请查收邮件，验证这个账户。",
    forgotSent: "如果这个邮箱已有账户，重置链接已经准备好。",
    resetDone: "密码已更新。请用新密码登录。",
    verified: "邮箱已验证。现在可以登录。",
    verifyFailed: "这个验证链接已经失效。",
    devLink: "还没有接上邮件服务。打开这个验证链接：",
    saved: "已保存。",
    deletionDone: "已提交删除申请，并已退出登录。",
    errors: {
      ACCOUNT_EXISTS: "这个邮箱已经注册。",
      INVALID_EMAIL: "请输入有效的邮箱。",
      PASSWORD_TOO_SHORT: "密码至少 8 位。",
      PASSWORD_TOO_LONG: "密码太长。",
      INVALID_LOGIN: "邮箱或密码不正确。",
      EMAIL_NOT_VERIFIED: "请先验证邮箱再登录。",
      ACCOUNT_CLOSED: "这个账户已关闭。",
      INVALID_TOKEN: "这个链接已经失效。",
      RATE_LIMITED: "尝试次数太多，请稍后再试。",
      generic: "没有完成，请再试一次。",
    },
  },
  account: {
    title: "账户",
    profile: "资料",
    security: "安全",
    orders: "订单",
    settings: "设置",
    empty: "登录后才能查看这一页。",
    signedOut: "你还没有登录。",
  },
  library: {
    title: "内容库",
    empty: "内容库里还没有东西。",
    owned: "已获得",
    pending: "已下单",
    notUnlocked: "这张订单还没付款，所以故事仍然锁着。",
  },
  commerce: {
    placeOrder: "下单",
    loginToOrder: "登录后才能下单",
    inLibrary: "已在内容库",
    paymentClosed: "可以前往 PayPal 付款。在付款被确认之前，故事仍然锁着。",
    orderPlaced: "订单已建立。请继续到 PayPal 付款。",
    storyClosed: "故事本身还不能游玩。",
  },
  checkout: {
    title: "结账",
    closed: "请先在故事页下单，再付款。",
    successTitle: "已从 PayPal 返回",
    successBody: "打开这一页不会解锁故事。只有付款被确认之后，才会加入内容库。",
    cancelTitle: "付款没有完成",
    cancelBody: "没有加入任何权益。可以回到结账页，用 PayPal 付款。",
    pay: "用 PayPal 支付 $9.99",
    payNote: "这将打开 PayPal，支付一笔 $9.99，名称是 Continue to play。数量请保持为 1。",
    owned: "你已经拥有这个故事。",
  },
  orderStatus: {
    PENDING: "待付款",
    PAYMENT_PROCESSING: "已前往 PayPal",
    PAID: "已付款",
  },
  pages: {
    aboutTitle: "关于",
    aboutBody: [
      "World As Game 用来进入故事，不是一份已经完成的游戏目录。",
      "第一部故事、账户和付款都还在建设。",
    ],
    helpTitle: "帮助",
    helpBody: ["还没有在线客服。", "如果页面写着尚未开放，你输入的内容不会被保存。"],
    privacyTitle: "隐私",
    privacyBody: [
      "这个网站现在不创建账户，也不保存邮件名单。",
      "在任何人可以注册或付款之前，会发布正式的隐私说明。",
    ],
    termsTitle: "条款",
    termsBody: ["这些条款是占位文本。", "在网站开始销售之前，会换成正式条款。"],
    refundTitle: "退款",
    refundBody: ["现在没有在售商品，因此没有可退的款项。", "结账开放之前，会发布退款政策。"],
  },
  admin: {
    title: "管理后台",
    body: "可以发布一件商品，并发放访问权益。这里不会收款。",
    home: "回到网站",
    closed: "这个账户不能打开管理后台。",
    login: "请用管理员账户登录。",
    publish: "发布商品",
    grant: "发放权益",
    reason: "原因",
    saved: "商品已发布。",
    granted: "权益已发放。",
    already: "这个账户已经拥有权益。",
    orders: "订单",
    confirm: "确认到账",
    confirmed: "已经确认过",
    mailLog: "邮件记录",
    mailLogged: "未寄出",
    mailSent: "已寄出",
    mailFailed: "寄送失败",
    users: "用户",
    access: "有权益",
    noAccess: "无权益",
    revoke: "撤销权益",
    eventLog: "事件",
    auditLog: "审计",
    errorLog: "错误",
    errorLabels: {
      api_failed: "接口失败",
      payment_failed: "付款失败",
      mail_failed: "邮件发送失败",
    },
    auditLabels: {
      "order.paid": "确认到账",
      "entitlement.grant": "发放权益",
      "entitlement.revoke": "撤销权益",
      "product.published": "商品已发布",
      "price.changed": "价格已修改",
    },
    eventLabels: {
      signup_completed: "完成注册",
      login_completed: "登录",
      order_created: "下单",
      payment_started: "前往 PayPal",
      payment_confirmed: "确认到账",
    },
  },
  error: {
    title: "这一页没有载入",
    body: "网站的其他页面仍然可以打开。",
    retry: "再试一次",
  },
  loading: "正在载入",
};

const dictionaries: Record<Locale, Copy> = { en, zh };

export function getCopy(locale: Locale): Copy {
  return dictionaries[locale];
}
