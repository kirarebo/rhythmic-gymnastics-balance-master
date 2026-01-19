
# RG Balance Master 🤸‍♀️

新体操（Rhythmic Gymnastics）のバランス技をAIで分析・比較し、具体的なトレーニング方法を提案する練習支援アプリです。

## 🌟 主な機能
- **骨格推定比較**: MediaPipeを使用して、お手本と練習生の静止画から瞬時に骨格を抽出。
- **AIコーチング**: Google Gemini 3 Proがバイオメカニクス的視点からフォームを分析。
- **重心(COG)可視化**: バランスの要となる重心位置を計算し、画像上にオーバーレイ表示。
- **解剖学的アドバイス**: 技の成功に不可欠な**「具体的な筋肉名」**を特定。
- **個別トレーニング提案**: 分析結果に基づいた、明日からできる練習メニューを表示。

## 🛠 テクノロジー
- **Frontend**: React, Tailwind CSS, Lucide React
- **Analysis**: 
  - [Google Gemini API](https://ai.google.dev/) (gemini-3-pro-preview)
  - [MediaPipe Pose](https://google.github.io/mediapipe/solutions/pose)
- **Visualization**: Recharts (レーダーチャート)

## 🚀 セットアップ方法

### 1. リポジトリをクローン
```bash
git clone https://github.com/your-username/rg-balance-master.git
cd rg-balance-master
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. APIキーの設定
プロジェクトのルートディレクトリに `.env` ファイルを作成し、Gemini APIキーを設定してください。
```env
API_KEY=YOUR_GEMINI_API_KEY_HERE
```

### 4. 起動
```bash
npm run dev
```

## 📝 論文・研究での活用
本アプリは静止画2枚という最小限の入力から、専門的なコーチング（筋力・トレーニング）を導き出す教育支援システムとして設計されています。
スポーツ科学やバイオメカニクスの教育ツールとしての利用を想定しています。

## ⚠️ 免責事項
AIによる分析は目安です。実際のトレーニングの際は、怪我のないよう専門の指導者や自身の体調に合わせて実施してください。
