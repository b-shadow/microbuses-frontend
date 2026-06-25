import { Navigate, Route, Routes } from 'react-router-dom'

import { AdminLayout } from './app/layouts/admin-layout'
import { useAuth } from './shared/stores/auth-context'
import { LoginPage } from './modules/auth/pages/list-page'
import { DriversPage } from './modules/drivers/pages/list-page'
import { DriversCreatePage } from './modules/drivers/pages/create-page'
import { DriversEditPage } from './modules/drivers/pages/edit-page'
import { DriversDetailPage } from './modules/drivers/pages/detail-page'
import { AdminsPage } from './modules/admins/pages/list-page'
import { LinesPage } from './modules/lines/pages/list-page'
import { LinesCreatePage } from './modules/lines/pages/create-page'
import { LinesEditPage } from './modules/lines/pages/edit-page'
import { LinesDetailPage } from './modules/lines/pages/detail-page'
import { RoutesPage } from './modules/routes/pages/list-page'
import { RoutesCreatePage } from './modules/routes/pages/create-page'
import { RoutesEditPage } from './modules/routes/pages/edit-page'
import { RoutesDetailPage } from './modules/routes/pages/detail-page'
import { StopsPage } from './modules/stops/pages/list-page'
import { StopsCreatePage } from './modules/stops/pages/create-page'
import { StopsEditPage } from './modules/stops/pages/edit-page'
import { StopsDetailPage } from './modules/stops/pages/detail-page'
import { AuditPage } from './modules/audit/pages/list-page'
import { DashboardPage } from './modules/dashboard/pages/list-page'
import { BusesPage } from './modules/buses/pages/list-page'
import { BusesCreatePage } from './modules/buses/pages/create-page'
import { BusesEditPage } from './modules/buses/pages/edit-page'
import { BusesDetailPage } from './modules/buses/pages/detail-page'
import { BusAssignmentsPage } from './modules/bus_assignments/pages/list-page'
import { VariantsPage } from './modules/variants/pages/list-page'
import { VariantsCreatePage } from './modules/variants/pages/create-page'
import { VariantsEditPage } from './modules/variants/pages/edit-page'
import { VariantsDetailPage } from './modules/variants/pages/detail-page'
import { RoutePointsPage } from './modules/route_points/pages/list-page'
import { RoutePointsCreatePage } from './modules/route_points/pages/create-page'
import { RoutePointsEditPage } from './modules/route_points/pages/edit-page'
import { RoutePointsDetailPage } from './modules/route_points/pages/detail-page'
import { ImportsPage } from './modules/imports/pages/list-page'
import { OfflinePackagesPage } from './modules/offline_packages/pages/list-page'
import { SettingsPage } from './modules/settings/pages/list-page'
import { ActiveTripsPage } from './modules/active_trips/pages/list-page'
import { TrackingPage } from './modules/tracking/pages/list-page'
import { MapEditorPage } from './modules/map_editor/pages/list-page'
import { ActiveBusesPage } from './modules/active_buses/pages/list-page'
import { NearbyLinesPage } from './modules/nearby_lines/pages/list-page'

function ProtectedApp() {
  return (
    <AdminLayout>
      <Routes>
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/drivers' element={<DriversPage />} />
        <Route path='/drivers/create' element={<DriversCreatePage />} />
        <Route path='/drivers/:id' element={<DriversDetailPage />} />
        <Route path='/drivers/:id/edit' element={<DriversEditPage />} />
        <Route path='/admins' element={<AdminsPage />} />
        <Route path='/buses' element={<BusesPage />} />
        <Route path='/buses/create' element={<BusesCreatePage />} />
        <Route path='/buses/:id' element={<BusesDetailPage />} />
        <Route path='/buses/:id/edit' element={<BusesEditPage />} />
        <Route path='/bus-assignments' element={<BusAssignmentsPage />} />
        <Route path='/lineas' element={<LinesPage />} />
        <Route path='/lineas/create' element={<LinesCreatePage />} />
        <Route path='/lineas/:id' element={<LinesDetailPage />} />
        <Route path='/lineas/:id/edit' element={<LinesEditPage />} />
        <Route path='/variants' element={<VariantsPage />} />
        <Route path='/variants/create' element={<VariantsCreatePage />} />
        <Route path='/variants/:id' element={<VariantsDetailPage />} />
        <Route path='/variants/:id/edit' element={<VariantsEditPage />} />
        <Route path='/linea-ruta' element={<RoutesPage />} />
        <Route path='/linea-ruta/create' element={<RoutesCreatePage />} />
        <Route path='/linea-ruta/:id' element={<RoutesDetailPage />} />
        <Route path='/linea-ruta/:id/edit' element={<RoutesEditPage />} />
        <Route path='/lineas-puntos' element={<RoutePointsPage />} />
        <Route path='/lineas-puntos/create' element={<RoutePointsCreatePage />} />
        <Route path='/lineas-puntos/:id' element={<RoutePointsDetailPage />} />
        <Route path='/lineas-puntos/:id/edit' element={<RoutePointsEditPage />} />
        <Route path='/puntos' element={<StopsPage />} />
        <Route path='/puntos/create' element={<StopsCreatePage />} />
        <Route path='/puntos/:id' element={<StopsDetailPage />} />
        <Route path='/puntos/:id/edit' element={<StopsEditPage />} />
        <Route path='/map-editor' element={<MapEditorPage />} />
        <Route path='/imports' element={<ImportsPage />} />
        <Route path='/active-trips' element={<ActiveTripsPage />} />
        <Route path='/active-buses' element={<ActiveBusesPage />} />
        <Route path='/tracking' element={<TrackingPage />} />
        <Route path='/lineas-cercanas' element={<NearbyLinesPage />} />
        <Route path='/offline-packages' element={<OfflinePackagesPage />} />
        <Route path='/audit' element={<AuditPage />} />
        <Route path='/settings' element={<SettingsPage />} />
      </Routes>
    </AdminLayout>
  )
}

export function App() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <ProtectedApp />
}


