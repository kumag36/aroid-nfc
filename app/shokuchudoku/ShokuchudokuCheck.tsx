'use client'

import { useMemo, useState } from 'react'
import { answerOptions, getInfectionLevel, shokuchudokuComments, shokuchudokuQuestions } from '@/lib/shokuchudoku-data'

const initialAnswers = Array.from({ length: shokuchudokuQuestions.length }, () => -1)
const challengeUrl = 'zamakuri.jp/shokuchudoku'
const examinerLines = {
  未感染: 'まだ穏やかです。ただし、入口に立った人ほど伸びしろがあります。',
  芽吹き級: '芽が出ています。次に園芸店へ行くと、何かが増える気配があります。',
  根張り級: '生活の中にしっかり根が入り始めています。もう観察者の目をしています。',
  繁茂級: 'かなり濃いです。水やり、置き場、光の読みが日常会話に混ざっています。',
  '植中毒 認定者': '認定です。植物を育てているというより、植物中心の暮らしを育てています。',
} as const

const questionDisplayLines = [
  ['ホームセンターや園芸店に行くと', '予定外の植物を', '連れて帰る'],
  ['「置く場所がない」と言いながら', '置く場所を', '作っている'],
  ['水やり・日当たり・風通しを', '天気予報より', '真剣に考える'],
  ['葉の新芽を見つけると', 'かなり嬉しい'],
  ['植物の調子が悪いと', '自分の体調より気になる'],
  ['鉢・土・肥料・支柱・剪定ばさみなど', '道具が', '増えている'],
  ['「これはまだ小さいから」と言って', '購入を正当化した', 'ことがある'],
  ['旅行や外出時', '植物の水やり問題が', '最優先事項になる'],
  ['SNSや動画で', '植物・園芸・観葉植物をよく見ている'],
  ['人の家や店先の植物が', '気になる'],
  ['枯れた植物にも', '「まだいける」と希望を持つ'],
  ['植え替えをすると', '謎の達成感がある'],
  ['名前のわからない植物を', '調べ始めると', '止まらない'],
  ['「増やせる」と聞くと', '挿し木・株分けを', '試したくなる'],
  ['植物を見て', '「かわいい」と普通に言う'],
] as const

type SaveState = 'idle' | 'saving' | 'saved' | 'error'
type IssuedCertificate = {
  id: string
  createdAt: string
  stocked: boolean
  storage?: string
}

type ApiResponse = {
  ok?: boolean
  stocked?: boolean
  storage?: string
  message?: string
  result?: {
    id: string
    createdAt: string
  }
}

