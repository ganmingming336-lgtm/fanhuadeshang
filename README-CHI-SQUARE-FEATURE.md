# 卡方检验预测模型功能说明

## Chi-square Test Prediction Model Feature Documentation

---

## 📊 功能概述 / Feature Overview

本次更新为彩票分析器添加了基于统计学的**卡方检验**功能，并实现了**双模型预测系统**，从不同的统计角度分析彩票数据。

This update adds a **Chi-square test** feature based on statistical methods to the lottery analyzer, implementing a **dual model prediction system** that analyzes lottery data from different statistical perspectives.

---

## 🆕 新增功能 / New Features

### 1. 卡方检验（Chi-square Test）

#### 功能描述
卡方检验是一种统计假设检验方法，用于检测观测频率是否显著偏离期望频率。在彩票分析中，它可以帮助判断彩票是否真正随机。

The chi-square test is a statistical hypothesis testing method used to detect whether observed frequencies significantly deviate from expected frequencies. In lottery analysis, it helps determine if the lottery is truly random.

#### 核心计算
- **卡方值（χ²）**: `χ² = Σ((观测值 - 期望值)² / 期望值)`
- **期望频率**: `总期数 / 49`（假设完全随机）
- **自由度（df）**: `49 - 1 = 48`
- **P值**: 使用 Wilson-Hilferty 变换近似计算

#### 结果解释
- **p > 0.05**: 数据符合随机分布，彩票可能是公平的
- **p < 0.05**: 数据显著偏离随机分布，可能存在某种规律或偏差

### 2. 双模型预测系统（Dual Model Prediction System）

#### 模型 A - 频率预测模型（Frequency Model）
**保留原有功能，基于历史频率的智能预测**

- **频率分数（40%权重）**: 基于历史出现频率
- **冷号反弹分数（30%权重）**: 长期未出现的号码可能反弹
- **均衡分数（30%权重）**: 中等频率的号码获得额外加分

**颜色主题**: 黄色/金色 (Yellow/Gold)

#### 模型 B - 卡方预测模型（Chi-square Model）
**新增功能，基于统计偏差分析**

- **核心指标**: 卡方残差 `(观测值 - 期望值)² / 期望值`
- **排序逻辑**: 按残差从大到小排序
- **预测原理**: 如果彩票存在系统性偏差，偏离最大的数字最可能继续表现异常
- **偏差类型**:
  - 📈 **超频号码**: 出现频率显著高于期望值
  - 📉 **欠频号码**: 出现频率显著低于期望值

**颜色主题**: 靛蓝色/蓝色 (Indigo/Blue)

### 3. 模型对比说明（Model Comparison）

新增了专门的说明区域，解释两个模型的区别和互补性：

- **模型 A（频率模型）**: 基于历史频率、冷号反弹和均衡性
- **模型 B（卡方模型）**: 基于统计偏差分析
- **使用建议**: 两个模型共同推荐的号码可能更值得关注

---

## 🎨 UI/UX 设计

