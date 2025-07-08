import { memo } from "react"
import { useTheme } from "@/components/theme-provider"
import { themes } from "@/lib/themes"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const ThemeSelector = memo(() => {
  const { theme, setTheme } = useTheme()

  const currentTheme = themes.find(t => t.value === theme) || themes[0]

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span>{currentTheme.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {themes.map((themeOption) => {
       
          
          return (
            <SelectItem
              key={themeOption.value}
              value={themeOption.value}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="font-medium">{themeOption.name}</span>
                </div>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
})

