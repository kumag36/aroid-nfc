import { plants, type Category, type Plant } from '@/lib/dictionary-data'

export type DictionaryTagGroup = '斑・色' | '分類・系統' | '育成・性質' | '流通・人気' | 'その他'

export type DictionaryTagStatus = 'active' | 'review' | 'deprecated'

export type DictionaryTagDefinition = {
  name: string
  group: DictionaryTagGroup
  description: string
  status?: DictionaryTagStatus
  aliases?: string[]
  mergeTo?: string
  sortWeight?: number
}

export type DictionaryTagRow = {
  name: string
  count: number
  categories: Category[]
  plants: Plant[]
  group: DictionaryTagGroup
  description: string
  status: DictionaryTagStatus
  aliases: string[]
  mergeTo?: string
  sortWeight: number
  registered: boolean
}

export const dictionaryTagDefinitions: DictionaryTagDefinition[] = [
  { name: '白斑', group: '斑・色', description: '白色からクリーム色の斑が入る株。', aliases: ['ホワイト', 'アルボ'], sortWeight: 10 },
  { name: '黄斑', group: '斑・色', description: '黄色からライム色の斑が入る株。', aliases: ['オーレア'], sortWeight: 11 },
  { name: '斑入り', group: '斑・色', description: '斑入り全般。色が特定できる場合は白斑・黄斑などを優先。', sortWeight: 12 },
  { name: 'ミント斑', group: '斑・色', description: '淡いミント調の斑が入る株。', sortWeight: 13 },
  { name: 'ピンク斑', group: '斑・色', description: 'ピンク色の発色や斑が特徴の株。', aliases: ['ピンクアルボ'], sortWeight: 14 },
  { name: '赤斑', group: '斑・色', description: '赤みのある斑や発色が特徴の株。', sortWeight: 15 },
  { name: '黒葉', group: '斑・色', description: '黒みの強い葉色が特徴の株。', sortWeight: 16 },
  { name: '明色葉', group: '斑・色', description: '明るい葉色が特徴の株。', sortWeight: 17 },
  { name: '銀葉', group: '斑・色', description: '銀白色の葉色や毛羽立ちが目立つ株。', sortWeight: 18 },

  { name: 'デリシオーサ', group: '分類・系統', description: 'Monstera deliciosa 系統。', sortWeight: 30 },
  { name: 'ボルシギアナ', group: '分類・系統', description: '流通上 Monstera borsigiana と呼ばれる系統。', status: 'review', sortWeight: 31 },
  { name: 'シエラナ', group: '分類・系統', description: 'Monstera deliciosa var. sierrana 系統。', sortWeight: 32 },
  { name: 'グリーンフォーム', group: '分類・系統', description: '斑なしの緑葉フォーム。', sortWeight: 33 },
  { name: '原種系', group: '分類・系統', description: '原種または原種に近い扱いで紹介する株。', sortWeight: 34 },
  { name: 'アロカシア', group: '分類・系統', description: 'Alocasia 属。', sortWeight: 35 },
  { name: 'フィロデンドロン', group: '分類・系統', description: 'Philodendron 属。', sortWeight: 36 },
  { name: 'ラフィドフォラ', group: '分類・系統', description: 'Rhaphidophora 属。', sortWeight: 37 },
  { name: 'ビカクシダ', group: '分類・系統', description: 'Platycerium 属。', sortWeight: 38 },
  { name: 'バナナ', group: '分類・系統', description: 'Musa 属。', sortWeight: 39 },
  { name: 'ヒリー', group: '分類・系統', description: 'Platycerium hillii 系統。', sortWeight: 40 },
  { name: 'マダガスカル', group: '分類・系統', description: 'マダガスカル由来・関連として扱う株。', sortWeight: 41 },

  { name: 'つる性', group: '育成・性質', description: 'つる性・登はん性が強い株。', sortWeight: 60 },
  { name: '穴あき葉', group: '育成・性質', description: '葉に切れ込みや穴が入りやすい株。', sortWeight: 61 },
  { name: '細葉', group: '育成・性質', description: '細い葉形が特徴の株。', sortWeight: 62 },
  { name: '大葉', group: '育成・性質', description: '大きな葉を楽しむ株。', sortWeight: 63 },
  { name: '大型葉', group: '育成・性質', description: '大型化しやすい葉を持つ株。', aliases: ['大葉'], sortWeight: 64 },
  { name: '小型', group: '育成・性質', description: '小型で扱いやすい株。', sortWeight: 65 },
  { name: '繊細', group: '育成・性質', description: '環境変化や水管理に注意したい株。', sortWeight: 66 },
  { name: '乾燥に強い', group: '育成・性質', description: '比較的乾燥に耐えやすい株。', sortWeight: 67 },
  { name: '葉脈', group: '育成・性質', description: '葉脈の模様やコントラストが見どころの株。', sortWeight: 68 },
  { name: '観賞性', group: '育成・性質', description: '姿や葉の見映えを主目的に紹介する株。', sortWeight: 69 },
  { name: '存在感', group: '育成・性質', description: 'サイズ感や造形のインパクトが強い株。', sortWeight: 70 },
  { name: '変化', group: '育成・性質', description: '成長や環境で見た目の変化を楽しむ株。', sortWeight: 71 },

  { name: '希少', group: '流通・人気', description: '流通量が少ない、または入手機会が限られる株。', sortWeight: 90 },
  { name: '人気', group: '流通・人気', description: '需要や認知度が高い株。', sortWeight: 91 },
  { name: '人気品種', group: '流通・人気', description: '定番人気として扱う品種・流通名。', status: 'review', mergeTo: '人気', sortWeight: 92 },
  { name: 'コレクター向け', group: '流通・人気', description: '収集性が高く、個体差や由来を重視したい株。', sortWeight: 93 },
  { name: '個性派', group: '流通・人気', description: '形・色・性質に強い個性がある株。', sortWeight: 94 },
  { name: '海外流通', group: '流通・人気', description: '海外名や海外流通由来の扱いがある株。', sortWeight: 95 },
  { name: '流通名注意', group: '流通・人気', description: '流通名と学術名・実態がずれる可能性がある株。', sortWeight: 96 },
  { name: '交配種', group: '流通・人気', description: '交配由来として扱う株。', sortWeight: 97 },
]

