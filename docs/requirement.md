# 需求分析

## 核心概念

- **习惯 (Habit/Goal):** 用户想要养成的长期行为或达成的目标。例如：“保持健康”、“提升工作效率”、“坚持学习”。
- **微行为 (Tiny Behavior / Action):** 隶属于某个“习惯”下的，具体的、极小的、可执行的步骤，通常与锚点关联。例如，在“保持健康”习惯下，可以有“饭后站立5分钟”、“睡前做一组拉伸”、“工作间隙喝一杯水”等多个微行为。

## 用例设计

**用例1: 新用户首次创建习惯并添加其第一个微行为**

- **用户:** 任何首次打开App的用户
- **目标:** 了解App，成功创建一个长期习惯，并为其添加第一个具体的微行为。
- **用户路径:**
    1. **启动App → 浏览【欢迎/引导页】** (理解核心理念，可选权限授予)。
    2. **进入【首页/今日行动列表页】** (此时为空状态，有“添加新习惯”的引导或按钮)。
    3. **点击“添加新习惯”按钮 → 进入【添加/编辑习惯页】。**
    4. **在【添加/编辑习惯页】：输入“习惯”名称** (例如：“增强体质”) → 点击“保存/创建”按钮。
    5. **自动跳转 (或引导用户点击进入) 至新创建的【习惯详情页：“增强体质”】。** (页面显示习惯名称“增强体质”，微行为列表为空，有“添加微行为”的提示/按钮)。
    6. **在【习惯详情页：“增强体质”】：点击“添加微行为”按钮 → 进入【添加/编辑微行为页】。** (此页面会显示当前操作是为“增强体质”习惯添加微行为)。
    7. **在【添加/编辑微行为页】：**
        - 输入“微行为”描述 (例如：“做10个俯卧撑”)
        - 选择/输入“锚点习惯” (例如：“在我早上刷完牙后”)
        - 设置“行动提示”
    8. **点击“保存微行为”按钮 → 返回【习惯详情页：“增强体质”】。** (新创建的微行为“做10个俯卧撑”显示在该习惯的微行为列表中)。
    9. **(可选)** 用户可以点击返回按钮或导航，回到【首页/今日行动列表页】。此时，如果该微行为符合今日执行条件，会显示在列表中。

**用例2: 用户为已存在的习惯添加新的微行为**

- **用户:** 已创建至少一个习惯的用户
- **目标:** 为某个已有的长期习惯补充新的具体执行步骤。
- **用户路径:**
    1. **打开App → 进入【首页/今日行动列表页】。**
    2. **通过导航入口 (如底部Tab) → 进入【习惯列表/概览页】。**
    3. **在【习惯列表/概览页】：找到并点击目标习惯** (例如：“阅读更多书籍”) → **进入该习惯的【习惯详情页：“阅读更多书籍”】。**
    4. **在【习惯详情页：“阅读更多书籍”】：点击“添加微行为”按钮 → 进入【添加/编辑微行为页】。** (此页面显示是为“阅读更多书籍”习惯操作)。
    5. **在【添加/编辑微行为页】：**
        - 输入新的“微行为”描述 (例如：“午休时阅读5分钟新闻摘要”)
        - 选择/输入“锚点习惯”
        - 设置“行动提示”
    6. **点击“保存微行为”按钮 → 返回【习惯详情页：“阅读更多书籍”】。** (新的微行为显示在列表中)。

**用例3: 用户完成今日某个微行为并打卡**

- **用户:** 任何已设定并在今日有待办微行为的用户
- **目标:** 标记已完成的特定微行为，并接收即时积极反馈。
- **用户路径:**
    1. **打开App → 进入【首页/今日行动列表页】。** (列表显示今日所有待办的微行为，并标明其所属习惯和锚点)。
    2. **找到已实际完成的特定“微行为”条目 → 点击其对应的“打卡”按钮/区域。**
    3. **触发并查看【微行为打卡后的即时反馈】** (例如，动画和鼓励语)。
    4. 该微行为在首页列表中的状态可能更新 (例如，标记为已完成)。

**用例4: 用户查看自己的行动历史/进度**

- **用户:** 已打卡一段时间的用户
- **目标:** 了解自己所有微行为的完成历史。
- **用户路径:**
    1. **打开App → 进入【首页/今日行动列表页】。**
    2. **通过导航入口 (如底部Tab) → 进入【简单进度/历史记录页】。**
    3. **在【简单进度/历史记录页】：查看日历标记或微行为打卡列表** (包含微行为名称、所属习惯、打卡时间等)。

**用例5: 用户编辑一个已存在的微行为**

- **用户:** 已创建微行为的用户
- **目标:** 修改某个特定微行为的描述、锚点或提醒设置。
- **用户路径:**
    1. **打开App → 导航至【习惯列表/概览页】→ 点击目标习惯 → 进入【习惯详情页】。**
    2. **在【习惯详情页】：找到目标“微行为”条目 → 点击其“编辑”入口/按钮。**
    3. **进入【添加/编辑微行为页】** (预填入该微行为的现有信息，并显示其所属习惯)。
    4. **修改微行为描述、锚点或提醒设置。**
    5. **点击“保存微行为”按钮 → 返回【习惯详情页】。** (微行为信息更新)。

**用例6: 用户删除一个微行为**

- **用户:** 已创建微行为的用户
- **目标:** 从某个习惯下移除一个不再需要的微行为。
- **用户路径:**
    1. **打开App → 导航至【习惯列表/概览页】→ 点击目标习惯 → 进入【习惯详情页】。**
    2. **在【习惯详情页】：找到目标“微行为”条目 → 点击其“删除”入口/按钮。**
    3. **App弹出确认删除提示 → 用户确认删除。**
    4. **该微行为从【习惯详情页】的列表中移除，并且不再出现在【首页/今日行动列表页】。**

**用例7: 用户编辑一个已存在的习惯名称/描述**

- **用户:** 已创建习惯的用户
- **目标:** 修改某个长期习惯的名称或描述信息。
- **用户路径:**
    1. **打开App → 导航至【习惯列表/概览页】→ 点击目标习惯 → 进入【习惯详情页】。**
    2. **在【习惯详情页】：找到编辑“习惯本身”的入口/按钮** (通常在页面顶部或菜单中)。
    3. **点击该入口 → 进入【添加/编辑习惯页】** (预填入当前习惯的名称/描述)。
    4. **修改习惯名称/描述。**
    5. **点击“保存”按钮 → 返回【习惯详情页】。** (习惯名称/描述更新)。

**用例8: 用户删除一个习惯 (及其下所有微行为)**

- **用户:** 已创建习惯的用户
- **目标:** 移除整个长期习惯及其关联的所有微行为。
- **用户路径:**
    1. **打开App → 导航至【习惯列表/概览页】→ 点击目标习惯 → 进入【习惯详情页】。**
    2. **在【习惯详情页】：找到删除“习惯本身”的入口/按钮。**
    3. **点击该入口 → App弹出确认删除提示** (明确告知将同时删除其下所有微行为)。
    4. **用户确认删除。**
    5. **该习惯及其所有微行为从系统中移除。用户可能被导航回【习惯列表/概览页】或【首页】。**