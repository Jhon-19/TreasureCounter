import { lazy } from 'react'
import { createHashRouter, RouteObject } from 'react-router'

const MainPage = lazy(() => import('../pages/counter'))
const SettingPage = lazy(() => import('../pages/setting'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainPage />
  },
  {
    path: '/setting',
    element: <SettingPage />
  }
]

export const router = createHashRouter(routes)
