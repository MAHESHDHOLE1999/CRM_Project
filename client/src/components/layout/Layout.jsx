// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Menu, Moon, Sun, Globe, LogOut } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useThemeStore } from '@/store/themeStore';
// import { useAuthStore } from '@/store/authStore';
// import Sidebar from './Sidebar';

// export default function Layout({ children }) {
//   const { t, i18n } = useTranslation();
//   const { theme, toggleTheme } = useThemeStore();
//   const { user, logout } = useAuthStore();
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const toggleLanguage = () => {
//     const newLang = i18n.language === 'en' ? 'mr' : 'en';
//     i18n.changeLanguage(newLang);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
//       {/* Main content with proper margin for sidebar */}
//       <div className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
//         {/* Header */}
//         <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//           >
//             <Menu className="h-5 w-5" />
//           </Button>

//           <div className="ml-auto flex items-center gap-2">
//             <Button variant="ghost" size="icon" onClick={toggleLanguage}>
//               <Globe className="h-5 w-5" />
//             </Button>
            
//             <Button variant="ghost" size="icon" onClick={toggleTheme}>
//               {theme === 'light' ? (
//                 <Moon className="h-5 w-5" />
//               ) : (
//                 <Sun className="h-5 w-5" />
//               )}
//             </Button>

//             <div className="flex items-center gap-2 ml-2">
//               <span className="text-sm font-medium hidden md:inline">{user?.username}</span>
//               <Button variant="ghost" size="icon" onClick={logout}>
//                 <LogOut className="h-5 w-5" />
//               </Button>
//             </div>
//           </div>
//         </header>

//         {/* Main content area */}
//         <main className="p-4 md:p-6">{children}</main>
//       </div>
//     </div>
//   );
// }

// File: src/components/layout/Layout.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Moon, Sun, Globe, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'mr' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content with proper margin for sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={t('common.loading')}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="ml-auto flex items-center gap-2">
            {/* Language Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleLanguage}
              title={i18n.language === 'en' ? 'मराठी' : 'English'}
              className="flex items-center justify-center"
            >
              <Globe className="h-5 w-5" />
              <span className="ml-1 text-xs font-semibold">
                {i18n.language.toUpperCase()}
              </span>
            </Button>
            
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              title={theme === 'light' ? t('common.close') : t('common.close')}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l">
              <span className="text-sm font-medium hidden md:inline truncate max-w-[150px]">
                {user?.username || 'User'}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={logout}
                title={t('auth.logout')}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}