function createClientId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function ShokuchudokuCheck() {
  const [answers, setAnswers] = useState<number[]>(initialAnswers)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nickname, setNickname] = useState('')
  const [consent, setConsent] = useState(true)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [message, setMessage] = useState('')
  const [issuedCertificate, setIssuedCertificate] = useState<IssuedCertificate | null>(null)

  const answeredCount = answers.filter((answer) => answer >= 0).length
  const completed = answeredCount === shokuchudokuQuestions.length
  const score = answers.reduce((sum, answer) => sum + Math.max(answer, 0), 0)
  const level = useMemo(() => getInfectionLevel(score), [score])
  const maxScore = shokuchudokuQuestions.length * 3
  const currentAnswer = answers[currentIndex]
  const progress = Math.round((answeredCount / shokuchudokuQuestions.length) * 100)
  const examinerLine = examinerLines[level.label as keyof typeof examinerLines] ?? level.description
  const previousIndex = currentIndex - 1
  const previousAnswer = previousIndex >= 0 ? answers[previousIndex] : -1
  const previousComment = previousIndex >= 0 && previousAnswer >= 0 ? shokuchudokuComments[previousIndex][previousAnswer] : ''
  const currentQuestionLines = questionDisplayLines[currentIndex] ?? [shokuchudokuQuestions[currentIndex]]

  function updateAnswer(value: number) {
    setAnswers((current) => current.map((answer, answerIndex) => (answerIndex === currentIndex ? value : answer)))
    setSaveState('idle')
    setMessage(`${answerOptions[value].label}で記録しました。`)
    setIssuedCertificate(null)

    window.setTimeout(() => {
      if (currentIndex < shokuchudokuQuestions.length - 1) {
        goToQuestion(currentIndex + 1)
        return
      }

      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 180)
  }

  function goToQuestion(index: number) {
    setCurrentIndex(Math.min(Math.max(index, 0), shokuchudokuQuestions.length - 1))
  }

  function submitResult() {
    if (!completed) {
      setMessage('未回答の項目があります。最後まで進むと認定できます。')
      return
    }

    if (!consent) {
      setMessage('分析用に結果をストックする同意が必要です。個人情報は入力しなくて大丈夫です。')
      return
    }

    const issued: IssuedCertificate = {
      id: createClientId(),
      createdAt: new Date().toISOString(),
      stocked: false,
      storage: 'local-first',
    }

    setIssuedCertificate(issued)
    setSaveState('saved')
    setMessage('認定書を発行しました。結果のストックは裏で試しています。')
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })

    void stockResult(issued)
  }

  async function stockResult(issued: IssuedCertificate) {
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 3500)

    try {
      const response = await fetch('/api/shokuchudoku', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          answers,
          nickname: nickname.trim(),
          consent,
        }),
      })
      const data = (await response.json().catch(() => null)) as ApiResponse | null

      if (!response.ok || !data?.ok) {
        throw new Error(data?.message ?? '保存できませんでした。')
      }

      setIssuedCertificate((current) => current?.id === issued.id
        ? {
          ...current,
          id: data.result?.id ?? current.id,
          createdAt: data.result?.createdAt ?? current.createdAt,
          stocked: data.stocked === true,
          storage: data.storage,
        }
        : current)
      setMessage(data.message ?? (data.stocked ? '認定結果をストックしました。ご協力ありがとうございます。' : '認定書を発行しました。'))
    } catch {
      setIssuedCertificate((current) => current?.id === issued.id
        ? {
          ...current,
          stocked: false,
          storage: 'client-fallback',
        }
        : current)
      setMessage('認定書は発行済みです。結果のストックは通信状況により後回しになりました。')
    } finally {
      window.clearTimeout(timeoutId)
    }
  }

  function reset() {
    setAnswers(initialAnswers)
    setCurrentIndex(0)
    setNickname('')
    setConsent(true)
    setSaveState('idle')
    setMessage('')
    setIssuedCertificate(null)
  }

  function downloadCanvas(kind: 'certificate' | 'poster') {
    const canvas = document.createElement('canvas')
    const certificateName = nickname.trim() || '名無しの植物好き'
    const issuedDate = issuedCertificate ? new Intl.DateTimeFormat('ja-JP', { dateStyle: 'long' }).format(new Date(issuedCertificate.createdAt)) : ''
    const fileLabel = kind === 'certificate' ? 'certificate' : 'poster'

    canvas.width = kind === 'certificate' ? 1400 : 1080
    canvas.height = kind === 'certificate' ? 1400 : 1350

    const context = canvas.getContext('2d')
    if (!context) return

    context.fillStyle = kind === 'certificate' ? '#fffef8' : '#10291e'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.strokeStyle = kind === 'certificate' ? '#b89558' : '#d9ffd8'
    context.lineWidth = kind === 'certificate' ? 18 : 14
    context.strokeRect(48, 48, canvas.width - 96, canvas.height - 96)
    context.lineWidth = 3
    context.strokeRect(82, 82, canvas.width - 164, canvas.height - 164)

    if (kind === 'certificate') {
      context.fillStyle = '#b89558'
      context.font = '700 30px sans-serif'
      context.textAlign = 'center'
      context.fillText('ZAMAKURI.JP OFFICIAL CERTIFICATION', canvas.width / 2, 170)
      context.fillStyle = '#10291e'
      context.font = '900 90px sans-serif'
      context.fillText('植中毒', canvas.width / 2, 295)
      context.font = '900 74px sans-serif'
      context.fillText('感染者認定書', canvas.width / 2, 390)
      context.font = '800 44px sans-serif'
      context.fillText(certificateName, canvas.width / 2, 520)
      context.font = '700 28px sans-serif'
      context.fillText('殿', canvas.width / 2, 570)
      context.fillStyle = '#173b2a'
      context.font = '900 74px sans-serif'
      context.fillText(`${level.label} / ${score}点`, canvas.width / 2, 700)
      context.fillStyle = '#315244'
      context.font = '700 30px sans-serif'
      context.fillText(level.description, canvas.width / 2, 805)
      context.fillText('ここに、植物への愛着と観察の深さを認め、感染者として認定します。', canvas.width / 2, 870)
      context.fillStyle = '#10291e'
      context.font = '700 28px sans-serif'
      context.fillText(issuedDate, canvas.width / 2, 1010)
      context.font = '900 36px sans-serif'
      context.fillText('ZAMAKURI PLANTS', canvas.width / 2, 1070)
      context.fillStyle = '#6d5429'
      context.font = '800 30px sans-serif'
      context.fillText(`挑戦はこちら  ${challengeUrl}`, canvas.width / 2, 1215)
    } else {
      context.fillStyle = '#d9ffd8'
      context.font = '900 86px sans-serif'
      context.textAlign = 'center'
      context.fillText('PLANT ADDICT', canvas.width / 2, 250)
      context.font = '900 96px sans-serif'
      context.fillText('植中毒', canvas.width / 2, 380)
      context.strokeStyle = '#b89558'
      context.lineWidth = 5
      context.beginPath()
      context.arc(canvas.width / 2, 690, 210, 0, Math.PI * 2)
      context.stroke()
      context.fillStyle = '#fffef8'
      context.font = '900 76px sans-serif'
      context.fillText(`${score}/45`, canvas.width / 2, 650)
      context.font = '800 42px sans-serif'
      context.fillText(level.label, canvas.width / 2, 730)
      context.fillStyle = '#d9ffd8'
      context.font = '700 34px sans-serif'
      context.fillText('水やり、日当たり、風通し。', canvas.width / 2, 1000)
      context.fillText('そのすべてが生活の中心へ。', canvas.width / 2, 1060)
      context.fillStyle = '#b89558'
      context.font = '800 30px sans-serif'
      context.fillText('ZAMAKURI.JP CERTIFIED', canvas.width / 2, 1200)
      context.fillStyle = '#fffef8'
      context.font = '800 34px sans-serif'
      context.fillText(`挑戦はこちら  ${challengeUrl}`, canvas.width / 2, 1265)
    }

    const link = document.createElement('a')
    link.download = `shokuchudoku-${fileLabel}-${score}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  function downloadWallpaper() {
    const link = document.createElement('a')
    link.download = 'shokuchudoku-omake-wallpaper-1290x2796.png'
    link.href = '/shokuchudoku/posters/omake-wallpaper-1290x2796.png'
    link.click()
  }

  if (issuedCertificate) {
    const issuedDate = new Intl.DateTimeFormat('ja-JP', { dateStyle: 'long' }).format(new Date(issuedCertificate.createdAt))

    return (
      <section className="mx-auto w-full max-w-[1040px] px-3 pb-8 min-[430px]:px-4 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:gap-5 lg:px-6">
        <div className="rounded-[28px] border border-[#d6c08a]/50 bg-[#fffef8] p-4 shadow-[0_24px_70px_rgba(10,37,24,0.18)] lg:p-6">
          <p className="text-[11px] font-black tracking-[0.24em] text-[#9d7a3c]">DIAGNOSIS REPORT</p>
          <div className="mt-4 rounded-[22px] bg-[#123d2b] p-5 text-[#fffef8]">
            <p className="text-sm font-black text-[#d9ffd8]">あなたの感染度</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <p className="text-[76px] font-black leading-none">{score}</p>
              <p className="pb-3 text-right text-sm font-black leading-6">
                / {maxScore}
                <br />
                {level.label}
              </p>
            </div>
            <h2 className="mt-3 text-3xl !text-[#fffef8]">{level.title}</h2>
            <p className="mt-3 text-sm font-bold leading-7 text-[#d9ffd8]">{level.description}</p>
          </div>

          <div className="mt-4 rounded-[22px] border border-[#10291e]/10 bg-[#f7fbf1] p-4">
            <p className="text-[11px] font-black tracking-[0.18em] text-[#9d7a3c]">EXAMINER NOTE</p>
            <h3 className="mt-2 text-xl font-black text-[#10291e]">審査官からの一言</h3>
            <p className="mt-3 text-sm font-bold leading-7 text-[#315244]">{examinerLine}</p>
          </div>

          <div className="mt-4 grid gap-2">
            {shokuchudokuQuestions.map((question, index) => {
              const answer = Math.max(answers[index], 0)
              const option = answerOptions.find((item) => item.value === answer)

              return (
                <article key={question} className="rounded-[18px] border border-[#10291e]/10 bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-black leading-6 text-[#10291e]">{index + 1}. {question}</span>
                    <span className="shrink-0 rounded-full bg-[#f4ecd9] px-3 py-1 text-[11px] font-black text-[#6d5429]">{option?.label}</span>
                  </div>
                  <p className="mt-2 text-[11px] font-black tracking-[0.14em] text-[#9d7a3c]">審査官コメント</p>
                  <p className="mt-3 text-sm font-bold leading-7 text-[#315244]">{shokuchudokuComments[index][answer]}</p>
                </article>
              )
            })}
          </div>
        </div>

        <div className="mt-5 rounded-[28px] border border-[#d6c08a]/55 bg-[#fffef8] p-5 text-center shadow-[0_24px_70px_rgba(10,37,24,0.16)] lg:mt-0 lg:self-start lg:p-6">
          <p className="text-[11px] font-black tracking-[0.24em] text-[#9d7a3c]">CERTIFICATE</p>
          <h2 className="mt-3 text-4xl">感染者認定書</h2>
          <p className="mt-5 text-xl font-black text-[#10291e]">{nickname.trim() || '名無しの植物好き'} 殿</p>
          <p className="mx-auto mt-5 max-w-[18rem] text-sm font-bold leading-7 text-[#315244]">
            植物への愛着と観察の深さを認め、ここに {level.label} として認定します。
          </p>
          <p className="mt-4 text-xs font-black text-[#6d5429]">{issuedDate} / ZAMAKURI PLANTS</p>

          <div className="mt-6 grid gap-3">
            <button type="button" onClick={() => downloadCanvas('certificate')} className="min-h-14 rounded-full bg-[#123d2b] px-5 text-base font-black text-[#fffef8] shadow-[0_14px_28px_rgba(18,61,43,0.24)] active:scale-[0.98]">
              インスタ用認定書を保存
            </button>
            <button type="button" onClick={downloadWallpaper} className="min-h-14 rounded-full border border-[#123d2b]/18 bg-white px-5 text-base font-black text-[#123d2b] active:scale-[0.98]">
              待ち受けポスターを保存
            </button>
          </div>
          <p className="mt-3 text-xs font-bold leading-6 text-[#315244]">画像には {challengeUrl} が入ります。</p>
          {message ? <p className="mt-3 text-xs font-bold leading-6 text-[#8b3d30]">{message}</p> : null}
          <button type="button" onClick={reset} className="mt-4 text-sm font-black text-[#315244] underline underline-offset-4">
            もう一度挑戦する
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto grid w-full max-w-[1040px] px-3 pb-[16.5rem] min-[430px]:px-4 md:pb-[10.5rem] lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-5 lg:px-6 lg:pb-10">
      <div className="sticky top-0 z-20 -mx-3 bg-[#07110c]/82 px-3 pb-3 pt-2 backdrop-blur-md min-[430px]:-mx-4 min-[430px]:px-4 lg:col-start-1 lg:row-span-3 lg:mx-0 lg:self-start lg:rounded-[26px] lg:border lg:border-[#d9ffd8]/16 lg:bg-[#10291e]/94 lg:p-5 lg:shadow-[0_20px_54px_rgba(0,0,0,0.24)]">
        <div className="flex items-center justify-between gap-3 text-[#d9ffd8]">
          <button
            type="button"
            onClick={() => goToQuestion(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="min-h-8 rounded-full border border-[#d9ffd8]/18 px-3 text-xs font-black tracking-[0.08em] text-[#d9ffd8] disabled:opacity-35"
          >
            戻る
          </button>
          <p className="text-xs font-black tracking-[0.18em]">審査 {currentIndex + 1}/{shokuchudokuQuestions.length}</p>
          <p className="text-xs font-black">{progress}%</p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#d9ffd8]/14">
          <div className="h-full rounded-full bg-[#d9ffd8] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-5 hidden rounded-[20px] border border-[#d9ffd8]/12 bg-[#07110c]/42 p-4 lg:block">
          <p className="text-[11px] font-black tracking-[0.18em] text-[#b89558]">CURRENT SCORE</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-5xl font-black leading-none text-[#fffef8]">{score}</p>
            <p className="pb-1 text-right text-sm font-black leading-5 text-[#d9ffd8]">
              / {maxScore}
              <br />
              {level.label}
            </p>
          </div>
          <p className="mt-4 text-sm font-bold leading-7 text-[#d9ffd8]/82">{examinerLine}</p>
        </div>
      </div>

      <div className="relative mt-4 lg:col-start-2 lg:mt-0">
        <div className="relative overflow-hidden rounded-[26px] border border-[#d9ffd8]/18 bg-[#fffef8] p-3 shadow-[0_24px_70px_rgba(10,37,24,0.2)] min-[390px]:p-4 min-[560px]:p-5">
          <div className="pointer-events-none absolute -right-12 -top-10 h-32 w-32 rounded-full bg-[#d9ffd8]/55 blur-2xl" />
          {currentIndex > 0 ? (
            <div className="relative rounded-[20px] border border-[#10291e]/10 bg-[#f7fbf1] px-4 py-3 min-[560px]:px-5">
              <p className="text-[11px] font-black tracking-[0.16em] text-[#9d7a3c]">前問への審査官コメント</p>
              <p className="mt-2 text-[13px] font-bold leading-6 text-[#315244]">{previousComment}</p>
            </div>
          ) : (
            <div className="relative rounded-[20px] border border-[#10291e]/10 bg-[#f7fbf1] px-4 py-2.5 min-[560px]:px-5">
              <p className="text-[12px] font-black leading-5 text-[#173b2a]">
                近い感覚を選択。コメントは次カードから上に出ます。
              </p>
            </div>
          )}

          <div className="relative mt-3 flex items-end gap-3 rounded-[22px] border border-[#10291e]/10 bg-white px-4 py-5 min-[560px]:px-6 min-[560px]:py-6 lg:min-h-[260px] lg:items-center">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black tracking-[0.16em] text-[#9d7a3c]">今回の質問</p>
              <div className="mt-2 text-[24px] font-black leading-[1.34] text-[#10291e] min-[430px]:text-[28px] min-[560px]:text-[32px] lg:text-[38px] lg:leading-[1.28]" role="heading" aria-level={2}>
                {currentQuestionLines.map((line, index) => (
                  <span key={line} className="block min-[560px]:inline">
                    {line}
                    {index < currentQuestionLines.length - 1 ? <span className="hidden min-[560px]:inline"> </span> : null}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {completed ? (
        <div className="mt-5 rounded-[26px] border border-[#d9ffd8]/18 bg-[#fffef8] p-5 shadow-[0_18px_48px_rgba(10,37,24,0.18)] lg:col-start-2">
          <p className="text-sm font-black text-[#315244]">認定準備完了</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <p className="text-5xl font-black leading-none text-[#10291e]">{score}</p>
            <p className="pb-1 text-right text-sm font-black leading-6 text-[#315244]">/ {maxScore}<br />{level.label}</p>
          </div>
          <label className="mt-5 block text-sm font-black text-[#10291e]">
            認定書の名前
            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              maxLength={40}
              placeholder="未入力なら名無しの植物好き"
              className="mt-2 w-full rounded-[16px] border border-[#10291e]/12 bg-white px-4 py-4 text-base text-[#10291e] outline-none focus:border-[#123d2b]"
            />
          </label>
          <label className="mt-4 flex items-start gap-3 text-sm font-bold leading-6 text-[#315244]">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4" />
            <span>回答結果をZAMAKURI.JP内で集計・分析に使うことに同意します。</span>
          </label>
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-[5.8rem] z-30 mx-auto w-full max-w-[620px] border-t border-[#d9ffd8]/16 bg-[#07110c]/94 px-3 pb-3 pt-3 backdrop-blur-md min-[430px]:px-4 md:bottom-0 md:pb-[max(1rem,env(safe-area-inset-bottom))] lg:static lg:inset-auto lg:col-start-2 lg:mt-5 lg:max-w-none lg:rounded-[26px] lg:border lg:border-[#d9ffd8]/16 lg:bg-[#10291e]/94 lg:p-5 lg:shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
        {completed ? (
          <button
            type="button"
            onClick={submitResult}
            disabled={saveState === 'saving'}
            className="min-h-14 w-full rounded-full bg-[#d9ffd8] px-5 text-base font-black text-[#07110c] shadow-[0_14px_30px_rgba(217,255,216,0.18)] active:scale-[0.98] disabled:opacity-55"
          >
            {saveState === 'saving' ? '認定書を発行中' : '診断結果と認定書へ'}
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {answerOptions.map((option) => {
              const selected = currentAnswer === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateAnswer(option.value)}
                  className={[
                    'flex min-h-[3.65rem] items-center justify-between rounded-[18px] border px-3 text-left text-[13px] font-black leading-5 transition active:scale-[0.98] lg:min-h-[5rem] lg:flex-col lg:items-start lg:justify-center lg:gap-2 lg:px-4 lg:text-[14px]',
                    selected ? 'border-[#d9ffd8] bg-[#d9ffd8] text-[#07110c] shadow-[0_12px_24px_rgba(217,255,216,0.2)]' : 'border-[#d9ffd8]/18 bg-[#fffef8] text-[#123d2b]',
                  ].join(' ')}
                >
                  <span>{option.label}</span>
                  <span className={selected ? 'text-[#315244]' : 'text-[#9d7a3c]'}>{option.value}点</span>
                </button>
              )
            })}
          </div>
        )}
        {message ? <p className="mt-2 text-center text-xs font-bold leading-5 text-[#d9ffd8]">{message}</p> : null}
      </div>
    </section>
  )
}
