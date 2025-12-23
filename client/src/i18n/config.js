import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: { title: 'Ajay Gadhi Bandar CRM' },
      auth: {
        login: 'Login',
        register: 'Register',
        username: 'Username',
        email: 'Email',
        password: 'Password',
        logout: 'Logout'
      },
      dashboard: {
        title: 'Dashboard',
        totalBookings: 'Total Bookings',
        totalIncome: 'Total Income',
        pendingPayments: 'Pending Payments',
        todaysBookings: "Today's Bookings",
        activeBookings: 'Active Bookings'
      },
      customer: {
        title: 'Customers',
        addNew: 'Add Customer',
        name: 'Customer Name',
        phone: 'Phone Number',
        address: 'Address',
        registrationDate: 'Registration Date',
        checkIn: 'Check In',
        checkOut: 'Check Out',
        totalAmount: 'Total Amount',
        depositAmount: 'Deposit Amount',
        givenAmount: 'Given Amount',
        remainingAmount: 'Remaining Amount',
        transport: 'Transport Required',
        transportCost: 'Transport Cost',
        transportLocation: 'Transport Location',
        maintenanceCharges: 'Maintenance Charges',
        status: 'Status',
        fitterName: 'Fitter Name',
        active: 'Active',
        completed: 'Completed',
        cancelled: 'Cancelled',
        search: 'Search customers...',
        filterByStatus: 'Filter by Status',
        downloadBill: 'Download Bill',
        checkInTime: 'Check-in Time',
        checkOutTime: 'Check-out Time'
      },
      items: {
        title: 'Items',
        addNew: 'Add Item',
        name: 'Item Name',
        description: 'Description',
        price: 'Price',
        category: 'Category',
        status: 'Status',
        available: 'Available',
        notAvailable: 'Not Available',
        inUse: 'In Use'
      },
      booking: {
        title: 'Advanced Booking',
        addNew: 'New Booking',
        date: 'Booking Date',
        time: 'Time',
        startTime: 'Start Time',
        endTime: 'End Time'
      },
      report: {
        title: 'Reports',
        fitterReport: 'Fitter Report',
        downloadPDF: 'Download PDF',
        downloadCSV: 'Download CSV',
        dateRange: 'Date Range',
        from: 'From',
        to: 'To'
      },
      common: {
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        actions: 'Actions',
        loading: 'Loading...',
        noData: 'No data available',
        search: 'Search',
        filter: 'Filter',
        export: 'Export',
        print: 'Print',
        submit: 'Submit',
        close: 'Close'
      }
    }
  },
  mr: {
    translation: {
      app: { title: 'अजय गढी बंदर CRM' },
      auth: {
        login: 'लॉगिन',
        register: 'नोंदणी करा',
        username: 'वापरकर्ता नाव',
        email: 'ईमेल',
        password: 'पासवर्ड',
        logout: 'लॉगआउट'
      },
      dashboard: {
        title: 'डॅशबोर्ड',
        totalBookings: 'एकूण बुकिंग',
        totalIncome: 'एकूण उत्पन्न',
        pendingPayments: 'प्रलंबित देयके',
        todaysBookings: 'आजची बुकिंग',
        activeBookings: 'सक्रिय बुकिंग'
      },
      customer: {
        title: 'ग्राहक',
        addNew: 'नवीन ग्राहक जोडा',
        name: 'ग्राहकाचे नाव',
        phone: 'फोन नंबर',
        address: 'पत्ता',
        registrationDate: 'नोंदणी तारीख',
        checkIn: 'चेक इन',
        checkOut: 'चेक आउट',
        totalAmount: 'एकूण रक्कम',
        depositAmount: 'जमा रक्कम',
        givenAmount: 'दिलेली रक्कम',
        remainingAmount: 'बाकी रक्कम',
        transport: 'वाहतूक आवश्यक',
        transportCost: 'वाहतूक खर्च',
        transportLocation: 'वाहतूक स्थान',
        maintenanceCharges: 'देखभाल शुल्क',
        status: 'स्थिती',
        fitterName: 'फिटरचे नाव',
        active: 'सक्रिय',
        completed: 'पूर्ण',
        cancelled: 'रद्द',
        search: 'ग्राहक शोधा...',
        filterByStatus: 'स्थितीनुसार फिल्टर करा',
        downloadBill: 'बिल डाउनलोड करा',
        checkInTime: 'चेक-इन वेळ',
        checkOutTime: 'चेक-आउट वेळ'
      },
      items: {
        title: 'वस्तू',
        addNew: 'नवीन वस्तू जोडा',
        name: 'वस्तूचे नाव',
        description: 'वर्णन',
        price: 'किंमत',
        category: 'श्रेणी',
        status: 'स्थिती',
        available: 'उपलब्ध',
        notAvailable: 'उपलब्ध नाही',
        inUse: 'वापरात'
      },
      booking: {
        title: 'आगाऊ बुकिंग',
        addNew: 'नवीन बुकिंग',
        date: 'बुकिंग तारीख',
        time: 'वेळ',
        startTime: 'सुरुवातीची वेळ',
        endTime: 'शेवटची वेळ'
      },
      report: {
        title: 'अहवाल',
        fitterReport: 'फिटर अहवाल',
        downloadPDF: 'PDF डाउनलोड करा',
        downloadCSV: 'CSV डाउनलोड करा',
        dateRange: 'तारीख श्रेणी',
        from: 'पासून',
        to: 'पर्यंत'
      },
      common: {
        save: 'जतन करा',
        cancel: 'रद्द करा',
        edit: 'संपादित करा',
        delete: 'हटवा',
        actions: 'क्रिया',
        loading: 'लोड होत आहे...',
        noData: 'डेटा उपलब्ध नाही',
        search: 'शोधा',
        filter: 'फिल्टर',
        export: 'निर्यात करा',
        print: 'प्रिंट करा',
        submit: 'सबमिट करा',
        close: 'बंद करा'
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
