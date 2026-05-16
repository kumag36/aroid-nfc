export type PreorderProduct = {
  id: string
  name: string
  category: string
  priceLabel: string
  arrivalLabel: string
  stockLabel: string
  image: string
  summary: string
  notes: string[]
}

export const preorderProducts: PreorderProduct[] = [
  {
    id: 'monstera-variegata-select-001',
    name: 'モンステラ斑入り セレクト株',
    category: 'Monstera',
    priceLabel: '目安 18,000円〜',
    arrivalLabel: '次回入荷相談',
    stockLabel: '予約受付サンプル',
    image: '/dictionary/candidates/016-monstera-deliciosa-legacy-variegated-mth-1-scaled.webp',
    summary: '葉のサイズ、斑の入り方、育成状態を確認してから案内するセレクト枠です。',
    notes: ['斑の強さは個体差あり', '発根・活着状態を確認後に案内', '写真確認後に正式決定'],
  },
  {
    id: 'alocasia-dragon-scale-variegated-001',
    name: 'アロカシア ドラゴンスケール斑入り',
    category: 'Alocasia',
    priceLabel: '目安 12,000円〜',
    arrivalLabel: '少量入荷予定',
    stockLabel: '予約受付サンプル',
    image: '/dictionary/candidates/002-al003-alocasia-dragon-scale-variegated.webp',
    summary: '銀葉系の質感と斑入りの個体差を楽しむアロカシア。状態優先で案内します。',
    notes: ['高湿度管理推奨', '葉数と根の状態を確認', '配送時期は気温で調整'],
  },
  {
    id: 'monstera-obliqua-peru-001',
    name: 'モンステラ オブリクア ペルー',
    category: 'Monstera',
    priceLabel: '目安 15,000円〜',
    arrivalLabel: '入荷時連絡',
    stockLabel: '予約受付サンプル',
    image: '/dictionary/candidates/001-a-monstera-obliqua-peru-beauty.webp',
    summary: '繊細な葉姿が特徴の希少系モンステラ。小さめ株から相談できます。',
    notes: ['環境変化に注意', 'サイズ指定は相談', '状態写真を確認後に進行'],
  },
]

export function findPreorderProduct(productId: string) {
  return preorderProducts.find((product) => product.id === productId) ?? null
}
