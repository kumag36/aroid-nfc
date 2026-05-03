export type LabelName = {
  slug: string
  shortName: string
  fullKana: string
  note?: string
}

export const labelNames: LabelName[] = [
  {
    slug: 'monstera-borsigiana-albo-white-tiger',
    shortName: 'ホワイトタイガー',
    fullKana: 'モンステラ・ボルシギアナ・アルボ・ホワイトタイガー',
    note: 'deliciosa のシノニム扱いに注意',
  },
  {
    slug: 'monstera-borsigiana-aurea-yellow-tiger',
    shortName: 'ボルシギアナ・オーレア',
    fullKana: 'モンステラ・ボルシギアナ・オーレア・イエロータイガー',
    note: 'deliciosa のシノニム扱いに注意',
  },
  {
    slug: 'monstera-deliciosa-thai-constellation',
    shortName: 'タイコンステレーション',
    fullKana: 'モンステラ・デリシオーサ・タイコンステレーション',
  },
  {
    slug: 'monstera-deliciosa-white-monster',
    shortName: 'ホワイトモンスター',
    fullKana: 'モンステラ・デリシオーサ・ホワイトモンスター',
  },
  {
    slug: 'monstera-deliciosa-yellow-marilyn',
    shortName: 'イエローマリリン',
    fullKana: 'モンステラ・デリシオーサ・イエローマリリン',
  },
  {
    slug: 'monstera-deliciosa-mint',
    shortName: 'デリシオーサ・ミント',
    fullKana: 'モンステラ・デリシオーサ・ミント',
    note: '他種 Mint と識別するため品種名付き',
  },
  {
    slug: 'monstera-deliciosa-legacy',
    shortName: 'レガシー',
    fullKana: 'モンステラ・デリシオーサ・レガシー',
  },
  {
    slug: 'monstera-deliciosa-lemon-lime',
    shortName: 'レモンライム',
    fullKana: 'モンステラ・デリシオーサ・レモンライム',
  },
  {
    slug: 'monstera-deliciosa-bulbasaur',
    shortName: 'バルバソー',
    fullKana: 'モンステラ・デリシオーサ・バルバソー',
  },
  {
    slug: 'monstera-deliciosa-sphinx',
    shortName: 'スフィンクス',
    fullKana: 'モンステラ・デリシオーサ・スフィンクス',
  },
  {
    slug: 'monstera-deliciosa-chameleon',
    shortName: 'カメレオン',
    fullKana: 'モンステラ・デリシオーサ・カメレオン',
  },
  {
    slug: 'monstera-deliciosa-thong-kee-ma',
    shortName: 'トンキーマ',
    fullKana: 'モンステラ・デリシオーサ・トンキーマ',
  },
  {
    slug: 'monstera-deliciosa-miracle',
    shortName: 'ミラクル',
    fullKana: 'モンステラ・デリシオーサ・ミラクル',
  },
  {
    slug: 'monstera-deliciosa-unniiae',
    shortName: 'ユニアエ',
    fullKana: 'モンステラ・デリシオーサ・ユニアエ',
  },
  {
    slug: 'monstera-deliciosa-starlight',
    shortName: 'スターライト',
    fullKana: 'モンステラ・デリシオーサ・スターライト',
  },
  {
    slug: 'monstera-standleyana-aurea',
    shortName: 'スタンデリアナ・オーレア',
    fullKana: 'モンステラ・スタンデリアナ・オーレア',
    note: 'Aurea 識別のため品種名付き',
  },
  {
    slug: 'monstera-burle-marx-flame',
    shortName: 'バールマルクスフレーム',
    fullKana: 'モンステラ・バールマルクス・フレーム',
    note: '種未確定園芸名',
  },
  {
    slug: 'monstera-sierrana-green-form',
    shortName: 'シエラナ・グリーンフォーム',
    fullKana: 'モンステラ・シエラナ・グリーンフォーム',
    note: 'フォーム表記',
  },
  {
    slug: 'monstera-obliqua-peru-form',
    shortName: 'オブリクア・ペルーフォーム',
    fullKana: 'モンステラ・オブリクア・ペルーフォーム',
    note: 'フォーム表記',
  },
  {
    slug: 'monstera-sp-esqueleto',
    shortName: 'エスケレート',
    fullKana: 'モンステラ・エスケレート',
    note: '種未確定',
  },
  {
    slug: 'monstera-friedrichsthalii',
    shortName: 'フリードリヒスターリー',
    fullKana: 'モンステラ・フリードリヒスターリー',
  },
  {
    slug: 'rhaphidophora-tetrasperma',
    shortName: 'テトラスペルマ',
    fullKana: 'ラフィドフォラ・テトラスペルマ',
  },
  {
    slug: 'alocasia-jacklyn',
    shortName: 'ジャックリン',
    fullKana: 'アロカシア・ジャックリン',
  },
  {
    slug: 'alocasia-baginda-dragon-scale-mint-variegated',
    shortName: 'ドラゴンスケールミント',
    fullKana: 'アロカシア・バギンダ・ドラゴンスケール・ミント斑',
  },
  {
    slug: 'alocasia-black-velvet-pink-albo',
    shortName: 'ブラックベルベット・ピンクアルボ',
    fullKana: 'アロカシア・ブラックベルベット・ピンクアルボ',
  },
  {
    slug: 'alocasia-venom',
    shortName: 'ヴェノム',
    fullKana: 'アロカシア・ヴェノム',
  },
  {
    slug: 'philodendron-caramel-marble-fire-tiger',
    shortName: 'ファイヤータイガー',
    fullKana: 'フィロデンドロン・キャラメルマーブル・ファイヤータイガー',
  },
  {
    slug: 'platycerium-paul-vespa',
    shortName: 'ポールヴェスパ',
    fullKana: 'プラティセリウム・ポールヴェスパ',
    note: '栽培品種',
  },
  {
    slug: 'platycerium-diversifolium',
    shortName: 'ディバーシフォリウム',
    fullKana: 'プラティセリウム・ディバーシフォリウム',
  },
  {
    slug: 'platycerium-pewchan',
    shortName: 'ピューチャン',
    fullKana: 'プラティセリウム・ピューチャン',
    note: '栽培品種',
  },
  {
    slug: 'platycerium-alcicorne-madagascar',
    shortName: 'アルシコルネ・マダガスカル',
    fullKana: 'プラティセリウム・アルシコルネ・マダガスカル',
    note: '地域差表記',
  },
  {
    slug: 'platycerium-wonder',
    shortName: 'ワンダー',
    fullKana: 'プラティセリウム・ワンダー',
    note: '栽培品種',
  },
  {
    slug: 'platycerium-magnificent',
    shortName: 'マグニフィセント',
    fullKana: 'プラティセリウム・マグニフィセント',
    note: '栽培品種',
  },
  {
    slug: 'platycerium-yal',
    shortName: 'ヤール',
    fullKana: 'プラティセリウム・ヤール',
    note: '栽培品種',
  },
  {
    slug: 'platycerium-veitchii-silver-frond',
    shortName: 'シルバーフロンド',
    fullKana: 'プラティセリウム・ヴィーチー・シルバーフロンド',
    note: '栽培品種',
  },
  {
    slug: 'platycerium-talnadge',
    shortName: 'タルネッジ',
    fullKana: 'プラティセリウム・タルネッジ',
    note: '栽培品種',
  },
  {
    slug: 'platycerium-mulford',
    shortName: 'ムルフォード',
    fullKana: 'プラティセリウム・ムルフォード',
    note: '栽培品種',
  },
]

export const labelNameBySlug = Object.fromEntries(
  labelNames.map((label) => [label.slug, label]),
) as Record<string, LabelName>
