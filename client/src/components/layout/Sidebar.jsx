// File: src/components/layout/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Calendar, 
  FileText,
  Settings,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';


export default function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuthStore();

  // console.log("User is ", user);

  // ✅ CHECK USER ROLE (Admin or not)
  const isAdmin = user?.role === 'Admin' || user?.role === 'admin';

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: t('dashboard.title') },
    { path: '/customers', icon: Users, label: t('customer.title') },
    { path: '/items', icon: Package, label: t('items.title') },
    { path: '/bookings', icon: Calendar, label: t('booking.title') },
    { path: '/reports', icon: FileText, label: t('report.title') }
  ];

  // Admin-only items
  const adminMenuItems = [
    { path: '/users', icon: Settings, label: t('common.userManagement') }
  ];

  const allMenuItems = isAdmin ? [...menuItems, ...adminMenuItems] : menuItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 bg-card border-r transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <h1 className="text-xl font-bold">{t('app.title')}</h1>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* ✅ ADMIN SECTION - ADD THIS SECTION */}
          {isAdmin && (
            <>
              {/* Divider line */}
              <div className="h-px bg-border my-2"></div>

              {/* Admin label */}
              <p className="text-xs font-semibold text-muted-foreground px-4 mb-2 uppercase">
                {t("common.administration")}
              </p>

              {/* Admin menu items */}
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card">
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>User:</strong> {user?.username || 'Unknown'}</p>
            <p><strong>Role:</strong> <span className="capitalize">{user?.role || 'User'}</span></p>
            <p><strong>Developed By :</strong> <span className="capitalize">Ashutosh Jangam and Mahesh Dhole</span></p>
          </div>
        </div>
      </aside>
    </>
  );
}