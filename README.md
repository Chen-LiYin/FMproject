# 《The Twitter Myth Revisited: Intraday Investor Sentiment, Twitter Activity and Individual-Level Stock Return Volatility》

「股票在短時間內的價格變化，會受到 Twitter 上的言論影響嗎？」
假設你是投資人：
你看到某支股票突然在 Twitter 上被瘋狂討論、很多人喊會漲，那你會不會因此買進，造成股價真的上漲（或波動）？

## 他們做了什麼？
研究 30 支股票（道瓊指數成份股），用 2015~2017 年的資料

收集：
每 5 分鐘的股價變動
同時間段的 Twitter 討論數量和情緒

用數學模型看看：
Twitter 的資料是否能預測之後的股價「波動程度」

## 使用的模型（你也在模仿的部分）：
HAR 模型（Heterogeneous AutoRegressive）
這是一種常見的「波動率預測模型」

它會參考：
- 上一分鐘的波動
- 過去一小時平均波動
- 過去一整天平均波動

## 重點來了：研究結論
### 結論一：Twitter 數據真的「有影響」，但不大
Twitter 情緒/數量 和 股價波動 確實有「統計上的關聯」

但從實務角度來看：「效果小到不能當成可靠的預測依據」

### 結論二：專業投資人可以不用參考 Twitter
如果你是靠模型投資的交易者（量化交易者），

加不加 Twitter 的資料，預測準度沒什麼差別

所以「Twitter 能準確預測股市」這件事，只是個神話（myth）

## 你可以考慮以下延伸方向：

延伸主題

📊 加入迴歸模型:看看哪些變數對「報酬波動」影響最強

📈 畫出 散佈圖:看 Twitter 情緒 跟 報酬波動 的關聯（視覺化）

🧠 加入其他資料源:Google Trends、新聞 API 等

💡 設計一個 Dashboard	點選股票代碼就可以顯示即時圖表與 Twitter 分析

## 實作
請在 terminal 執行這個指令來安裝：
```js
npm init -y
npm install mathjs
```
然後執行：
```js
node index.js
```
開啟簡易伺服器：
```
npx http-server .
```
點選其中的url

## 實作結果
<img width="1433" alt="截圖 2025-04-25 晚上10 15 43" src="https://github.com/user-attachments/assets/6a9d9a49-8aef-42fc-bdec-426e61955c19" />

## 圖表解釋
1. Filtered Return → 藍色線

是模擬的「報酬波動程度」，代表某支股票在每 5 分鐘內「漲跌幅有多劇烈」。
不是指漲或跌，而是「動得兇不兇」。

💡 舉例：

0.01：代表股價幾乎沒動

1.2：代表股價在那 5 分鐘內可能波動很大（例如突然漲停或跌停）

2. Twitter Sentiment → 橘色線

模擬那個時間點 Twitter 上的貼文情緒平均值。

1: 很正面（ex: "買爆這支！🚀"）

0: 中性

-1: 很負面（ex: "完了，跌爛了…"）

💡 舉例：

0.5: 代表有些人開始看好這支股票

-0.3: 有很多人在抱怨、看衰這支股票

 3. Twitter Count → 綠色線

每 5 分鐘有幾篇 Tweet 提到這支股票。
越多代表越熱門、大家在討論它。

💡 舉例：

0~2：很冷門、幾乎沒人討論

10+：非常熱門，可能是有新聞或爆料在傳
