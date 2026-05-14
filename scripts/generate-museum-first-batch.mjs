import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const episodes = [
  {
    slug: 'episode-007-root-check',
    title: '第7話｜根っこを見る日',
    subtitle: '調子が戻らない時は、葉だけでなく鉢の中も確認します。',
    pages: [
      {
        label: '葉が元気ない',
        lines: ['水も光も見た。', 'でも戻らない時は?'],
        tip: '次は根を疑う',
      },
      {
        label: '鉢をそっと外す',
        lines: ['無理に引っぱらず、', '鉢の側面を軽く押す。'],
        tip: '根鉢をくずしすぎない',
      },
      {
        label: '健康な根',
        lines: ['白から薄茶色で', '張りがあります。'],
        tip: 'においも少ない',
      },
      {
        label: '傷んだ根',
        lines: ['黒い、ぬるい、', 'いやなにおいは注意。'],
        tip: '清潔なハサミで整理',
      },
      {
        label: '戻した後',
        lines: ['植え替え後は明るい日陰。', '数日は休ませます。'],
        tip: 'すぐ肥料を足さない',
      },
    ],
  },
  {
    slug: 'episode-010-first-batch-wrap',
    title: '第10話｜まず見る順番',
    subtitle: '第一弾のまとめ。焦らず、同じ順番で観察します。',
    pages: [
      {
        label: '最初は光',
        lines: ['暗すぎないか、', '急に強すぎないか。'],
        tip: '置き場所を確認',
      },
      {
        label: '次に水',
        lines: ['土の表面だけでなく、', '鉢の重さも見ます。'],
        tip: '乾いてからたっぷり',
      },
      {
        label: '風と温度',
        lines: ['空気が止まると', '乾き方も乱れます。'],
        tip: '冷風と直風は避ける',
      },
      {
        label: '根と土',
        lines: ['葉で分からない時は、', '鉢の中に理由があります。'],
        tip: '詰まりと腐れを確認',
      },
      {
        label: '第一弾 完',
        lines: ['植物は小さく返事をします。', '毎週少しずつ見れば大丈夫。'],
        tip: '第二弾へ続く',
      },
    ],
  },
]

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function textLines(lines, x, y, size, weight = 800, color = '#17251c', gap = 1.35) {
  return lines
    .map((line, index) => {
      const dy = index === 0 ? 0 : size * gap
      return `<text x="${x}" y="${y + dy}" font-size="${size}" font-weight="${weight}" fill="${color}">${escapeXml(line)}</text>`
    })
    .join('')
}

function plantSvg(x, y, scale = 1) {
  const s = scale
  return `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M65 250 L205 250 L184 360 L86 360 Z" fill="#d98a54" stroke="#17251c" stroke-width="10" stroke-linejoin="round"/>
      <path d="M76 250 C90 224 180 224 196 250" fill="#f4ad78" stroke="#17251c" stroke-width="10"/>
      <path d="M134 235 C122 176 106 124 72 82" fill="none" stroke="#285f3f" stroke-width="12" stroke-linecap="round"/>
      <path d="M145 235 C154 168 186 112 228 76" fill="none" stroke="#285f3f" stroke-width="12" stroke-linecap="round"/>
      <path d="M132 226 C130 166 142 111 151 58" fill="none" stroke="#285f3f" stroke-width="12" stroke-linecap="round"/>
      <path d="M42 68 C86 16 139 48 126 105 C78 126 43 111 42 68 Z" fill="#58a86b" stroke="#17251c" stroke-width="9"/>
      <path d="M163 52 C217 12 263 52 246 108 C196 125 158 106 163 52 Z" fill="#69b773" stroke="#17251c" stroke-width="9"/>
      <path d="M107 30 C166 -7 213 42 194 102 C137 119 98 89 107 30 Z" fill="#82c980" stroke="#17251c" stroke-width="9"/>
      <circle cx="118" cy="292" r="7" fill="#17251c"/>
      <circle cx="158" cy="292" r="7" fill="#17251c"/>
      <path d="M122 318 C135 330 151 330 164 318" fill="none" stroke="#17251c" stroke-width="8" stroke-linecap="round"/>
    </g>
  `
}

