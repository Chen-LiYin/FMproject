const math = require("mathjs");

// 模擬資料參數
// 模擬 639 個交易日，每天有 77 個 5 分鐘區間
const days = 639;
const intervalsPerDay = 77;
const total = days * intervalsPerDay;

// 隨機數生成
// 模擬報酬或市場變動
function randn() {
  // 使用 Box-Muller transform 生成標準常態分布隨機數
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); // 避免 log(0)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// 產生模擬資料
// 模擬絕對報酬（取絕對值是因為在 HAR 模型中用的是波動值，不關心正負）
const filteredReturn = Array.from({ length: total }, () => Math.abs(randn()));
// 模擬情緒，平均值約 0，標準差 0.2，範圍限制在 -1 ~ 1
const twitterSentiment = Array.from({ length: total }, () =>
  Math.max(-1, Math.min(1, randn() * 0.2))
);
// 自訂 Poisson 分布亂數產生器（使用 Knuth 演算法）
// lambda=2: 每 5 分鐘約有 2 篇 tweet，推文是離散事件
function randomPoisson(lambda) {
  let L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

const twitterCount = Array.from({ length: total }, () => randomPoisson(2));

// 計算滾動平均
function rollingMean(arr, window) {
  const result = new Array(arr.length).fill(null);
  for (let i = window; i < arr.length; i++) {
    const slice = arr.slice(i - window, i);
    const avg = slice.reduce((a, b) => a + b, 0) / window;
    result[i] = avg;
  }
  return result;
}

// 計算 lag 值
function lag(arr, offset = 1) {
  return [...Array(offset).fill(null), ...arr.slice(0, arr.length - offset)];
}

// 組成 DataFrame 類資料
const df = [];

for (let i = 0; i < total; i++) {
  df.push({
    filtered_return: filteredReturn[i],
    twitter_sentiment: twitterSentiment[i],
    twitter_count: twitterCount[i],
  });
}

// 加入 lag 與 rolling 欄位
const lag1 = lag(filteredReturn, 1);
const lag12 = rollingMean(filteredReturn, 12);
const lag24 = rollingMean(filteredReturn, 24);

const sentimentLag1 = lag(twitterSentiment, 1);
const sentimentLag12 = rollingMean(twitterSentiment, 12);
const sentimentLag24 = rollingMean(twitterSentiment, 24);

const countLag1 = lag(twitterCount, 1);
const countLag12 = rollingMean(twitterCount, 12);
const countLag24 = rollingMean(twitterCount, 24);

// 組合進資料中
for (let i = 0; i < total; i++) {
  df[i].lag_1 = lag1[i];
  df[i].lag_12 = lag12[i];
  df[i].lag_24 = lag24[i];
  df[i].sentiment_lag1 = sentimentLag1[i];
  df[i].sentiment_lag12 = sentimentLag12[i];
  df[i].sentiment_lag24 = sentimentLag24[i];
  df[i].count_lag1 = countLag1[i];
  df[i].count_lag12 = countLag12[i];
  df[i].count_lag24 = countLag24[i];
}

// 移除包含 null 的行（模擬 dropna）
const cleanData = df.filter(
  (row) => !Object.values(row).some((val) => val === null)
);

console.log("前5筆資料：");
console.log(cleanData.slice(0, 5));
console.log(`資料筆數：${cleanData.length}`);

const fs = require("fs");

// 只取前100筆資料示範
fs.writeFileSync("data.json", JSON.stringify(cleanData.slice(0, 100), null, 2));
console.log("✅ 已輸出前100筆資料到 data.json");

//產生隨機資料 (報酬 + 推文情緒 + 推文數)
//            ↓
//計算技術指標 (lag + rolling average)
//            ↓
//整理為完整資料表（含技術指標）
//            ↓
//清除缺漏值
//            ↓
//輸出資料（console & JSON 檔）