### 色彩方案
- **卡方检验区域**: 紫色渐变 (#8b5cf6, #f5f3ff)
- **模型 A 预测**: 黄色/金色渐变 (#f59e0b, #fef3c7)
- **模型 B 预测**: 靛蓝色渐变 (#6366f1, #eef2ff)

### 视觉元素
- 📊 卡方检验图标
- 🔮 模型 A（频率预测）图标
- 📈 模型 B（卡方预测）图标
- 🔬 模型对比图标

### 响应式设计
- 桌面端：网格布局，双列显示
- 移动端：单列垂直布局，保持完整功能

---

## 📤 导出功能增强

所有导出功能（CSV、JSON、打印）现在都包含：

### CSV 导出
```
- 基础频率统计
- 卡方检验结果（χ² 值、p 值、期望频率、显著性）
- 模型 A 预测 Top 10
- 模型 B 预测 Top 10（包含残差、偏差类型、偏差百分比）
```

### JSON 导出
```json
{
  "chiSquareTest": {
    "chiSquare": 45.23,
    "degreesOfFreedom": 48,
    "pValue": 0.5234,
    "expected": 2.04,
    "significance": "random"
  },
  "modelA_frequencyPredictions": [...],
  "modelB_chiSquarePredictions": [...]
}
```

### 打印功能
- 包含完整的卡方检验结果展示
- 显著性标记（彩色徽章）
- 两个模型的 Top 10 预测对比表格

---

## 🔬 技术实现

### JavaScript 函数

#### 卡方计算
```javascript
calculateChiSquare(result)        // 计算卡方值、p值、残差
calculatePValue(chiSquare, df)    // 计算 p 值（Wilson-Hilferty 近似）
normalCDF(z)                      // 标准正态分布累积函数
```

#### 卡方预测
```javascript
calculateChiSquarePredictions(result)  // 基于残差计算预测
displayChiSquarePredictions(result)    // 显示卡方预测结果
```

#### 卡方检验显示
```javascript
displayChiSquareTest(result)           // 显示检验结果和解释
```

### CSS 类

#### 卡方检验样式
```css
.chi-square-test-section          // 检验区域容器
.test-result-card                 // 结果卡片
.test-explanation-box             // 解释说明框
.significance-badge               // 显著性徽章
.significance-random              // 随机标记（绿色）
.significance-non-random          // 非随机标记（红色）
```

#### 卡方预测样式
```css
.chi-square-prediction-section    // 预测区域容器
.chi-square-prediction-card       // 预测卡片
.chi-square-number-badge          // 号码徽章
.chi-square-residual-bar          // 残差进度条
.chi-square-residual-fill         // 残差填充（高/中/低）
```

---

## 📊 统计学原理

### 卡方检验假设
- **零假设（H₀）**: 彩票号码完全随机，每个号码出现概率相等
- **备择假设（H₁）**: 彩票号码不是完全随机的，存在某种偏差

### 计算公式
```
χ² = Σ((Oᵢ - Eᵢ)² / Eᵢ)

其中：
Oᵢ = 第 i 个号码的观测频率
Eᵢ = 第 i 个号码的期望频率 = 总期数 / 49
```

### P值含义
- P值 = 在零假设为真的情况下，观察到当前或更极端结果的概率
- P值越小，数据越不支持"完全随机"假设

### 残差分析
```
残差ᵢ = (Oᵢ - Eᵢ)² / Eᵢ

- 残差大 = 该号码偏离随机程度高
- 可能原因：机器偏好、球重量差异、数据量不足等
```

---

## ⚠️ 免责声明

1. **彩票的本质**: 合法彩票应该是完全随机的，历史数据理论上无法预测未来结果
2. **统计学局限**: 
   - 卡方检验需要足够的样本量才能准确
   - P值只能说明数据是否"看起来随机"，不能证明未来也随机
   - 即使P值显著，也可能是样本量不足导致的随机波动
3. **使用建议**: 
   - 此工具仅供教育、娱乐和统计分析参考
   - 不构成任何投注建议
   - 请理性对待彩票

---

## 💡 使用场景

### 场景 1: 检验彩票公平性
如果你对某个彩票是否公平存疑，可以：
1. 收集足够多的历史开奖数据（建议至少100期）
2. 使用卡方检验功能
3. 查看 p 值判断数据是否符合随机分布

### 场景 2: 双模型对比分析
1. 同时查看两个模型的 Top 10 预测
2. 关注两个模型都推荐的号码
3. 理解不同统计方法的侧重点

### 场景 3: 教育与学习
1. 学习卡方检验的实际应用
2. 理解统计偏差分析
3. 体验不同预测模型的差异

---

## 🔄 版本更新

### Version 3.0 - Chi-square Test Feature
- ✅ 新增卡方检验功能
- ✅ 新增卡方预测模型（模型 B）
- ✅ 保留原有频率预测模型（模型 A）
- ✅ 新增双模型对比说明
- ✅ 增强所有导出功能（CSV、JSON、打印）
- ✅ 新增紫色和靛蓝色主题
- ✅ 保持完全离线可用
- ✅ 保持响应式设计

### 文件大小
- 从 62KB (1,710 行) 增加到 94KB (2,403 行)
- 新增 7 个 JavaScript 函数
- 新增 30+ 个 CSS 类
- 保持单文件架构

---

## 📚 相关文档

- `README-独立HTML版本.md` - 原始版本说明
- `README-预测功能.md` - 预测功能说明（版本 2.0）
- `CHANGELOG-预测功能.md` - 预测功能更新日志

---

## 🙏 致谢

感谢统计学和概率论的先驱们，为我们提供了科学的数据分析方法。

---

**构建日期**: 2024-12-16  
**版本**: 3.0  
**作者**: Lottery Analyzer Team
