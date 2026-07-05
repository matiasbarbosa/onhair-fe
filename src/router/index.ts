import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/agendar',
    name: 'agendar',
    component: () => import('@/views/AgendarView.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
      },
      {
        path: 'estoque',
        name: 'admin-estoque',
        component: () => import('@/views/admin/EstoqueView.vue'),
      },
      {
        path: 'produtos',
        name: 'admin-produtos',
        component: () => import('@/views/admin/ProdutosView.vue'),
      },
      {
        path: 'produtos/novo',
        name: 'admin-produtos-novo',
        component: () => import('@/views/admin/ProdutoFormView.vue'),
      },
      {
        path: 'produtos/:id/editar',
        name: 'admin-produtos-editar',
        component: () => import('@/views/admin/ProdutoFormView.vue'),
        props: true,
      },
      {
        path: 'financeiro',
        name: 'admin-financeiro',
        component: () => import('@/views/admin/FinanceiroView.vue'),
      },
    ],
  },
  {
    path: '/cliente',
    component: () => import('@/layouts/ClientLayout.vue'),
    children: [
      {
        path: '',
        name: 'cliente-home',
        component: () => import('@/views/cliente/ClienteHomeView.vue'),
      },
      {
        path: 'agendamentos',
        name: 'cliente-agendamentos',
        component: () => import('@/views/cliente/AgendamentosView.vue'),
      },
      {
        path: 'historico',
        name: 'cliente-historico',
        component: () => import('@/views/cliente/HistoricoView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router