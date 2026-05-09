import { NextResponse } from 'next/server'
import { getInfectionLevel, shokuchudokuQuestions } from '@/lib/shokuchudoku-data'
import { checkRateLimit, isSameOriginRequest, readJsonBody, rejectCrossOrigin } from '@/lib/request-security'
import { getShokuchudokuStorageReady, stockShokuchudokuResult } from '@/lib/shokuchudoku-storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RequestBody = {
  answers?: unknown
  consent?: unknown
  nickname?: unknown
}

function normalizeAnswers(value: unknown) {
  if (!Array.isArray(value)) {
    return null
  }

  const answers = value.map((item) => Number(item))
  const valid = answers.length === shokuchudokuQuestions.length && answers.every((item) => Number.isInteger(item) && item >= 0 && item <= 3)

  return valid ? answers : null
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return rejectCrossOrigin()
  const rateLimited = checkRateLimit(request, 'shokuchudoku', 8, 5 * 60 * 1000)
  if (rateLimited) return rateLimited

  const body = await readJsonBody<RequestBody>(request, 4096)
  const answers = normalizeAnswers(body?.answers)

  if (!answers) {
    return NextResponse.json({ ok: false, message: '回答データが不正です。' }, { status: 400 })
  }

  const score = answers.reduce((sum, answer) => sum + answer, 0)
  const level = getInfectionLevel(score)
  const createdAt = new Date().toISOString()
  const id = `${Date.now()}-${crypto.randomUUID()}`
  const nickname = typeof body?.nickname === 'string' ? body.nickname.trim().slice(0, 40) : ''
  const responseResult = {
    id,
    createdAt,
    score,
    maxScore: shokuchudokuQuestions.length * 3,
    level: level.label,
    title: level.title,
  }

  if (!getShokuchudokuStorageReady()) {
    return NextResponse.json({
      ok: true,
      stocked: false,
      storage: 'unconfigured',
      message: '分析用ストックは未設定ですが、認定書は発行できます。',
      result: responseResult,
    })
  }

  const result = await stockShokuchudokuResult({
    id,
    createdAt,
    score,
    maxScore: shokuchudokuQuestions.length * 3,
    level: level.label,
    title: level.title,
    answers,
    consent: body?.consent === true,
    nickname: nickname || undefined,
    referrer: request.headers.get('referer') ?? undefined,
    userAgent: request.headers.get('user-agent') ?? undefined,
  })

  if (!result.ok) {
    console.warn('Shokuchudoku stock failed:', result.message)
    return NextResponse.json({
      ok: true,
      stocked: false,
      storage: 'failed',
      message: '認定書を発行しました。',
      result: responseResult,
    })
  }

  return NextResponse.json({ ok: true, stocked: true, storage: result.storage, result: responseResult })
}