function rootSvg(x, y, scale = 1) {
  const s = scale
  return `
    <g transform="translate(${x} ${y}) scale(${s})">
      <ellipse cx="150" cy="120" rx="110" ry="72" fill="#8b5d3b" stroke="#17251c" stroke-width="9"/>
      <path d="M72 106 C105 136 92 178 64 220" fill="none" stroke="#f8ead0" stroke-width="12" stroke-linecap="round"/>
      <path d="M142 78 C148 132 132 186 116 238" fill="none" stroke="#f8ead0" stroke-width="12" stroke-linecap="round"/>
      <path d="M196 98 C190 142 212 176 238 226" fill="none" stroke="#f8ead0" stroke-width="12" stroke-linecap="round"/>
      <path d="M116 168 C92 170 74 184 54 204" fill="none" stroke="#f8ead0" stroke-width="7" stroke-linecap="round"/>
      <path d="M176 162 C204 170 224 186 248 210" fill="none" stroke="#f8ead0" stroke-width="7" stroke-linecap="round"/>
      <circle cx="105" cy="104" r="8" fill="#17251c"/>
      <circle cx="184" cy="104" r="8" fill="#17251c"/>
    </g>
  `
}

function pageSvg(episode, page, pageNumber) {
  const accent = pageNumber % 2 === 0 ? '#2f6f4d' : '#c76641'
  const panelFill = pageNumber % 2 === 0 ? '#f2fff0' : '#fff8e7'
  const illustration = pageNumber === 3 || page.label.includes('根') ? rootSvg(620, 560, 1.25) : plantSvg(610, 520, 1.35)

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1600" viewBox="0 0 1080 1600">
    <rect width="1080" height="1600" fill="#fffdf4"/>
    <rect x="42" y="42" width="996" height="1516" rx="26" fill="#f7f1dc" stroke="#17251c" stroke-width="8"/>
    <rect x="82" y="86" width="916" height="210" rx="20" fill="#17251c"/>
    <text x="122" y="170" font-size="52" font-weight="900" fill="#fffdf4">${escapeXml(episode.title)}</text>
    <text x="124" y="232" font-size="28" font-weight="800" fill="#d9ffd8">${escapeXml(episode.subtitle)}</text>
    <text x="928" y="250" font-size="34" font-weight="900" fill="#fffdf4">${String(pageNumber).padStart(2, '0')}</text>

    <rect x="82" y="330" width="916" height="470" rx="22" fill="${panelFill}" stroke="#17251c" stroke-width="8"/>
    <path d="M120 396 H500 Q540 396 540 436 V586 Q540 626 500 626 H186 L124 708 L146 626 H120 Q80 626 80 586 V436 Q80 396 120 396 Z" fill="#ffffff" stroke="#17251c" stroke-width="8" stroke-linejoin="round"/>
    <text x="142" y="466" font-size="54" font-weight="900" fill="${accent}">${escapeXml(page.label)}</text>
    ${textLines(page.lines, 142, 548, 38)}
    ${illustration}

    <rect x="82" y="844" width="916" height="514" rx="22" fill="#ffffff" stroke="#17251c" stroke-width="8"/>
    <path d="M132 916 H948" stroke="#17251c" stroke-width="7" stroke-linecap="round" stroke-dasharray="18 18"/>
    <text x="136" y="1004" font-size="48" font-weight="900" fill="#17251c">今日の見るところ</text>
    <rect x="136" y="1054" width="808" height="154" rx="28" fill="#e9f6de" stroke="#17251c" stroke-width="7"/>
    <text x="180" y="1150" font-size="52" font-weight="900" fill="#285f3f">${escapeXml(page.tip)}</text>
    <text x="136" y="1286" font-size="30" font-weight="800" fill="#5b645d">ZAMAKURI.JP MANGA ROOM</text>

    <rect x="82" y="1402" width="916" height="94" rx="47" fill="#17251c"/>
    <text x="540" y="1464" text-anchor="middle" font-size="34" font-weight="900" fill="#fffdf4">ゆっくり観察して、ひとつずつ整える。</text>
  </svg>
  `
}

for (const episode of episodes) {
  const outDir = join('public', 'museum', episode.slug)
  mkdirSync(outDir, { recursive: true })

  for (const [index, page] of episode.pages.entries()) {
    const pageNumber = index + 1
    const filename = `${String(pageNumber).padStart(2, '0')}-${episode.slug}.png`
    await sharp(Buffer.from(pageSvg(episode, page, pageNumber))).png().toFile(join(outDir, filename))
  }
}

console.log('Generated first-batch museum episodes.')
