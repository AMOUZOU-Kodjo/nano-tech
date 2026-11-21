import {
  createAnnouncement,
  getAdminDashboard,
  getAdminSettings,
  listAdminEvents,
  listAdminUsers,
  listAnonymousUsage,
  listEventErrors,
  listToolRuns,
  updateAdminSetting,
  updateUserAdmin,
  updateUserCredits,
  updateUserPlan,
} from '@/api/adminApi.js'
import { useApiAction } from './useApiAction.js'

// Hook métier : regroupe les états et les actions du control-room administratif.
export function useAdmin() {
  const dashboard = useApiAction(getAdminDashboard)
  const users = useApiAction(listAdminUsers)
  const announcement = useApiAction(createAnnouncement)
  const adminStatus = useApiAction(updateUserAdmin)
  const credits = useApiAction(updateUserCredits)
  const plan = useApiAction(updateUserPlan)
  const toolRuns = useApiAction(listToolRuns)
  const events = useApiAction(listAdminEvents)
  const eventErrors = useApiAction(listEventErrors)
  const anonymousUsage = useApiAction(listAnonymousUsage)
  const settings = useApiAction(getAdminSettings)
  const setting = useApiAction(updateAdminSetting)

  const actions = {
    dashboard,
    users,
    announcement,
    adminStatus,
    credits,
    plan,
    toolRuns,
    events,
    eventErrors,
    anonymousUsage,
    settings,
    setting,
  }

  // Expose la première erreur rencontrée et l'activité globale des actions admin.
  const loading = Object.values(actions).some((action) => action.loading)
  const error = Object.values(actions).find((action) => action.error)?.error ?? null

  return {
    data: dashboard.data ?? users.data ?? settings.data ?? null,
    dashboard: dashboard.data,
    users: users.data?.users ?? users.data ?? [],
    announcement: announcement.data,
    adminStatus: adminStatus.data,
    credits: credits.data,
    plan: plan.data,
    toolRuns: toolRuns.data?.tool_runs ?? toolRuns.data ?? [],
    events: events.data?.events ?? events.data ?? [],
    eventErrors: eventErrors.data?.events ?? eventErrors.data ?? [],
    anonymousUsage: anonymousUsage.data,
    settings: settings.data,
    setting: setting.data,
    loading,
    error,
    getAdminDashboard: dashboard.run,
    listAdminUsers: users.run,
    createAnnouncement: announcement.run,
    updateUserAdmin: adminStatus.run,
    updateUserCredits: credits.run,
    updateUserPlan: plan.run,
    listToolRuns: toolRuns.run,
    listAdminEvents: events.run,
    listEventErrors: eventErrors.run,
    listAnonymousUsage: anonymousUsage.run,
    getAdminSettings: settings.run,
    updateAdminSetting: setting.run,
  }
}
