import { notFound } from "next/navigation"
import { ReadingFrame } from "@/components/book/reading-frame"
import { LessonShell } from "@/components/book/lesson-one"

const titles = ["It guesses the next word", "The dial", "Words aren't the unit", "How much it can see at once", "From autocomplete to assistant", "Why it makes things up", "The map", "Get your lab"]
export function generateStaticParams() { return titles.map((_, index) => ({ lesson: String(index + 3) })) }
export default async function LessonRoute({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson: raw } = await params
  const lesson = Number(raw)
  if (!Number.isInteger(lesson) || lesson < 3 || lesson > 10) notFound()
  return <ReadingFrame lesson={lesson} title={titles[lesson - 3]}><LessonShell lesson={lesson} /></ReadingFrame>
}
