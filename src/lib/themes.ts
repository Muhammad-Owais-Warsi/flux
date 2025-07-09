import { Sun, Moon, Trees, Sunset } from "lucide-react"

export interface ThemeConfig {
  name: string
  value: string
}

export const themes: ThemeConfig[] = [

  {
    name: "Light",
    value: "light",


  },
  {
    name: "Dark", 
    value: "dark",


  },

  {
    name: "Tokyo",
    value: "tokio",
   

  },
  {
    name: "Catppuccin",
    value: "catppuccin",


  },
  {
    name: "T3Chat",
    value: "t3chat",
    

  },
  {
    name: "Supabase",
    value: "supabase",

  },
  {
    name: "Soft Pop",
    value: "softpop"
  }
]

export const getThemesByCategory = () => {
  return themes
} 