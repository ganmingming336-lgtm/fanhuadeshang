# 彩票分析器 - 预测功能说明

## 新增功能概述

在 `lottery-analyzer.html` 中新增了**下一期预测 Top 10**功能，基于历史数据智能分析最可能出现的数字。

## 功能特点

### 1. 预测算法

预测指数（0-100分）由三个核心指标组成：

- **频率分数（40%权重）**
  - 基于历史出现频率
  - 出现次数越多，分数越高
  - 体现"热号延续"趋势

- **冷号反弹分数（30%权重）**
  - 基于距离上次出现的间隔
  - 超过平均间隔的号码获得反弹分数
  - 体现"冷号爆发"可能

- **均衡分数（30%权重）**
  - 基于频率的均衡性
  - 中等频率的号码获得额外分数
  - 体现"稳健选择"理念

### 2. 预测结果展示

#### Top 10 预测卡片
- **排名显示**：#1-#10，按预测指数降序
- **预测指数**：0-100分可视化进度条
- **热度分级**：
  - 🔴 红色（#1-#3）：最热预测
  - 🟠 橙色（#4-#6）：中热预测
  - 🟡 黄色（#7-#10）：温热预测

#### 详细信息
每个预测号码显示：
- **号码**：大号徽章突出显示
- **预测指数**：X/100 分数
- **历史频率**：出现次数
- **最后出现**：多少期前出现

### 3. 预测说明

自动生成智能解释：
- **热号延续**：解释高频号码为何被预测
- **冷号反弹**：说明长期未出现号码的爆发可能
- **均衡号码**：推荐频率适中的稳健选择
- **算法说明**：透明展示计算方法
- **重要提示**：免责声明

### 4. 用户界面

- **显眼位置**：在热号/冷号之后、快速统计之前
- **响应式设计**：适配桌面、平板、手机
- **卡片布局**：清晰美观的网格展示
- **渐变色彩**：黄金主题，突出预测性质
- **免责声明**：醒目提示仅供参考

## 技术实现

### 新增数据追踪

```javascript
// 追踪每个号码最后出现的位置
const lastAppearance = {};
for (let i = 1; i <= 49; i++) {
    lastAppearance[i] = -1; // -1表示从未出现
}
```

### 预测计算函数

```javascript
function calculatePredictions(result) {
    // 1. 计算频率分数
    const frequencyScore = (freq / maxFreq) * 40;
    
    // 2. 计算冷号反弹分数
    const avgInterval = totalDraws / freq;
    if (drawsSinceLastSeen > avgInterval) {
        coldReboundScore = (drawsSinceLastSeen / avgInterval) * 15;
    }
    
    // 3. 计算均衡分数
    const balanceScore = 30 - Math.abs(freq - avgFreq) * 3;
    
    // 综合得分
    const predictionIndex = frequencyScore + coldReboundScore + balanceScore;
}
```

### 预测显示函数

```javascript
function displayPredictions(result) {
    const predictions = calculatePredictions(result);
    const top10 = predictions.slice(0, 10);
    
    // 生成预测卡片
    // 生成预测说明
}
```

## 导出功能增强

### CSV 导出
新增预测数据部分：
```
Prediction Rank,Number,Prediction Index,Frequency,Draws Since Last Seen
1,40,85,12,2
2,23,78,10,1
...
```

### JSON 导出
在原有数据基础上增加：
```json
{
  "predictions": [
    {
      "number": 40,
      "predictionIndex": 85,
      "frequency": 12,
      "drawsSinceLastSeen": 2,
      ...
    }
  ]
}
```

### 打印功能
打印版本包含完整的预测表格和免责声明。

## 使用方法

1. **输入数据**：在左侧输入框粘贴彩票号码
2. **点击分析**：点击"分析号码"按钮
3. **查看预测**：结果区域会显示"下一期预测 Top 10"部分
4. **理解预测**：阅读预测说明了解每个号码的推荐理由
5. **导出结果**：CSV/JSON/打印都包含预测数据

## 注意事项

⚠️ **重要免责声明**

- 彩票结果是**完全随机**的
- 历史数据**不能预测**未来结果
- 此功能仅作**统计分析参考**
- 不构成任何**投注建议**
- 请理性娱乐，量力而行

## 技术特性

- ✅ 完全离线工作
- ✅ 零外部依赖
- ✅ 实时计算
- ✅ 响应式设计
- ✅ 数据完整导出
- ✅ 不破坏现有功能

## 示例数据测试

使用示例数据测试预测功能：

```
5, 12, 23, 34, 45, 49
1, 2, 3, 4, 5, 6
10, 20, 30, 40, 42, 49
5, 15, 25, 35, 45, 12
```

点击"分析号码"后，将看到基于这些数据的预测 Top 10。

## 文件信息

- **主文件**：`lottery-analyzer.html`
- **总行数**：1,709 行
- **新增代码**：约 400 行（CSS + HTML + JavaScript）
- **文件大小**：约 50KB

---

**开发日期**：2024
**版本**：2.0 with Predictions