const tagDefinitionByName = new Map(dictionaryTagDefinitions.map((definition) => [definition.name, definition]))

export function sortDictionaryTags(tags: string[]) {
  return [...tags].sort((a, b) => {
    const aDefinition = tagDefinitionByName.get(a)
    const bDefinition = tagDefinitionByName.get(b)
    const aWeight = aDefinition?.sortWeight ?? 999
    const bWeight = bDefinition?.sortWeight ?? 999
    if (aWeight !== bWeight) return aWeight - bWeight
    return a.localeCompare(b, 'ja')
  })
}

export function getDictionaryTagStats() {
  const tagPlants = new Map<string, Plant[]>()

  for (const plant of plants) {
    for (const tag of plant.tags) {
      const current = tagPlants.get(tag) ?? []
      current.push(plant)
      tagPlants.set(tag, current)
    }
  }

  const tagRows: DictionaryTagRow[] = sortDictionaryTags(Array.from(tagPlants.keys())).map((name) => {
    const taggedPlants = tagPlants.get(name) ?? []
    const definition = tagDefinitionByName.get(name)
    const categories = Array.from(new Set(taggedPlants.map((plant) => plant.category))).sort((a, b) => a.localeCompare(b, 'ja')) as Category[]

    return {
      name,
      count: taggedPlants.length,
      categories,
      plants: taggedPlants,
      group: definition?.group ?? 'その他',
      description: definition?.description ?? 'タグ台帳に未登録です。用途を決めて登録するか、既存タグへ統合してください。',
      status: definition?.status ?? 'review',
      aliases: definition?.aliases ?? [],
      mergeTo: definition?.mergeTo,
      sortWeight: definition?.sortWeight ?? 999,
      registered: Boolean(definition),
    }
  })

  const groupRows = Array.from(
    tagRows.reduce((map, row) => {
      const current = map.get(row.group) ?? { group: row.group, tagCount: 0, assignmentCount: 0 }
      current.tagCount += 1
      current.assignmentCount += row.count
      map.set(row.group, current)
      return map
    }, new Map<DictionaryTagGroup, { group: DictionaryTagGroup; tagCount: number; assignmentCount: number }>()),
  ).map(([, row]) => row)

  const aliasNames = new Map<string, DictionaryTagDefinition[]>()
  for (const definition of dictionaryTagDefinitions) {
    for (const alias of definition.aliases ?? []) {
      const current = aliasNames.get(alias) ?? []
      current.push(definition)
      aliasNames.set(alias, current)
    }
  }

  return {
    tagRows,
    groupRows,
    unregisteredRows: tagRows.filter((row) => !row.registered),
    reviewRows: tagRows.filter((row) => row.status === 'review'),
    deprecatedRows: tagRows.filter((row) => row.status === 'deprecated'),
    duplicateAliasRows: Array.from(aliasNames.entries())
      .filter(([, definitions]) => definitions.length > 1)
      .map(([alias, definitions]) => ({ alias, definitions })),
    totalTags: tagRows.length,
    totalAssignments: tagRows.reduce((sum, row) => sum + row.count, 0),
    registeredCount: tagRows.filter((row) => row.registered).length,
    unregisteredCount: tagRows.filter((row) => !row.registered).length,
  }
}
