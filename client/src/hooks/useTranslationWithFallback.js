// File: src/hooks/useTranslationWithFallback.js
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to safely get translations with fallback values
 * Usage: const { t } = useTranslationWithFallback();
 */
export const useTranslationWithFallback = () => {
  const { t, i18n } = useTranslation();

  // Wrapper function that provides better error handling
  const tSafe = (key, defaultValue = key) => {
    const result = t(key);
    // If key wasn't found, i18next returns the key itself
    return result === key ? defaultValue : result;
  };

  return { t: tSafe, i18n, language: i18n.language };
};

// ============================================================
// USAGE EXAMPLES IN YOUR COMPONENTS
// ============================================================

/*
1. IN DASHBOARD COMPONENT:
   
   import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
   
   export default function Dashboard() {
     const { t, language } = useTranslationWithFallback();
     
     return (
       <div>
         <h1>{t('dashboard.title')}</h1>
         <p>{t('dashboard.welcome')}</p>
         <Card>
           <CardTitle>{t('dashboard.totalBookings')}</CardTitle>
           <CardContent>{totalBookings}</CardContent>
         </Card>
       </div>
     );
   }


2. IN FORM COMPONENTS:
   
   export default function CustomerForm() {
     const { t } = useTranslationWithFallback();
     
     return (
       <form>
         <Label>{t('customer.name')}</Label>
         <Input placeholder={t('customer.search')} />
         
         <Label>{t('customer.phone')}</Label>
         <Input placeholder="9876543210" />
         
         <Label>{t('customer.address')}</Label>
         <Input placeholder={t('common.optional')} />
         
         <Button>{t('common.save')}</Button>
       </form>
     );
   }


3. IN TABLE HEADERS:
   
   <TableHead>{t('customer.name')}</TableHead>
   <TableHead>{t('customer.phone')}</TableHead>
   <TableHead>{t('customer.registrationDate')}</TableHead>
   <TableHead>{t('customer.totalAmount')}</TableHead>
   <TableHead>{t('customer.status')}</TableHead>


4. IN DIALOG/MODAL:
   
   <Dialog open={open} onOpenChange={setOpen}>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>{t('customer.addNew')}</DialogTitle>
       </DialogHeader>
       <CustomerForm />
     </DialogContent>
   </Dialog>


5. IN BUTTONS/ACTIONS:
   
   <Button onClick={handleDelete} variant="destructive">
     {t('common.delete')}
   </Button>
   
   <Button onClick={handleSave}>
     {t('common.save')}
   </Button>


6. IN TABLE ACTIONS:
   
   <Button
     variant="ghost"
     size="icon"
     onClick={() => handleEdit(item)}
     title={t('common.edit')}
   >
     <Edit className="h-4 w-4" />
   </Button>


7. IN TOAST NOTIFICATIONS:
   
   import { toast } from 'sonner';
   
   toast.success(t('common.savingSuccess'));
   toast.error(t('common.savingError'));
   toast.loading(t('common.loading'));


8. IN VALIDATION MESSAGES:
   
   {errors.name && (
     <p className="text-sm text-red-500 mt-1">
       {t('form.required')}
     </p>
   )}


9. IN EMPTY STATE MESSAGES:
   
   {items.length === 0 ? (
     <div className="text-center py-8">
       <p className="text-muted-foreground">{t('common.noData')}</p>
     </div>
   ) : (
     <ItemsList items={items} />
   )}


10. IN DYNAMIC BADGE/STATUS:
    
    const statusVariants = {
      'Active': 'default',
      'Completed': 'secondary',
      'Cancelled': 'destructive'
    };
    
    <Badge variant={statusVariants[status]}>
      {t(`customer.${status.toLowerCase()}`)}
    </Badge>
*/


// ============================================================
// COMPLETE TRANSLATION KEY STRUCTURE
// ============================================================

const TRANSLATION_KEYS = {
  // App & Layout
  'app.title': 'Ajay Gadhi Bandar CRM / अजय गढी बंदर CRM',
  
  // Authentication
  'auth.login': 'Login / लॉगिन',
  'auth.register': 'Register / नोंदणी करा',
  'auth.logout': 'Logout / लॉगआउट',
  
  // Dashboard
  'dashboard.title': 'Dashboard / डॅशबोर्ड',
  'dashboard.totalBookings': 'Total Bookings / एकूण बुकिंग',
  'dashboard.activeBookings': 'Active Bookings / सक्रिय बुकिंग',
  'dashboard.totalRevenue': 'Total Revenue / एकूण महसूल',
  
  // Customers
  'customer.title': 'Customers / ग्राहक',
  'customer.addNew': 'Add Customer / नवीन ग्राहक जोडा',
  'customer.name': 'Customer Name / ग्राहकाचे नाव',
  'customer.phone': 'Phone Number / फोन नंबर',
  'customer.status': 'Status / स्थिती',
  
  // Items
  'items.title': 'Items / वस्तू',
  'items.addNew': 'Add Item / नवीन वस्तू जोडा',
  'items.available': 'Available / उपलब्ध',
  
  // Bookings
  'booking.title': 'Bookings / बुकिंग',
  'booking.addNew': 'New Booking / नवीन बुकिंग',
  
  // Reports
  'report.title': 'Reports / अहवाल',
  
  // Common
  'common.save': 'Save / जतन करा',
  'common.cancel': 'Cancel / रद्द करा',
  'common.delete': 'Delete / हटवा',
  'common.loading': 'Loading / लोड होत आहे...'
};

export default TRANSLATION_KEYS;


// ============================================================
// HOW TO STORE LANGUAGE PREFERENCE
// ============================================================

// In your App.js or main i18n initialization:

export const saveLanguagePreference = (language) => {
  localStorage.setItem('language', language);
};

export const getLanguagePreference = () => {
  return localStorage.getItem('language') || 'en';
};

export const initializeLanguage = (i18n) => {
  const savedLanguage = getLanguagePreference();
  i18n.changeLanguage(savedLanguage);
};


// ============================================================
// COMPLETE i18n.js UPDATE
// ============================================================

/*
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: { translation: { ... } },
  mr: { translation: { ... } }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage']
  }
});

// Save language when it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ur' ? 'rtl' : 'ltr';
});

export default i18n;
*/