import { Plus, BookOpen, Sunrise, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const habits = [
  {
    id: "1",
    name: "每天阅读",
    anchor: "喝完晨间咖啡后",
    icon: <BookOpen className="h-6 w-6 text-brand-primary" />,
  },
  {
    id: "2",
    name: "晨间拉伸",
    anchor: "起床后",
    icon: <Sunrise className="h-6 w-6 text-brand-primary" />,
  },
]

export default function HabitsPage() {
  return (
    <div className="bg-surface-main min-h-screen text-text-primary">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">我的习惯</h1>
          <Button asChild className="bg-brand-accent hover:bg-brand-accent/90 text-white">
            <Link href="/habits/create">
              <Plus className="mr-2 h-4 w-4" />
              新建习惯
            </Link>
          </Button>
        </header>

        <main className="space-y-4">
          {habits.map((habit) => (
            <Link href={`/habits/${habit.id}`} key={habit.id} className="block group">
              <Card className="bg-white border-surface-divider shadow-sm hover:border-brand-primary transition-colors duration-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-primary/10 p-3 rounded-full">{habit.icon}</div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-text-primary">{habit.name}</CardTitle>
                      <CardDescription className="text-text-secondary">{habit.anchor}</CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-text-secondary group-hover:text-brand-primary transition-colors" />
                </CardHeader>
              </Card>
            </Link>
          ))}
        </main>
      </div>
    </div>
  )
}
