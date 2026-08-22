import { notFound } from "next/navigation"
import Link from "next/link"
import { ReadingFrame, Eyebrow, Figure, LessonHeader, Prose, ProjectBlocks, Check } from "@/components/book/reading-frame"
import { courseModules } from "@/components/book/course-data"
import { LessonOne } from "@/components/book/lesson-one"
import { ModuleTwoLesson } from "@/components/book/module-two"
import { ModuleThreeLesson } from "@/components/book/module-three"
import { ModuleFourLesson } from "@/components/book/module-four"
import { ModuleFiveLesson } from "@/components/book/module-five"
import { ModuleSixLesson } from "@/components/book/module-six"
import { ModuleSevenLesson } from "@/components/book/module-seven"
import { ModuleEightLesson } from "@/components/book/module-eight"

export function generateStaticParams() { return courseModules.flatMap((item, m) => item.sections.map((_, s) => ({ module: String(m + 1), section: String(s + 1) }))) }
export default async function SectionPage({ params }: { params: Promise<{ module: string; section: string }> }) {
  const { module: mr, section: sr } = await params
  const module = Number(mr); const section = Number(sr); const item = courseModules[module - 1]; const title = item?.sections[section - 1]
  if (!item || !title) notFound()
  if (module === 1) return <ReadingFrame module={module} lesson={section} title={title}><LessonOne section={section} /></ReadingFrame>
  if (module === 2) return <ReadingFrame module={module} lesson={section} title={title}><ModuleTwoLesson section={section} /></ReadingFrame>
  if (module === 3) return <ReadingFrame module={module} lesson={section} title={title}><ModuleThreeLesson section={section} /></ReadingFrame>
  if (module === 4) return <ReadingFrame module={module} lesson={section} title={title}><ModuleFourLesson section={section} /></ReadingFrame>
  if (module === 5) return <ReadingFrame module={module} lesson={section} title={title}><ModuleFiveLesson section={section} /></ReadingFrame>
  if (module === 6) return <ReadingFrame module={module} lesson={section} title={title}><ModuleSixLesson section={section} /></ReadingFrame>
  if (module === 7) return <ReadingFrame module={module} lesson={section} title={title}><ModuleSevenLesson section={section} /></ReadingFrame>
  if (module === 8) return <ReadingFrame module={module} lesson={section} title={title}><ModuleEightLesson section={section} /></ReadingFrame>
  const project = section === item.sections.length - 1
  return <ReadingFrame module={module} lesson={section} title={title}><article><LessonHeader eyebrow={`Module ${String(module).padStart(2, "0")} · Section ${section} of ${item.sections.length}`} meta={`~${project ? "40" : "7"} min`}>{title}</LessonHeader><div className="mt-10 border border-border px-4 py-3"><Eyebrow>In one line</Eyebrow><p className="mt-2 text-lg leading-7">Content arriving with the lesson.</p></div><Figure caption={`FIGURE ${module}.${section} — Diagram slot for ${title}.`} library={project ? "" : "A suggested library or technique will appear here."}><div className="flex min-h-52 items-center justify-center px-5 text-center font-mono text-xs text-muted-foreground">Content arriving</div></Figure>{project && <ProjectBlocks project={item.project} />}<Prose><p>Content for this section is arriving. The reading, figure, and practical explanation will be added here without changing the shape of the course.</p></Prose><aside className="mt-10 border border-border p-5"><Eyebrow>Key idea</Eyebrow><p className="mt-2 text-sm leading-6 text-muted-foreground">The useful idea for this section will appear with its content.</p></aside><Check>What should you carry forward from this section?</Check><details className="mt-8 border-y border-border py-4"><summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Go deeper</summary><p className="mt-4 font-mono text-xs text-muted-foreground">Content arriving</p></details><div className="mt-12 flex items-center justify-between border-t border-border pt-6 font-mono text-[10px]"><Link href={section > 1 ? `/m/${module}/s/${section - 1}` : `/m/${module}`}>← Previous</Link><Link className="text-foreground" href={section < item.sections.length ? `/m/${module}/s/${section + 1}` : `/m/${module + 1}`}>Next →</Link></div></article></ReadingFrame>
}
