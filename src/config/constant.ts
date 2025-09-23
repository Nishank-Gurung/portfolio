import { Newspaper, LucideIcon, Star, PencilRuler, FolderGit2 } from 'lucide-react';

export const TOKEN_NAME = 'portfolio-token'

export const ADMIN_DEFAULT_REDIRECT_URL = '/admin/dashboard'

export interface SidebarNavLinks {
  title: string
  url: string
  icon?: LucideIcon
  items?: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
 
}
export const AdminSideBarLinks: SidebarNavLinks[] = [
  {
    title: 'Projects',
    icon: FolderGit2,
    url: '/admin/projects',
  },
  {
    title: 'Experiences',
    icon: Star,
    url: '/admin/experiences',
  },

  {
    title: 'Skills',
    icon: PencilRuler,
    url: '/admin/skills',
  },

  {
    title: 'Socials',
    icon: Newspaper,
    url: '/admin/socials',
  },
]
