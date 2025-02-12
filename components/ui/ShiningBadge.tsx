import AnimatedShinyText from "@/components/magicui/animated-shiny-text"
import { cn } from "@/lib/utils"
import { BorderBeam } from "@/components/magicui/border-beam"

export async function ShiningBadge({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "z-10 flex items-center justify-center relative rounded-full",
        className
      )}
    >
      <div
        className={cn(
          "group relative rounded-full bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        )}
      >
        <AnimatedShinyText className="inline-flex text-xs items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          {children}
        </AnimatedShinyText>
      </div>
    </div>
  )
}
