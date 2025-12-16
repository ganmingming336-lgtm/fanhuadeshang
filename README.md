# 🎰 Lottery Analyzer / 彩票分析工具

A simple and powerful tool to analyze your lottery numbers. See which numbers appear most frequently, visualize patterns with charts, and export your results - all from your browser!

一个简单而强大的彩票号码分析工具。查看哪些号码出现最频繁，用图表可视化数据模式，并导出分析结果 - 全部在您的浏览器中完成！

## 🌟 What Does This Tool Do? / 工具功能

This tool helps you analyze lottery numbers (1-49) by:
- **Calculating statistics**: Total numbers, unique numbers, most and least common numbers
- **Visualizing data**: Interactive charts showing frequency distribution
- **Displaying detailed tables**: See each number's frequency and percentage
- **Mobile-friendly design**: Works perfectly on phones, tablets, and computers

此工具通过以下方式帮助您分析彩票号码（1-49）：
- **计算统计数据**：总数字数、唯一数字数、最常见和最不常见的数字
- **数据可视化**：显示频率分布的交互式图表
- **显示详细表格**：查看每个号码的频率和百分比
- **移动端友好设计**：在手机、平板电脑和计算机上完美运行

## 🚀 How to Open and Use / 如何打开和使用

### Option 1: Run Locally (For Technical Users) / 本地运行（技术用户）

1. Make sure you have [Node.js](https://nodejs.org/) installed on your computer
2. Open a terminal/command prompt in this folder
3. Install dependencies (first time only):
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to: [http://localhost:3000](http://localhost:3000)

### Option 2: Host on GitHub Pages (Easiest) / 通过 GitHub Pages 托管（最简单）

1. Push this code to your GitHub repository
2. Go to repository Settings → Pages
3. Select your branch (e.g., `main`) and `/root` folder
4. Click Save
5. After a few minutes, your site will be live at: `https://yourusername.github.io/your-repo-name`

**Note**: For GitHub Pages deployment, you may need to configure the build output. Add these scripts to `package.json`:
```json
"scripts": {
  "export": "next build && next export"
}
```

## 📊 Supported Data Format / 支持的数据格式

The tool accepts lottery numbers in various formats:

✅ **Accepted formats:**
- Comma-separated: `5, 12, 23, 34, 45, 49`
- Space-separated: `1 2 3 4 5 6`
- Multiple lines: 
  ```
  5, 12, 23, 34, 45, 49
  1, 2, 3, 4, 5, 6
  10, 20, 30, 40, 42, 49
  ```
- Mixed format: `5, 12 23 34, 45`

✅ **Number range**: 1 to 49 only

❌ **Invalid inputs**: Letters, symbols (except commas), numbers outside 1-49 range

## 🎯 Features / 功能列表

### 📈 Statistics / 统计分析
- **Total Numbers**: Count of all numbers entered / 输入的所有数字总数
- **Unique Numbers**: Count of distinct numbers / 不同数字的数量
- **Most Common (Hot Numbers)**: Numbers that appear most frequently / 出现最频繁的号码（热号）
- **Least Common (Cold Numbers)**: Numbers that appear least frequently / 出现最少的号码（冷号）

### 📊 Visual Charts / 可视化图表
- **Frequency Distribution Chart**: Interactive bar chart showing how often each number (1-49) appears
- **Hover tooltips**: Hover over any bar to see exact counts / 悬停在任何条形图上查看确切数量
- **Color-coded bars**: Easier to spot patterns at a glance / 颜色编码的条形图，更易发现规律

### 📋 Detailed Table / 详细表格
- Number-by-number breakdown with:
  - Frequency count (how many times it appeared)
  - Percentage (proportion of total)
- Sortable and scrollable for large datasets / 可排序和滚动，适用于大数据集

### 💾 Export Options / 导出选项
Currently, results can be:
- **Copied manually** from the table or statistics cards
- **Screenshot** the charts and results for saving

*Future versions may include CSV/JSON download buttons*

## 📱 Mobile Compatibility / 移动端兼容性

✅ **Fully responsive design** - works on:
- 📱 Smartphones (iOS, Android)
- 📱 Tablets (iPad, Android tablets)
- 💻 Desktop computers (Windows, Mac, Linux)
- 🌐 All modern browsers (Chrome, Firefox, Safari, Edge)

✅ **Mobile-optimized features**:
- Touch-friendly buttons and input areas
- Responsive layout adjusts to screen size
- Scrollable charts and tables on small screens
- No horizontal scrolling needed

## 🆘 Troubleshooting / 故障排除

**Problem**: "No valid numbers found" error
- **Solution**: Check that numbers are between 1-49 and separated by commas or spaces

**Problem**: Yellow warning "Invalid characters"
- **Solution**: Remove any letters or special symbols (except commas)

**Problem**: Charts not displaying correctly
- **Solution**: Refresh the page. Make sure you have a modern browser with JavaScript enabled

**Problem**: Page won't load when running locally
- **Solution**: Make sure you ran `npm install` first, and that no other app is using port 3000

## 💡 Tips for Best Results / 最佳使用技巧

1. **Paste directly**: Copy lottery numbers from Excel or text files and paste directly
2. **Use example data**: Click "Paste & Analyze Example" to see how it works
3. **Mix formats**: You can mix commas and spaces in your input
4. **Analyze patterns**: Look for hot numbers (high frequency) and cold numbers (low frequency)
5. **Regular analysis**: Analyze new draws regularly to track trends over time

## 📝 License

This project is open source and available for personal and educational use.

---

**Need help?** Check the in-app "How to Use" guide for step-by-step instructions!
