import { notFound } from "next/navigation"
import { ReadingFrame } from "@/components/book/reading-frame"
import { LessonOne } from "@/components/book/lesson-one"

export function generateStaticParams() { return Array.from({ length: 11 }, (_, i) => ({ section: String(i + 1) })) }
export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) { const { section: raw } = await params; const section = Number(raw); if (!Number.isInteger(section) || section < 1 || section > 11) notFound(); return <ReadingFrame lesson={section} title="What is an LLM?"><LessonOne section={section} /></ReadingFrame> }
