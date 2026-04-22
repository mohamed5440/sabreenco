import { optimizeImageUrl } from "../lib/utils";
import React, { useState, useEffect, useMemo } from "react";
import { Booking } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RePieChart, Pie } from "recharts";
import { Users, FileText, Briefcase, Calendar, ShieldCheck, Zap, CheckCircle, Globe, Menu, X, Mail, Phone, LayoutDashboard, User, LogOut, Plus, Trash2, Edit, TrendingUp, Search, Clock, Eye, Facebook, Twitter, Instagram, Share2, Info, MapPin, Download, CheckCircle2, AlertCircle, AlertTriangle, Check, MessageCircle, Upload, Home, Lightbulb, RefreshCw, Briefcase as Portfolio, Settings, EyeOff, Printer, Shield, Layers, ChevronUp, ChevronDown, Bell } from "lucide-react";
import { WhatsAppIcon } from "../components/WhatsAppIcon";
import { apiService } from "../lib/apiService";
export function DashboardPage({ 
  onLogout, 
  onNavigate,
  offers, 
  setOffers, 
  destinations, 
  setDestinations, 
  bookings, 
  setBookings,
  visas,
  setVisas,
  socialLinks,
  setSocialLinks,
  contactInfo,
  setContactInfo,
  onRefresh
}: { 
  onLogout: () => void,
  onNavigate: (page: string) => void,
  offers: any[],
  setOffers: (offers: any[]) => void,
  destinations: any[],
  setDestinations: (destinations: any[]) => void,
  bookings: any[],
  setBookings: (bookings: any[]) => void,
  visas: any[],
  setVisas: (visas: any[]) => void,
  socialLinks: any[],
  setSocialLinks: (links: any[]) => void,
  contactInfo: any,
  setContactInfo: (info: any) => void,
  onRefresh?: () => Promise<void>
}) {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (activeTab === 'subscribers') {
      apiService.getSubscribers().then(data => setSubscribers(data || [])).catch(err => console.error(err));
    }
  }, [activeTab]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [viewBooking, setViewBooking] = useState<any>(null);
  const [isFetchingBookingDetails, setIsFetchingBookingDetails] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ message: string, onConfirm: () => void } | null>(null);
  const [featureInput, setFeatureInput] = useState('');
  const [notIncludedInput, setNotIncludedInput] = useState('');

  const handleAddFeature = (e?: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    
    if (featureInput.trim()) {
      let currentFeatures: string[] = [];
      if (Array.isArray(formData.features)) {
        currentFeatures = formData.features;
      } else if (typeof formData.features === 'string' && formData.features.trim() !== '') {
        currentFeatures = formData.features.split(',').map((f: string) => f.trim());
      }
      setFormData({ ...formData, features: [...currentFeatures, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const handleAddNotIncluded = (e?: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    
    if (notIncludedInput.trim()) {
      let currentNotIncluded: string[] = [];
      if (Array.isArray(formData.notIncluded)) {
        currentNotIncluded = formData.notIncluded;
      } else if (typeof formData.notIncluded === 'string' && formData.notIncluded.trim() !== '') {
        currentNotIncluded = formData.notIncluded.split(',').map((f: string) => f.trim());
      }
      setFormData({ ...formData, notIncluded: [...currentNotIncluded, notIncludedInput.trim()] });
      setNotIncludedInput('');
    }
  };

  const removeFeature = (index: number) => {
    let currentFeatures: string[] = [];
    if (Array.isArray(formData.features)) {
      currentFeatures = formData.features;
    } else if (typeof formData.features === 'string' && formData.features.trim() !== '') {
      currentFeatures = formData.features.split(',').map((f: string) => f.trim());
    }
    const newFeatures = [...currentFeatures];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  const removeNotIncluded = (index: number) => {
    let currentNotIncluded: string[] = [];
    if (Array.isArray(formData.notIncluded)) {
      currentNotIncluded = formData.notIncluded;
    } else if (typeof formData.notIncluded === 'string' && formData.notIncluded.trim() !== '') {
      currentNotIncluded = formData.notIncluded.split(',').map((f: string) => f.trim());
    }
    const newNotIncluded = [...currentNotIncluded];
    newNotIncluded.splice(index, 1);
    setFormData({ ...formData, notIncluded: newNotIncluded });
  };

  const [localSocialLinks, setLocalSocialLinks] = useState<any[]>(Array.isArray(socialLinks) ? socialLinks : []);
  const [localContactInfo, setLocalContactInfo] = useState<any>(contactInfo && typeof contactInfo === 'object' ? {
    ...contactInfo,
    phones: Array.isArray(contactInfo.phones) ? contactInfo.phones : (typeof contactInfo.phones === 'string' ? JSON.parse(contactInfo.phones || '[]') : [])
  } : { phones: [], email: '', address: '', addressUrl: '' });

  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Calculate booking stats for charts
  const bookingStats = useMemo(() => {
    const stats = [];
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      stats.push({ name: dayName, value: 0, date: d.toISOString().split('T')[0] });
    }
    
    (bookings || []).forEach(booking => {
      if (!booking.created_at) return;
      const bDate = new Date(booking.created_at).toISOString().split('T')[0];
      const statIndex = stats.findIndex(s => s.date === bDate);
      if (statIndex !== -1) stats[statIndex].value += 1;
    });
    
    return stats;
  }, [bookings]);

  const serviceDistribution = useMemo(() => {
    const distribution = [
      { name: 'طيران', value: 0, color: 'var(--color-primary)', types: ['flight'] },
      { name: 'فنادق', value: 0, color: 'var(--color-primary-muted)', types: ['hotel'] },
      { name: 'تأشيرات', value: 0, color: 'var(--color-primary-soft-border)', types: ['visa', 'visa_uae', 'visa_other'] },
      { name: 'عمرة', value: 0, color: 'var(--color-primary-soft)', types: ['umrah'] },
      { name: 'أخرى', value: 0, color: 'var(--color-border)', types: [] },
    ];
    
    (bookings || []).forEach(booking => {
      const type = booking.serviceType;
      const index = distribution.findIndex(d => d.types.includes(type));
      if (index !== -1) {
        distribution[index].value += 1;
      } else {
        distribution[4].value += 1; // Other
      }
    });
    
    const filtered = distribution.filter(d => d.value > 0);
    return filtered.length > 0 ? filtered : [{ name: 'لا توجد بيانات', value: 1, color: 'var(--color-border)' }];
  }, [bookings]);

  useEffect(() => {
    if (socialLinks && Array.isArray(socialLinks)) {
      setLocalSocialLinks(socialLinks);
    }
  }, [socialLinks]);

  useEffect(() => {
    if (contactInfo) {
      const phones = Array.isArray(contactInfo.phones) ? contactInfo.phones : (typeof contactInfo.phones === 'string' ? JSON.parse(contactInfo.phones || '[]') : []);
      setLocalContactInfo({ ...contactInfo, phones });
    }
  }, [contactInfo]);

  const handleSaveSettings = async () => {
    try {
      await Promise.all([
        apiService.updateSocialLinks(localSocialLinks),
        apiService.updateContactInfo(localContactInfo)
      ]);
      if (onRefresh) await onRefresh();
      showToast('تم حفظ الإعدادات بنجاح');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      showToast(`حدث خطأ أثناء حفظ الإعدادات: ${error.message || ''}`, 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      showToast('كلمتا المرور غير متطابقتين', 'error');
      return;
    }
    if (passwordForm.new.length < 6) {
      showToast('يجب أن تكون كلمة المرور 6 أحرف على الأقل', 'error');
      return;
    }
    setIsChangingPassword(true);
    try {
      await apiService.updatePassword(passwordForm.current, passwordForm.new);
      showToast('تم تغيير كلمة المرور بنجاح');
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      showToast(error.message || 'فشل تغيير كلمة المرور', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'error') return; // Silence error toasts as per user request
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({});
    }
  }, [editingItem]);

  const filteredOffers = useMemo(() => offers.filter(offer => {
    const query = searchQuery.toLowerCase();
    return (offer.title?.toLowerCase() || '').includes(query) || 
           (offer.status?.toLowerCase() || '').includes(query) ||
           (offer.price?.toLowerCase() || '').includes(query);
  }), [offers, searchQuery]);

  const filteredVisas = useMemo(() => visas.filter(visa => {
    const query = searchQuery.toLowerCase();
    return (visa.title?.toLowerCase() || '').includes(query) || 
           (visa.status?.toLowerCase() || '').includes(query) ||
           (visa.price?.toLowerCase() || '').includes(query);
  }), [visas, searchQuery]);

  const filteredDestinations = useMemo(() => destinations.filter(dest => {
    const query = searchQuery.toLowerCase();
    return (dest.name?.toLowerCase() || '').includes(query) || 
           (dest.description?.toLowerCase() || '').includes(query);
  }), [destinations, searchQuery]);

  const [statusFilter, setStatusFilter] = useState('الكل');

  const filteredBookings = useMemo(() => bookings.filter(booking => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (booking.name?.toLowerCase() || '').includes(query) || 
           (booking.phone?.toLowerCase() || '').includes(query) ||
           (booking.serviceType?.toLowerCase() || '').includes(query) ||
           (booking.user?.toLowerCase() || '').includes(query) ||
           (booking.id?.toLowerCase() || '').includes(query);
    
    const matchesStatus = statusFilter === 'الكل' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }), [bookings, searchQuery, statusFilter]);

  const handleDeleteOffer = (id: number) => {
    setConfirmModal({
      message: 'هل أنت متأكد من حذف هذا العرض؟ سيؤدي هذا إلى إزالته نهائياً من الموقع.',
      onConfirm: async () => {
        try {
          await apiService.deleteOffer(id);
          if (onRefresh) await onRefresh();
          showToast('تم حذف العرض بنجاح');
        } catch (error: any) {
          console.error('Error deleting offer:', error);
          showToast(`حدث خطأ أثناء حذف العرض: ${error.message || ''}`, 'error');
        }
        setConfirmModal(null);
      }
    });
  };

  const handleDeleteDestination = (id: number) => {
    setConfirmModal({
      message: 'هل أنت متأكد من حذف هذه الوجهة؟ قد يؤثر ذلك على العروض المرتبطة بها.',
      onConfirm: async () => {
        try {
          await apiService.deleteDestination(id);
          if (onRefresh) await onRefresh();
          showToast('تم حذف الوجهة بنجاح');
        } catch (error: any) {
          console.error('Error deleting destination:', error);
          showToast(`حدث خطأ أثناء حذف الوجهة: ${error.message || ''}`, 'error');
        }
        setConfirmModal(null);
      }
    });
  };

  const handleDeleteVisa = (id: number) => {
    setConfirmModal({
      message: 'هل أنت متأكد من حذف هذه التأشيرة؟ سيؤدي هذا إلى إزالتها نهائياً من الموقع.',
      onConfirm: async () => {
        try {
          await apiService.deleteVisa(id);
          if (onRefresh) await onRefresh();
          showToast('تم حذف التأشيرة بنجاح');
        } catch (error: any) {
          console.error('Error deleting visa:', error);
          showToast(`حدث خطأ أثناء حذف التأشيرة: ${error.message || ''}`, 'error');
        }
        setConfirmModal(null);
      }
    });
  };

  const handleDeleteBooking = (id: string | number) => {
    setConfirmModal({
      message: 'هل أنت متأكد من حذف هذا الحجز؟ سيؤدي هذا إلى إزالته نهائياً.',
      onConfirm: async () => {
        try {
          await apiService.deleteBooking(id);
          if (onRefresh) await onRefresh();
          showToast('تم حذف الحجز بنجاح');
        } catch (error: any) {
          console.error('Error deleting booking:', error);
          showToast(`حدث خطأ أثناء حذف الحجز: ${error.message || ''}`, 'error');
        }
        setConfirmModal(null);
      }
    });
  };

  const handleViewBookingDetails = async (booking: Booking | any) => {
    setViewBooking(booking);
    setIsFetchingBookingDetails(true);
    try {
      const fullBooking = await apiService.getBooking(booking.id);
      setViewBooking((prev: any) => ({ ...prev, ...fullBooking }));
    } catch (e: any) {
      console.error(e);
      showToast(`تعذر تحميل تفاصيل الحجز كاملة: ${e.message || 'خطأ غير معروف'}`, 'error');
    } finally {
      setIsFetchingBookingDetails(false);
    }
  };

  const handleUpdateBookingStatus = async (id: string | number, newStatus: string) => {
    try {
      await apiService.updateBookingStatus(id, newStatus);
      if (onRefresh) await onRefresh();
      showToast(`تم تحديث حالة الحجز إلى ${newStatus}`);
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      showToast(`حدث خطأ أثناء تحديث حالة الحجز: ${error.message || ''}`, 'error');
    }
  };

  const handleMoveItem = async (type: 'offers' | 'visas' | 'destinations', id: any, direction: 'up' | 'down') => {
    const list = type === 'offers' ? offers : type === 'visas' ? visas : destinations;
    const currentIndex = list.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const newList = [...list];
    // Swap positions
    [newList[currentIndex], newList[targetIndex]] = [newList[targetIndex], newList[currentIndex]];

    // Map to new sort_orders (simple: use index)
    const reorderedItems = newList.map((item, index) => ({
      id: item.id,
      sort_order: index
    }));

    try {
      showToast('جاري ترتيب العناصر...');
      await apiService.updateSortOrder(type, reorderedItems);
      if (onRefresh) await onRefresh();
      showToast('تم تحديث الترتيب بنجاح');
    } catch (error: any) {
      console.error('Error reordering:', error);
      showToast('حدث خطأ أثناء إعادة الترتيب', 'error');
    }
  };

  const handleDuplicateOffer = async (offer: any) => {
    try {
      const newOfferData = { ...offer, id: Date.now(), title: `${offer.title} (نسخة)` };
      await apiService.addOffer(newOfferData);
      if (onRefresh) await onRefresh();
      showToast('تم تكرار العرض بنجاح');
    } catch (error) {
      console.error('Error duplicating offer:', error);
      showToast('حدث خطأ أثناء تكرار العرض', 'error');
    }
  };

  const handleDuplicateVisa = async (visa: any) => {
    try {
      const newVisaData = { ...visa, id: Date.now(), title: `${visa.title} (نسخة)` };
      await apiService.addVisa(newVisaData);
      if (onRefresh) await onRefresh();
      showToast('تم تكرار التأشيرة بنجاح');
    } catch (error) {
      console.error('Error duplicating visa:', error);
      showToast('حدث خطأ أثناء تكرار التأشيرة', 'error');
    }
  };

  const pendingBookingsCount = bookings.filter(b => b.status === 'قيد الانتظار').length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('حجم الصورة كبير جداً. الحد الأقصى هو 10 ميجابايت لتجنب مشاكل الحفظ.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

//   if (activeTab === 'offers') {
//     if (!formData.image) {
//       showToast('يرجى إضافة صورة للعرض', 'error');
//       return;
//     }
//     ...
//   }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'offers') {
        let features = formData.features && Array.isArray(formData.features) ? formData.features : (formData.features ? String(formData.features).split(/[,،]/).map(f => f.trim()).filter(Boolean) : []);
        if (featureInput.trim()) {
          features.push(featureInput.trim());
          setFeatureInput('');
        }
        let notIncluded = formData.notIncluded && Array.isArray(formData.notIncluded) ? formData.notIncluded : (formData.notIncluded ? String(formData.notIncluded).split(/[,،]/).map(f => f.trim()).filter(Boolean) : []);
        if (notIncludedInput.trim()) {
          notIncluded.push(notIncludedInput.trim());
          setNotIncludedInput('');
        }
        const offerData = { ...formData, features, notIncluded };
        if (editingItem) {
          await apiService.updateOffer({ ...offerData, id: editingItem.id });
          showToast('تم تحديث العرض بنجاح');
        } else {
          await apiService.addOffer({ ...offerData, id: Date.now() });
          showToast('تمت إضافة العرض بنجاح');
        }
      } else if (activeTab === 'destinations') {
        const destData = {
          name: formData.name,
          image: formData.image,
          category: formData.category,
          description: formData.description
        };
        if (editingItem) {
          await apiService.updateDestination({ ...destData, id: editingItem.id });
          showToast('تم تحديث الوجهة بنجاح');
        } else {
          await apiService.addDestination({ ...destData, id: Date.now() });
          showToast('تمت إضافة الوجهة بنجاح');
        }
      } else if (activeTab === 'visas') {
        let features = formData.features && Array.isArray(formData.features) ? formData.features : (formData.features ? String(formData.features).split(/[,،]/).map(f => f.trim()).filter(Boolean) : []);
        if (featureInput.trim()) {
          features.push(featureInput.trim());
          setFeatureInput('');
        }
        const visaData = { ...formData, features };
        if (editingItem) {
          await apiService.updateVisa({ ...visaData, id: editingItem.id });
          showToast('تم تحديث التأشيرة بنجاح');
        } else {
          await apiService.addVisa({ ...visaData, id: Date.now() });
          showToast('تمت إضافة التأشيرة بنجاح');
        }
      }
      if (onRefresh) await onRefresh();
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({});
    } catch (error: any) {
      console.error('Error saving item:', error);
      showToast(`حدث خطأ أثناء الحفظ: ${error.message || ''}`, 'error');
    }
  };

  const menuItems = [
    { id: 'overview', label: 'نظرة عامة', icon: <LayoutDashboard size={20} />, color: 'primary', desc: 'إحصائيات عامة' },
    { id: 'bookings', label: 'الحجوزات', icon: <FileText size={20} />, color: 'primary', desc: 'إدارة طلبات العملاء' },
    { id: 'offers', label: 'العروض', icon: <Briefcase size={20} />, color: 'primary', desc: 'إدارة عروض الرحلات' },
    { id: 'visas', label: 'التأشيرات', icon: <ShieldCheck size={20} />, color: 'primary', desc: 'إدارة خدمات التأشيرات' },
    { id: 'destinations', label: 'الوجهات', icon: <MapPin size={20} />, color: 'primary', desc: 'إدارة الوجهات السياحية' },
    { id: 'subscribers', label: 'المشتركون', icon: <Bell size={20} />, color: 'primary', desc: 'تنبيهات واتساب' },
    { id: 'settings', label: 'الإعدادات', icon: <Settings size={20} />, color: 'primary', desc: 'إدارة معلومات التواصل' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-success-soft text-success border-success-soft-border';
      case 'قيد الانتظار': return 'bg-warning-soft text-warning border-warning-soft-border';
      case 'ملغي': return 'bg-danger-soft text-danger border-danger-soft-border';
      case 'نشط': return 'bg-success-soft text-success border-success-soft-border';
      case 'غير نشط': return 'bg-surface-alt text-muted-light border-border';
      default: return 'bg-surface-alt text-muted-light border-border';
    }
  };

  return (
    <div className="min-h-[100dvh] bg-surface flex overflow-hidden" dir="rtl">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-muted-dark/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside className={`fixed lg:static top-0 right-0 bottom-0 w-64 sm:w-72 bg-surface border-l border-border z-50 transition-transform duration-500 ease-in-out lg: ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-border flex items-center justify-between bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center overflow-hidden border border-border shrink-0">
              <img loading="lazy" decoding="async" src="https://i.postimg.cc/t4cfJRBD/FB-IMG-1775329049732.jpg" 
                alt="صابرينكو للخدمات السياحية" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-bold text-muted-dark leading-tight">صابرينكو <span className="text-primary">سياحة</span></span>
              <span className="text-[10px] md:text-xs font-bold text-muted-light uppercase tracking-widest">لوحة التحكم</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2.5 text-muted-light hover:text-primary hover:bg-primary-light rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>
 
        <div className="p-4 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar h-[calc(100dvh-180px)]">
          <p className="label-caps mb-2 px-4 text-[10px] text-muted-light/60">القائمة الرئيسية</p>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group relative active:scale-95 ${
                activeTab === item.id 
                ? 'bg-primary-soft/30 text-primary' 
                : 'text-muted hover:bg-surface-alt hover:text-primary'
              }`}
            >
              <span className={`transition-all duration-300 ${activeTab === item.id ? 'scale-110 text-primary' : 'group-hover:scale-110 text-muted-light group-hover:text-primary'}`}>
                {item.icon}
              </span>
              <div className="flex flex-col text-right">
                <span className="text-sm font-bold">{item.label}</span>
                <span className={`text-[10px] font-medium transition-colors ${activeTab === item.id ? 'text-primary/70' : 'text-muted-light/70'}`}>{item.desc}</span>
              </div>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"
                />
              )}
            </button>
          ))}
        </div>
 
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-surface space-y-2">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-sm text-primary hover:bg-primary/5 transition-all group active:scale-95">
            <Home size={18} className="group-hover:-translate-x-1 transition-transform" />
            العودة للموقع
          </button>
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-sm text-danger hover:bg-danger-soft transition-all group active:scale-95">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

 {/* Main Content */}
 <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden bg-surface">
 {/* Header */}
 <header className="bg-surface border-b border-border p-4 md:px-8 flex items-center justify-between sticky top-0 z-30 h-16 md:h-20">
 <div className="flex items-center gap-4 flex-1">
 <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-muted hover:bg-primary-light hover:text-primary rounded-xl transition-all border border-border">
 <Menu size={20} className="md:w-6 md:h-6" />
 </button>
 <div className="flex items-center gap-3">
 <div className="w-1.5 h-8 bg-primary rounded-full hidden sm:block"></div>
 <div className="flex flex-col">
 <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-muted-dark leading-tight flex items-center gap-2">
 {menuItems.find(m => m.id === activeTab)?.label}
 </h1>
 <p className="text-[10px] md:text-xs font-bold text-muted uppercase tracking-widest hidden sm:block">{menuItems.find(m => m.id === activeTab)?.desc}</p>
 </div>
 </div>
 </div>
 <div className="flex items-center gap-2 md:gap-3">
 <button 
 onClick={async () => {
   if (onRefresh) {
     showToast('جاري تحديث البيانات...');
     try {
       await onRefresh();
       showToast('تم تحديث البيانات بنجاح');
     } catch (err) {
       showToast('فشل تحديث البيانات', 'error');
     }
   }
 }}
 className="p-2.5 text-muted hover:bg-primary-light hover:text-primary rounded-xl transition-all active:scale-95"
 title="تحديث البيانات"
 >
 <RefreshCw size={20} />
 </button>
 <div className="relative hidden sm:block group flex-1 max-w-sm">
 <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors"/>
 <input 
   type="text"
   placeholder="بحث سريع..."
   value={searchQuery}
   onChange={(e) => setSearchQuery(e.target.value)}
   className="w-full bg-surface border border-border-hover rounded-xl pr-11 pl-4 py-3 md:py-3.5 text-sm font-bold text-muted-dark focus:outline-none focus:border-primary transition-all"
 />
 </div>
 {['offers', 'visas', 'destinations'].includes(activeTab) && (
 <button 
 onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
 className="flex items-center gap-2 px-4 md:px-8 py-3.5 md:py-4 bg-primary text-white rounded-xl text-sm md:text-base font-extrabold hover:bg-primary-hover transition-all duration-300 active:scale-95"
 >
 <Plus size={20} />
 <span className="hidden sm:inline">إضافة جديد</span>
 </button>
 )}
 </div>
 </header>

 {/* Content Area */}
 <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface no-print pb-24">
  <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
  <div className="relative sm:hidden mb-6 group">
    <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors"/>
    <input 
      type="text"
      placeholder="بحث سريع..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full bg-surface border border-border-hover rounded-xl pr-11 pl-4 py-3 text-sm font-medium text-muted-dark focus:outline-none focus:border-primary transition-all"
    />
  </div>
  {activeTab === 'overview' ? (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {[
          { icon: <Briefcase size={20} />, label: 'العروض', value: offers.length, bg: 'bg-primary-light', text: 'text-primary' },
          { icon: <ShieldCheck size={20} />, label: 'التأشيرات', value: visas.length, bg: 'bg-primary-light', text: 'text-primary' },
          { icon: <MapPin size={20} />, label: 'الوجهات', value: destinations.length, bg: 'bg-primary-light', text: 'text-primary' },
          { icon: <Calendar size={20} />, label: 'الحجوزات', value: bookings.length, bg: 'bg-primary-light', text: 'text-primary' },
          { icon: <Clock size={20} />, label: 'طلبات معلقة', value: pendingBookingsCount, bg: 'bg-warning-soft', text: 'text-warning' },
          { icon: <Share2 size={20} />, label: 'الروابط', value: socialLinks.length, bg: 'bg-primary-light', text: 'text-primary' }
        ].map((stat, i) => (
          <div key={i} className="bg-surface p-3.5 sm:p-5 lg:p-6 rounded-2xl border border-border flex flex-col md:flex-row items-center gap-2 sm:gap-4 group hover:border-primary-soft-border transition-all">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${stat.bg} rounded-xl flex items-center justify-center ${stat.text} group-hover:scale-110 transition-transform shrink-0`}>
              {stat.icon}
            </div>
            <div className="flex flex-col text-center md:text-right">
              <p className="text-[9px] sm:text-[10px] lg:text-xs font-bold text-muted uppercase tracking-widest mb-0.5 sm:mb-1">{stat.label}</p>
              <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-muted-dark">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
 {/* Analytics Chart */}
 <div className="lg:col-span-2 bg-surface rounded-2xl border border-border overflow-hidden">
 <div className="p-4 md:p-6 lg:p-8 border-b border-border flex items-center justify-between bg-surface">
 <h3 className="text-base md:text-lg font-bold text-muted-dark flex items-center gap-2">
 <div className="accent-line"></div>
 إحصائيات الحجوزات (آخر 7 أيام)
 </h3>
 <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest">
 <TrendingUp size={16} className="text-success" />
 +12% نمو
 </div>
 </div>
 <div className="p-4 md:p-6 lg:p-8 w-full min-w-0">
 <ResponsiveContainer width="100%" height={300}>
 <AreaChart data={bookingStats}>
 <defs>
 <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
 <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
 <XAxis 
 dataKey="name" 
 axisLine={false} 
 tickLine={false} 
 tick={{ fill: 'var(--color-muted)', fontSize: 12, fontWeight: 600 }}
 dy={10}
 />
 <YAxis 
 axisLine={false} 
 tickLine={false} 
 tick={{ fill: 'var(--color-muted)', fontSize: 12, fontWeight: 600 }}
 />
 <Tooltip 
 contentStyle={{ 
 backgroundColor: 'var(--color-surface)', 
 borderRadius: '16px', 
 border: '1px solid var(--color-border)',
 boxShadow: 'none'
 }}
 />
 <Area 
 type="monotone" 
 dataKey="value" 
 stroke="var(--color-primary)" 
 strokeWidth={3}
 fillOpacity={1} 
 fill="url(#colorValue)" 
 />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Service Distribution */}
 <div className="bg-surface rounded-2xl border border-border overflow-hidden">
 <div className="p-4 md:p-6 lg:p-8 border-b border-border bg-surface">
 <h3 className="text-base md:text-lg font-bold text-muted-dark flex items-center gap-2">
 <div className="accent-line"></div>
 توزيع الخدمات
 </h3>
 </div>
 <div className="p-4 md:p-6 lg:p-8 w-full min-w-0">
 <ResponsiveContainer width="100%" height={300}>
 <RePieChart>
 <Pie
 data={serviceDistribution}
 cx="50%"
 cy="50%"
 innerRadius={60}
 outerRadius={80}
 paddingAngle={5}
 dataKey="value"
 >
 {serviceDistribution.map((entry, index) => (
   <Cell key={`cell-${index}`} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip 
 contentStyle={{ 
 backgroundColor: 'var(--color-surface)', 
 borderRadius: '16px', 
 border: '1px solid var(--color-border)',
 boxShadow: 'none'
 }}
 />
 </RePieChart>
 </ResponsiveContainer>
 <div className="grid grid-cols-2 gap-3 mt-6 bg-surface-alt/50 p-4 rounded-2xl border border-border">
   {serviceDistribution.map((entry, index) => (
     <div key={`dist-legend-${entry.name}-${index}`} className="flex items-center justify-between p-2 rounded-xl hover:bg-surface transition-colors">
       <div className="flex items-center gap-3">
         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
         <span className="text-xs lg:text-sm font-bold text-muted-dark">{entry.name}</span>
       </div>
       <span className="text-xs font-bold text-muted">{entry.value}%</span>
     </div>
   ))}
 </div>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Recent Bookings */}
 <div className="lg:col-span-2 bg-surface rounded-2xl border border-border overflow-hidden">
 <div className="p-4 md:p-6 lg:p-8 border-b border-border flex items-center justify-between bg-surface">
 <h3 className="text-base md:text-lg font-bold text-muted-dark flex items-center gap-2">
 <div className="accent-line"></div>
 أحدث الحجوزات
 </h3>
 <button onClick={() => setActiveTab('bookings')} className="text-sm font-bold text-primary hover:underline transition-all">عرض الكل</button>
 </div>
 
 <div className="md:hidden flex flex-col divide-y divide-border">
  {bookings.slice(0, 5).map(booking => (
    <div key={booking.id} className="p-4 space-y-3 hover:bg-surface-alt/50 transition-colors">
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="font-bold text-muted-dark text-sm">{booking.user || booking.name}</div>
          <div className="text-[10px] text-muted font-medium mt-0.5 max-w-[150px] truncate">{booking.id}</div>
        </div>
        <span className={`shrink-0 px-2.5 py-1 rounded-2xl text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(booking.status)}`}>
        {booking.status}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <div className="font-medium text-muted-dark"><span className="text-muted ml-1">الخدمة:</span> {booking.service || booking.serviceType}</div>
        <div className="font-medium text-muted grow text-left"><span className="text-muted ml-1">التاريخ:</span> {booking.date}</div>
      </div>
    </div>
  ))}
 </div>

 <div className="hidden md:block overflow-x-auto hide-scrollbar">
 <table className="w-full text-right">
 <thead className="bg-surface border-b border-border">
 <tr>
 <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">العميل</th>
 <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">الخدمة</th>
 <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">التاريخ</th>
 <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest text-center">الحالة</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-surface-alt">
 {bookings.slice(0, 5).map(booking => (
 <tr key={booking.id} className="hover:bg-surface-alt/50 transition-colors">
 <td className="px-4 md:px-6 py-4">
 <div className="font-bold text-muted-dark text-sm md:text-base">{booking.user || booking.name}</div>
 <div className="text-2xs md:text-xs text-muted font-medium">{booking.id}</div>
 </td>
 <td className="px-4 md:px-6 py-4">
 <span className="text-xs md:text-sm font-medium text-muted-dark">{booking.service || booking.serviceType}</span>
 </td>
 <td className="px-4 md:px-6 py-4">
 <span className="text-xs md:text-sm font-medium text-muted">{booking.date}</span>
 </td>
 <td className="px-4 md:px-6 py-4 text-center">
 <span className={`px-2 md:px-3 py-1 rounded-2xl text-[9px] md:text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(booking.status)}`}>
 {booking.status}
 </span>
 </td>
 </tr>
 ))}
  {activeTab === 'offers' && filteredOffers.length === 0 && (
    <tr>
      <td colSpan={5} className="px-6 py-20 text-center text-muted font-bold">
        لا توجد عروض مطابقة للبحث
      </td>
    </tr>
  )}
  {activeTab === 'visas' && filteredVisas.length === 0 && (
    <tr>
      <td colSpan={5} className="px-6 py-20 text-center text-muted font-bold">
        لا توجد تأشيرات مطابقة للبحث
      </td>
    </tr>
  )}
  {activeTab === 'destinations' && filteredDestinations.length === 0 && (
    <tr>
      <td colSpan={5} className="px-6 py-20 text-center text-muted font-bold">
        لا توجد وجهات مطابقة للبحث
      </td>
    </tr>
  )}
  {activeTab === 'bookings' && filteredBookings.length === 0 && (
    <tr>
      <td colSpan={6} className="px-6 py-20 text-center text-muted font-bold">
        لا توجد حجوزات مطابقة للبحث أو الفلتر
      </td>
    </tr>
  )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Quick Actions & Tips */}
 <div className="space-y-6">
 <div className="bg-surface p-4 md:p-6 lg:p-8 rounded-2xl border border-border">
 <h3 className="text-base md:text-lg font-bold text-muted-dark mb-6 flex items-center gap-2">
 <div className="accent-line"></div>
 إجراءات سريعة
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
 <button 
 onClick={() => { setActiveTab('offers'); setEditingItem(null); setIsModalOpen(true); }}
 className="flex items-center gap-3 p-4 rounded-2xl border border-border hover:border-primary-soft-border hover:bg-primary-light transition-all group text-right"
 >
 <div className="w-10 h-10 bg-primary-soft text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
 <Plus size={22} />
 </div>
 <div>
 <div className="text-sm font-bold text-muted-dark">إضافة عرض جديد</div>
 <div className="text-xs text-muted font-medium">نشر رحلة أو باقة جديدة</div>
 </div>
 </button>
 <button 
 onClick={() => { setActiveTab('visas'); setEditingItem(null); setIsModalOpen(true); }}
 className="flex items-center gap-3 p-4 rounded-2xl border border-border hover:border-primary-soft-border hover:bg-primary-light transition-all group text-right"
 >
 <div className="w-10 h-10 bg-primary-soft text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
 <ShieldCheck size={20} />
 </div>
 <div>
 <div className="text-sm font-bold text-muted-dark">إضافة تأشيرة</div>
 <div className="text-xs text-muted font-medium">تحديث قائمة التأشيرات المتاحة</div>
 </div>
 </button>
 <button 
 onClick={() => { setActiveTab('settings'); }}
 className="flex items-center gap-3 p-4 rounded-2xl border border-border hover:border-primary-soft-border hover:bg-primary-light transition-all group text-right"
 >
 <div className="w-10 h-10 bg-primary-soft text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
 <Settings size={20} />
 </div>
 <div>
 <div className="text-sm font-bold text-muted-dark">إعدادات التواصل</div>
 <div className="text-xs text-muted font-medium">تحديث أرقام الهاتف والروابط</div>
 </div>
 </button>
 </div>
 </div>

 <div className="bg-primary p-8 rounded-2xl text-white relative overflow-hidden group">
 <div className="relative z-10 flex flex-col items-start gap-4">
 <div className="w-12 h-12 bg-surface/20 rounded-2xl flex items-center justify-center text-white shrink-0">
 <Lightbulb size={24} />
 </div>
 <div>
 <h4 className="font-bold text-xl mb-2 text-white">نصيحة اليوم</h4>
 <p className="text-base text-white/90 leading-[1.7] font-medium">
 قم بتحديث صور العروض بانتظام لجذب المزيد من العملاء. الصور عالية الجودة تزيد من نسبة الحجز بنسبة 40%.
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 ) : activeTab === 'subscribers' ? (
     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="bg-surface rounded-2xl md:rounded-3xl border border-border overflow-hidden">
         <div className="p-4 md:p-8 border-b border-border flex items-center justify-between bg-surface-alt/30">
           <h3 className="text-base md:text-xl font-bold text-muted-dark flex items-center gap-2 md:gap-3">
             <div className="accent-line"></div>
             المشتركون في تنبيهات الواتساب
             <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">{subscribers.length} مشترك</span>
           </h3>
           <div className="flex gap-2">
             <button 
               onClick={async () => {
                 try {
                   const data = await apiService.getSubscribers();
                   setSubscribers(data || []);
                   showToast('تم تحديث قائمة المشتركين');
                 } catch (err) { showToast('فشل التحديث', 'error'); }
               }}
               className="p-2.5 bg-surface-alt text-muted hover:text-primary rounded-xl transition-all border border-border"
             >
               <RefreshCw size={18} />
             </button>
           </div>
         </div>
         
         <div className="overflow-x-auto custom-scrollbar-horizontal pb-4">
           <table className="w-full text-right border-separate border-spacing-0">
             <thead className="bg-surface-alt/50 sticky top-0 z-10">
               <tr>
                 <th className="px-6 py-4 label-caps text-xs text-right whitespace-nowrap border-b border-border font-extrabold text-muted uppercase tracking-widest">الاسم</th>
                 <th className="px-6 py-4 label-caps text-xs text-right whitespace-nowrap border-b border-border font-extrabold text-muted uppercase tracking-widest">رقم الهاتف</th>
                 <th className="px-6 py-4 label-caps text-xs text-right whitespace-nowrap border-b border-border font-extrabold text-muted uppercase tracking-widest">تاريخ الاشتراك</th>
                 <th className="px-6 py-4 label-caps text-xs w-24 text-left whitespace-nowrap border-b border-border font-extrabold text-muted uppercase tracking-widest">إجراءات</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border/50">
               {subscribers.map((sub: any) => (
                 <tr key={sub.id} className="group hover:bg-surface-alt/30 transition-all">
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-muted-dark">{sub.name || '---'}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary dir-ltr text-right">{sub.phone}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-muted">{new Date(sub.created_at).toLocaleDateString('ar-EG', { dateStyle: 'medium' })}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-left">
                     <button 
                       onClick={async () => {
                         if (confirm('هل أنت متأكد من حذف هذا المشترك؟')) {
                           try {
                             await apiService.deleteSubscriber(sub.id);
                             setSubscribers(subscribers.filter(s => s.id !== sub.id));
                             showToast('تم حذف المشترك بنجاح');
                           } catch (err) { showToast('فشل الحذف', 'error'); }
                         }
                       }}
                       className="p-2.5 bg-danger-soft text-danger border border-danger-soft-border rounded-xl opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                     >
                       <Trash2 size={16} />
                     </button>
                   </td>
                 </tr>
               ))}
               {subscribers.length === 0 && (
                 <tr>
                   <td colSpan={4} className="px-6 py-20 text-center">
                     <div className="w-20 h-20 bg-surface-alt rounded-full flex items-center justify-center mx-auto mb-6 text-muted-light">
                       <Bell size={40} />
                     </div>
                     <p className="text-muted font-bold text-lg">لا يوجد مشتركون حالياً</p>
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
       </div>

       <div className="bg-success-soft border border-success-soft-border p-8 rounded-[32px] relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 blur-3xl -translate-x-1/2 -translate-y-1/2 group-hover:bg-white/30 transition-all duration-700" />
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
           <div className="w-20 h-20 bg-success text-white rounded-3xl flex items-center justify-center shrink-0">
             <WhatsAppIcon size={40} />
           </div>
           <div className="flex-1 text-center md:text-right">
             <h4 className="text-2xl font-black text-success-dark mb-2">كيف ترسل التنبيهات؟</h4>
             <p className="text-success-dark/80 font-medium leading-relaxed max-w-2xl">
               هذه الخدمة تجمع لك أرقام العملاء المهتمين. حالياً يمكنك نسخ الأرقام وإيقافها في قوائم الرسائل الجماعية (Broadcast) في واتساب، أو استخدام شعار الواتساب بجانب العروض الجديدة لإرسالها يدوياً للمشتركين.
             </p>
           </div>
           <button 
             onClick={() => {
               const phones = subscribers.map(s => s.phone).join(', ');
               navigator.clipboard.writeText(phones);
               showToast('تم نسخ جميع الأرقام للحافظة');
             }}
             className="px-8 py-4 bg-success text-white rounded-2xl font-black hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
           >
             نسخ كل الأرقام
           </button>
         </div>
       </div>
     </div>
  ) : activeTab === 'settings' ? (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Social Media Links */}
        <div className="bg-surface rounded-2xl md:rounded-3xl border border-border overflow-hidden">
          <div className="p-4 md:p-8 border-b border-border flex items-center justify-between bg-surface-alt/30">
            <h3 className="text-base md:text-xl font-bold text-muted-dark flex items-center gap-2 md:gap-3">
              <div className="accent-line"></div>
              روابط التواصل الاجتماعي
            </h3>
            <button 
              onClick={() => {
                const newId = localSocialLinks.length > 0 ? Math.max(...localSocialLinks.map((l: any) => l.id)) + 1 : 1;
                setLocalSocialLinks([...localSocialLinks, { id: newId, platform: '', url: '', icon: 'Link', visible: true }]);
              }}
              className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            {localSocialLinks.map((link: any, index: number) => (
              <div key={link.id} className="p-5 bg-surface-alt/50 rounded-2xl border border-border space-y-4 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-alt rounded-xl border border-border flex items-center justify-center text-primary shrink-0">
                      {link.platform === 'facebook' && <Facebook size={20} />}
                      {link.platform === 'instagram' && <Instagram size={20} />}
                      {link.platform === 'whatsapp' && <WhatsAppIcon size={20} />}
                      {link.platform === 'twitter' && <Twitter size={20} />}
                      {!['facebook', 'instagram', 'whatsapp', 'twitter'].includes(link.platform) && <Globe size={20} />}
                    </div>
                    <span className="font-bold text-muted-dark capitalize">{link.platform || 'منصة جديدة'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const newLinks = [...localSocialLinks];
                        newLinks[index].visible = !newLinks[index].visible;
                        setLocalSocialLinks(newLinks);
                      }}
                      className={`p-2 rounded-xl transition-all ${link.visible ? 'bg-success-soft text-success border border-success-soft-border' : 'bg-muted/10 text-muted'}`}
                      title={link.visible ? 'إخفاء' : 'إظهار'}
                    >
                      {link.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button 
                      onClick={() => {
                        setLocalSocialLinks(localSocialLinks.filter((l: any) => l.id !== link.id));
                      }}
                      className="p-2 bg-danger-soft text-danger border border-danger-soft-border rounded-xl hover:bg-danger-soft-border transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="label-caps !text-2xs">المنصة</label>
                    <select 
                      value={link.platform}
                      onChange={(e) => {
                        const newLinks = [...localSocialLinks];
                        newLinks[index].platform = e.target.value;
                        setLocalSocialLinks(newLinks);
                      }}
                      className="w-full bg-surface-alt border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:border-primary outline-none transition-all"
                    >
                      <option value="">اختر المنصة</option>
                      <option value="facebook">فيسبوك</option>
                      <option value="instagram">إنستجرام</option>
                      <option value="whatsapp">واتساب</option>
                      <option value="twitter">تويتر</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="label-caps !text-2xs">الرابط (URL)</label>
                    <input 
                      type="url"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...localSocialLinks];
                        newLinks[index].url = e.target.value;
                        setLocalSocialLinks(newLinks);
                      }}
                      placeholder="https://..."
                      className="w-full bg-surface-alt border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
            {localSocialLinks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-surface-alt rounded-full flex items-center justify-center mx-auto mb-4 text-muted shrink-0">
                  <Share2 size={32} />
                </div>
                <p className="text-muted font-medium">لا توجد روابط تواصل اجتماعي مضافة</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-surface rounded-2xl md:rounded-3xl border border-border overflow-hidden">
            <div className="p-4 md:p-8 border-b border-border bg-surface-alt/30">
              <h3 className="text-base md:text-xl font-bold text-muted-dark flex items-center gap-2 md:gap-3">
                <div className="accent-line"></div>
                معلومات التواصل الأساسية
              </h3>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-muted-dark label-caps !text-2xs">أرقام الهاتف</label>
                  <button 
                    onClick={() => setLocalContactInfo({...localContactInfo, phones: [...(localContactInfo.phones || []), '']})}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    + إضافة رقم
                  </button>
                </div>
                {Array.isArray(localContactInfo.phones) && localContactInfo.phones.map((phone: string, idx: number) => (
                  <div key={`phone-${idx}`} className="flex gap-2">
                    <input 
                      type="text"
                      value={phone}
                      onChange={(e) => {
                        const newPhones = [...(localContactInfo.phones || [])];
                        newPhones[idx] = e.target.value;
                        setLocalContactInfo({...localContactInfo, phones: newPhones});
                      }}
                      className="flex-1 bg-surface-alt border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-primary outline-none transition-all"
                      dir="ltr"
                    />
                    <button 
                      onClick={() => {
                        const newPhones = (localContactInfo.phones || []).filter((_: any, i: number) => i !== idx);
                        setLocalContactInfo({...localContactInfo, phones: newPhones});
                      }}
                      className="p-3 text-danger hover:bg-danger-soft rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-dark label-caps !text-2xs">البريد الإلكتروني</label>
                <input 
                  type="email"
                  value={localContactInfo.email}
                  onChange={(e) => setLocalContactInfo({...localContactInfo, email: e.target.value})}
                  className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-primary outline-none transition-all"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-dark label-caps !text-2xs">العنوان (نصي)</label>
                <textarea 
                  value={localContactInfo.address}
                  onChange={(e) => setLocalContactInfo({...localContactInfo, address: e.target.value})}
                  rows={3}
                  className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-primary outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-dark label-caps !text-2xs">رابط الخريطة (Google Maps URL)</label>
                <input 
                  type="url"
                  value={localContactInfo.addressUrl}
                  onChange={(e) => setLocalContactInfo({...localContactInfo, addressUrl: e.target.value})}
                  className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3 text-sm font-medium focus:border-primary outline-none transition-all"
                  placeholder="https://goo.gl/maps/..."
                />
              </div>
            </div>
          </div>

          <div className="bg-primary-soft border border-primary-soft-border p-6 rounded-3xl flex items-start gap-4">
            <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shrink-0">
              <Info size={24} />
            </div>
            <div>
              <h4 className="font-bold text-primary mb-1">ملاحظة هامة</h4>
              <p className="text-sm text-primary/80 leading-relaxed font-medium">
                التغييرات التي تجريها هنا ستظهر تلقائياً في تذييل الموقع (Footer) وصفحة "اتصل بنا". تأكد من صحة الروابط وأرقام الهاتف قبل الحفظ.
              </p>
            </div>
          </div>
          
          {/* Account Security Settings */}
          <div className="bg-surface rounded-2xl md:rounded-3xl border border-border overflow-hidden">
            <div className="p-4 md:p-8 border-b border-border bg-surface-alt/30">
              <h3 className="text-base md:text-xl font-bold text-muted-dark flex items-center gap-2 md:gap-3">
                <div className="accent-line"></div>
                أمان الحساب
              </h3>
            </div>
            <div className="p-6 md:p-8">
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-dark label-caps !text-2xs">كلمة المرور الحالية</label>
                    <input 
                      type="password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                      className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-primary outline-none transition-all text-left"
                      dir="ltr"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="hidden md:block"></div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-dark label-caps !text-2xs">كلمة المرور الجديدة</label>
                    <input 
                      type="password"
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                      className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-primary outline-none transition-all text-left"
                      dir="ltr"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-dark label-caps !text-2xs">تأكيد كلمة المرور الجديدة</label>
                    <input 
                      type="password"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                      className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-primary outline-none transition-all text-left"
                      dir="ltr"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="flex justify-start">
                  <button 
                    disabled={isChangingPassword}
                    type="submit"
                    className="w-full sm:w-auto bg-muted-dark hover:bg-black text-white px-8 py-4 sm:py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 text-base"
                  >
                    {isChangingPassword ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <ShieldCheck size={20} />
                        تحديث كلمة المرور
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <button 
          onClick={handleSaveSettings}
          className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-4 sm:py-3 rounded-xl font-extrabold transition-all flex items-center justify-center gap-2 active:scale-95 text-lg sm:text-base"
        >
          <CheckCircle size={20} />
          حفظ التغييرات
        </button>
      </div>
    </div>
  ) : (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid for other tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {[
          { icon: <Briefcase size={22} />, label: 'إجمالي العروض', value: offers.length },
          { icon: <ShieldCheck size={22} />, label: 'إجمالي التأشيرات', value: visas.length },
          { icon: <MapPin size={22} />, label: 'إجمالي الوجهات', value: destinations.length },
          { icon: <Calendar size={22} />, label: 'إجمالي الحجوزات', value: bookings.length }
        ].map((stat, i) => (
          <div key={i} className="bg-surface p-5 lg:p-6 rounded-2xl border border-border flex items-center gap-4 group hover:border-primary-soft-border transition-all">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-primary-soft rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0 border border-primary-soft-border">
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] lg:text-xs font-bold text-muted uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-xl lg:text-3xl font-bold text-muted-dark">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

 <div className="bg-surface rounded-2xl border border-border overflow-x-auto hide-scrollbar">
 <div className="p-5 md:p-6 lg:p-8 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface">
 <h3 className="text-base md:text-lg font-bold text-muted-dark flex items-center gap-2">
 <div className="accent-line"></div>
 قائمة {menuItems.find(m => m.id === activeTab)?.label}
 </h3>
  <div className="flex items-center gap-4">
    {activeTab === 'bookings' && (
      <select 
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="text-xs font-bold bg-surface-alt border border-border rounded-xl px-3 py-1.5 focus:border-primary focus:outline-none no-print"
      >
        <option value="الكل">جميع الحالات</option>
        <option value="قيد الانتظار">قيد الانتظار</option>
        <option value="مكتمل">مكتمل</option>
        <option value="ملغي">ملغي</option>
      </select>
    )}
    <div className="text-sm font-bold text-muted">
    {activeTab === 'offers' ? filteredOffers.length : 
    activeTab === 'visas' ? filteredVisas.length : 
    activeTab === 'destinations' ? filteredDestinations.length : 
    filteredBookings.length} سجل متاح
    </div>
  </div>
 </div>
 <div className="overflow-x-auto custom-scrollbar-horizontal pb-4">
 <table className="w-full text-right hidden md:table border-separate border-spacing-0">
 <thead className="bg-surface sticky top-0 z-10 backdrop-blur-md">
 <tr>
 <th className="px-6 py-4 label-caps text-xs text-right whitespace-nowrap border-b border-border font-extrabold text-muted">الاسم / العنوان</th>
 {activeTab === 'offers' && <th className="px-6 py-4 label-caps text-xs text-right whitespace-nowrap border-b border-border font-extrabold text-muted">السعر</th>}
 {activeTab === 'offers' && <th className="px-6 py-4 label-caps text-xs text-right whitespace-nowrap border-b border-border font-extrabold text-muted">المدة</th>}
 {activeTab === 'offers' && <th className="px-6 py-4 label-caps text-xs text-center whitespace-nowrap border-b border-border font-extrabold text-muted">الحالة</th>}
 {activeTab === 'visas' && <th className="px-6 py-4 label-caps text-xs text-right whitespace-nowrap border-b border-border font-extrabold text-muted">السعر</th>}
 {activeTab === 'visas' && <th className="px-6 py-4 label-caps text-xs text-right whitespace-nowrap border-b border-border font-extrabold text-muted">المدة</th>}
 {activeTab === 'visas' && <th className="px-6 py-4 label-caps text-xs text-center whitespace-nowrap border-b border-border font-extrabold text-muted">الحالة</th>}
 {activeTab === 'destinations' && <th className="px-6 py-4 label-caps text-xs text-right whitespace-nowrap border-b border-border font-extrabold text-muted">التصنيف</th>}
 {activeTab === 'bookings' && <th className="px-6 py-4 label-caps text-xs text-right whitespace-nowrap border-b border-border font-extrabold text-muted">الخدمة</th>}
 {activeTab === 'bookings' && <th className="px-6 py-4 label-caps text-xs text-right whitespace-nowrap border-b border-border font-extrabold text-muted">التاريخ</th>}
 {activeTab === 'bookings' && <th className="px-6 py-4 label-caps text-xs text-right whitespace-nowrap border-b border-border font-extrabold text-muted">المبلغ</th>}
 {activeTab === 'bookings' && <th className="px-6 py-4 label-caps text-xs text-center whitespace-nowrap border-b border-border font-extrabold text-muted">الحالة</th>}
 <th className="px-6 py-4 label-caps text-xs w-24 text-left whitespace-nowrap border-b border-border font-extrabold text-muted">إجراءات</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border/50">
 {activeTab === 'offers' && filteredOffers.map(offer => (
 <tr key={offer.id} className="hover:bg-primary/[0.02] transition-all group">
 <td className="px-6 py-6 border-b border-border/5">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 rounded-2xl overflow-hidden bg-surface-alt border border-border shrink-0 group-hover: transition-">
 <img decoding="async" loading="lazy" src={optimizeImageUrl(offer.image, 200)} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
 </div>
 <span className="font-bold text-muted-dark text-base tracking-tight">{offer.title}</span>
 </div>
 </td>
 <td className="px-6 py-6 font-bold text-primary text-lg border-b border-border/5">{offer.price} {offer.currency || 'ر.س'}</td>
 <td className="px-6 py-6 font-bold text-muted-dark border-b border-border/5">{offer.duration}</td>
 <td className="px-6 py-6 text-center border-b border-border/5">
 <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${offer.status === 'نشط' ? 'bg-success-soft text-success border-success-soft-border' : 'bg-muted/10 text-muted border-muted/20'}`}>
 {offer.status}
 </span>
 </td>
  <td className="px-6 py-6 text-left border-b border-border/5">
    <div className="flex items-center justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-all">
      <button onClick={() => handleMoveItem('offers', offer.id, 'up')} className="p-1.5 text-muted hover:text-primary hover:bg-primary-light rounded-xl transition-all active:scale-95" title="تحريك لأعلى">
        <ChevronUp size={18} />
      </button>
      <button onClick={() => handleMoveItem('offers', offer.id, 'down')} className="p-1.5 text-muted hover:text-primary hover:bg-primary-light rounded-xl transition-all active:scale-95" title="تحريك لأسفل">
        <ChevronDown size={18} />
      </button>
      <div className="w-px h-4 bg-border mx-1"></div>
      <button onClick={() => handleDuplicateOffer(offer)} className="p-2.5 text-primary hover:bg-primary-light rounded-xl transition-all active:scale-95" title="تكرار">
        <Plus size={20} />
      </button>
      <button onClick={() => { setEditingItem(offer); setIsModalOpen(true); }} className="p-2.5 text-primary hover:bg-primary-light rounded-xl transition-all active:scale-95" title="تعديل">
        <Edit size={20} />
      </button>
      <button onClick={() => handleDeleteOffer(offer.id)} className="p-2.5 text-danger hover:bg-danger-soft rounded-xl transition-all active:scale-95" title="حذف">
        <Trash2 size={20} />
      </button>
    </div>
  </td>
 </tr>
 ))}

 {activeTab === 'visas' && filteredVisas.map(visa => (
 <tr key={visa.id} className="hover:bg-primary/[0.02] transition-all group">
 <td className="px-6 py-5">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 rounded-2xl overflow-hidden bg-border border border-border-hover shrink-0 flex items-center justify-center">
 {visa.image ? (
   <img decoding="async" loading="lazy" src={optimizeImageUrl(visa.image, 200)} alt={visa.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 ) : (
   <ShieldCheck size={24} className="text-muted-light" />
 )}
 </div>
 <span className="font-bold text-muted-dark text-base">{visa.title}</span>
 </div>
 </td>
 <td className="px-6 py-5 font-bold text-primary text-lg">{visa.price} {visa.currency || 'ر.س'}</td>
 <td className="px-6 py-5 font-bold text-muted-dark">{visa.duration}</td>
 <td className="px-6 py-5 text-center">
 <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-xl text-xs font-bold border uppercase tracking-wider ${visa.status === 'نشط' ? 'bg-success-soft text-success border-success-soft-border' : 'bg-muted/10 text-muted border-muted/20'}`}>
 {visa.status}
 </span>
 </td>
  <td className="px-6 py-5 text-left">
    <div className="flex items-center justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-all">
      <button onClick={() => handleMoveItem('visas', visa.id, 'up')} className="p-1.5 text-muted hover:text-primary hover:bg-primary-light rounded-xl transition-all active:scale-95" title="تحريك لأعلى">
        <ChevronUp size={18} />
      </button>
      <button onClick={() => handleMoveItem('visas', visa.id, 'down')} className="p-1.5 text-muted hover:text-primary hover:bg-primary-light rounded-xl transition-all active:scale-95" title="تحريك لأسفل">
        <ChevronDown size={18} />
      </button>
      <div className="w-px h-4 bg-border mx-1"></div>
      <button onClick={() => handleDuplicateVisa(visa)} className="p-2.5 text-primary hover:bg-primary-light rounded-xl transition-all active:scale-95" title="تكرار">
        <Plus size={20} />
      </button>
      <button onClick={() => { setEditingItem(visa); setIsModalOpen(true); }} className="p-2.5 text-primary hover:bg-primary-light rounded-xl transition-all active:scale-95" title="تعديل">
        <Edit size={20} />
      </button>
      <button onClick={() => handleDeleteVisa(visa.id)} className="p-2.5 text-danger hover:bg-danger-soft rounded-xl transition-all active:scale-95" title="حذف">
        <Trash2 size={20} />
      </button>
    </div>
  </td>
 </tr>
 ))}

 {activeTab === 'destinations' && filteredDestinations.map(dest => (
 <tr key={dest.id} className="hover:bg-primary/[0.02] transition-all group">
 <td className="px-6 py-5">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 rounded-2xl overflow-hidden bg-border border border-border-hover shrink-0">
 <img decoding="async" loading="lazy" src={optimizeImageUrl(dest.image, 200)} alt={dest.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 </div>
 <span className="font-bold text-muted-dark text-base">{dest.name}</span>
 </div>
 </td>
 <td className="px-6 py-5">
 <span className="px-4 py-1.5 rounded-xl bg-primary-light text-primary text-xs font-extrabold border border-primary-soft uppercase tracking-wider">
 {dest.category}
 </span>
 </td>
 <td className="px-6 py-5 text-left">
 <div className="flex items-center justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-all">
  <button onClick={() => handleMoveItem('destinations', dest.id, 'up')} className="p-1.5 text-muted hover:text-primary hover:bg-primary-light rounded-xl transition-all active:scale-95" title="تحريك لأعلى">
    <ChevronUp size={18} />
  </button>
  <button onClick={() => handleMoveItem('destinations', dest.id, 'down')} className="p-1.5 text-muted hover:text-primary hover:bg-primary-light rounded-xl transition-all active:scale-95" title="تحريك لأسفل">
    <ChevronDown size={18} />
  </button>
  <div className="w-px h-4 bg-border mx-1"></div>
  <button onClick={() => { setEditingItem(dest); setIsModalOpen(true); }} className="p-2.5 text-primary hover:bg-primary-light rounded-xl transition-all active:scale-95" title="تعديل">
 <Edit size={20} />
 </button>
 <button onClick={() => handleDeleteDestination(dest.id)} className="p-2.5 text-danger hover:bg-danger-soft rounded-xl transition-all active:scale-95" title="حذف">
 <Trash2 size={20} />
 </button>
 </div>
 </td>
 </tr>
 ))}

 {activeTab === 'bookings' && filteredBookings.map(booking => (
 <tr key={booking.id} className="hover:bg-primary/[0.02] transition-all group">
 <td className="px-6 py-5 font-bold text-muted-dark text-base">
 <div>{booking.name || booking.user}</div>
 <div className="text-xs text-muted font-medium">{booking.phone || booking.id}</div>
 </td>
 <td className="px-6 py-5 font-bold text-muted-dark text-sm">{booking.serviceType || booking.service}</td>
 <td className="px-6 py-5 font-bold text-muted-dark text-sm">{booking.date}</td>
 <td className="px-6 py-5 font-bold text-primary text-sm">{booking.amount || '-'}</td>
  <td className="px-6 py-5 text-center">
    <select 
      value={booking.status} 
      onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
      className={`inline-flex items-center justify-center px-4 py-1.5 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none transition-all ${
        booking.status === 'مكتمل' ? 'bg-success-soft text-success border-success-soft-border' : 
        booking.status === 'قيد الانتظار' ? 'bg-warning-soft text-warning border-warning-soft-border' : 
        'bg-danger-soft text-danger border-danger-soft-border'
      }`}
    >
      <option value="قيد الانتظار">قيد الانتظار</option>
      <option value="مكتمل">مكتمل</option>
      <option value="ملغي">ملغي</option>
    </select>
  </td>
  <td className="px-6 py-5 text-left">
  <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-all">
  <button onClick={() => handleViewBookingDetails(booking)} className="p-2.5 text-primary hover:bg-primary-light rounded-xl transition-all" title="عرض التفاصيل">
   <FileText size={20} />
  </button>
  <button onClick={() => handleDeleteBooking(booking.id)} className="p-2.5 text-danger hover:bg-danger-soft rounded-xl transition-all" title="حذف">
  <Trash2 size={20} />
  </button>
  </div>
  </td>
 </tr>
 ))}


</tbody>
 </table>
 </div>

 {/* Mobile Cards Layout */}
 <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
 {activeTab === 'offers' && filteredOffers.map(offer => (
 <div key={offer.id} className="p-4 bg-surface rounded-2xl border border-border space-y-4">
 <div className="flex items-center gap-4">
 <div className="w-16 h-16 rounded-2xl overflow-hidden bg-border border border-border-hover shrink-0">
 <img decoding="async" loading="lazy" src={optimizeImageUrl(offer.image, 200)} alt={offer.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 </div>
 <div className="flex-1 min-w-0">
 <h4 className="font-bold text-muted-dark text-base truncate">{offer.title}</h4>
 <div className="flex items-center gap-2 mt-1">
 <span className="text-primary font-bold text-sm">{offer.price} {offer.currency || 'ر.س'}</span>
 <span className="text-border-dark">•</span>
 <span className="text-muted text-xs font-bold">{offer.duration}</span>
 </div>
 </div>
 <span className={`px-3 py-1 rounded-xl text-2xs font-bold border uppercase tracking-wider ${offer.status === 'نشط' ? 'bg-success-soft text-success border-success-soft-border' : 'bg-muted/10 text-muted border-muted/20'}`}>
 {offer.status}
 </span>
 </div>
  <div className="flex flex-wrap items-center gap-2 pt-2">
    <div className="flex items-center gap-2 w-full mb-1">
      <button onClick={() => handleMoveItem('offers', offer.id, 'up')} className="flex-1 flex items-center justify-center py-2 bg-surface-alt border border-border hover:bg-primary-light text-muted hover:text-primary rounded-xl transition-all active:scale-95">
        <ChevronUp size={18} />
      </button>
      <button onClick={() => handleMoveItem('offers', offer.id, 'down')} className="flex-1 flex items-center justify-center py-2 bg-surface-alt border border-border hover:bg-primary-light text-muted hover:text-primary rounded-xl transition-all active:scale-95">
        <ChevronDown size={18} />
      </button>
    </div>
    <button onClick={() => handleDuplicateOffer(offer)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-light text-primary rounded-xl font-extrabold text-xs transition-all active:scale-95">
      <Plus size={16} />
      تكرار
    </button>
    <button onClick={() => { setEditingItem(offer); setIsModalOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-light text-primary rounded-xl font-extrabold text-xs transition-all active:scale-95">
      <Edit size={16} />
      تعديل
    </button>
    <button onClick={() => handleDeleteOffer(offer.id)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-danger-soft text-danger rounded-xl font-bold text-xs transition-all active:scale-95">
      <Trash2 size={16} />
      حذف
    </button>
  </div>
 </div>
 ))}

 {activeTab === 'visas' && filteredVisas.map(visa => (
 <div key={visa.id} className="p-4 bg-surface rounded-2xl border border-border space-y-4">
 <div className="flex items-center gap-4">
 <div className="w-16 h-16 rounded-2xl overflow-hidden bg-border border border-border-hover shrink-0 flex items-center justify-center">
 {visa.image ? (
   <img decoding="async" loading="lazy" src={optimizeImageUrl(visa.image, 200)} alt={visa.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 ) : (
   <ShieldCheck size={24} className="text-muted-light" />
 )}
 </div>
 <div className="flex-1 min-w-0">
 <h4 className="font-bold text-muted-dark text-base truncate">{visa.title}</h4>
 <div className="flex items-center gap-2 mt-1">
 <span className="text-primary font-bold text-sm">{visa.price} {visa.currency || 'ر.س'}</span>
 <span className="text-border-dark">•</span>
 <span className="text-muted text-xs font-bold">{visa.duration}</span>
 </div>
 </div>
 <span className={`px-3 py-1 rounded-xl text-[10px] font-bold border ${visa.status === 'نشط' ? 'bg-success-soft text-success border-success-soft-border' : 'bg-muted/10 text-muted border-muted/20'}`}>
 {visa.status}
 </span>
 </div>
  <div className="flex flex-wrap items-center gap-2 pt-2">
    <div className="flex items-center gap-2 w-full mb-1">
      <button onClick={() => handleMoveItem('visas', visa.id, 'up')} className="flex-1 flex items-center justify-center py-2 bg-surface-alt border border-border hover:bg-primary-light text-muted hover:text-primary rounded-xl transition-all active:scale-95">
        <ChevronUp size={18} />
      </button>
      <button onClick={() => handleMoveItem('visas', visa.id, 'down')} className="flex-1 flex items-center justify-center py-2 bg-surface-alt border border-border hover:bg-primary-light text-muted hover:text-primary rounded-xl transition-all active:scale-95">
        <ChevronDown size={18} />
      </button>
    </div>
    <button onClick={() => handleDuplicateVisa(visa)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-light text-primary rounded-xl font-extrabold text-xs transition-all active:scale-95">
      <Plus size={16} />
      تكرار
    </button>
    <button onClick={() => { setEditingItem(visa); setIsModalOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-light text-primary rounded-xl font-extrabold text-xs transition-all active:scale-95">
      <Edit size={16} />
      تعديل
    </button>
    <button onClick={() => handleDeleteVisa(visa.id)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-danger-soft text-danger rounded-xl font-bold text-xs transition-all active:scale-95">
      <Trash2 size={16} />
      حذف
    </button>
  </div>
 </div>
 ))}

 {activeTab === 'destinations' && filteredDestinations.map(dest => (
 <div key={dest.id} className="p-4 bg-surface rounded-2xl border border-border space-y-4">
 <div className="flex items-center gap-4">
 <div className="w-16 h-16 rounded-2xl overflow-hidden bg-border border border-border-hover shrink-0">
 <img decoding="async" loading="lazy" src={optimizeImageUrl(dest.image, 200)} alt={dest.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 </div>
 <div className="flex-1 min-w-0">
 <h4 className="font-bold text-muted-dark text-base truncate">{dest.name}</h4>
 <span className="inline-block mt-1 px-3 py-1 rounded-2xl bg-primary-light text-primary text-[10px] font-extrabold border border-primary-soft">
 {dest.category}
 </span>
 </div>
 </div>
 <div className="flex flex-wrap items-center gap-2 pt-2">
  <div className="flex items-center gap-2 w-full mb-1">
    <button onClick={() => handleMoveItem('destinations', dest.id, 'up')} className="flex-1 flex items-center justify-center py-2 bg-surface-alt border border-border hover:bg-primary-light text-muted hover:text-primary rounded-xl transition-all active:scale-95">
      <ChevronUp size={18} />
    </button>
    <button onClick={() => handleMoveItem('destinations', dest.id, 'down')} className="flex-1 flex items-center justify-center py-2 bg-surface-alt border border-border hover:bg-primary-light text-muted hover:text-primary rounded-xl transition-all active:scale-95">
      <ChevronDown size={18} />
    </button>
  </div>
  <button onClick={() => { setEditingItem(dest); setIsModalOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-light text-primary rounded-xl font-extrabold text-xs transition-all active:scale-95">
  <Edit size={16} />
  تعديل
  </button>
  <button onClick={() => handleDeleteDestination(dest.id)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-danger-soft text-danger rounded-xl font-bold text-xs transition-all active:scale-95">
  <Trash2 size={16} />
  حذف
  </button>
  </div>
 </div>
 ))}


 {activeTab === 'bookings' && filteredBookings.map(booking => (
 <div key={booking.id} className="p-4 bg-surface rounded-2xl border border-border space-y-4">
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1 min-w-0">
 <h4 className="font-bold text-muted-dark text-base truncate">{booking.name || booking.user}</h4>
 <div className="text-muted text-[10px] font-bold mt-1 uppercase tracking-widest bg-surface-alt px-2 py-1 rounded w-fit select-all">{booking.phone || booking.id}</div>
 <div className="flex flex-wrap items-center gap-2 mt-3">
 <span className="px-2 py-1 bg-surface-alt rounded-xl font-bold text-xs text-muted-dark">{booking.serviceType || booking.service}</span>
 <span className="text-border-dark">•</span>
 <span className="text-muted text-[10px] font-bold">{booking.date}</span>
 {booking.amount && (
 <>
 <span className="text-border-dark">•</span>
 <span className="text-success font-bold text-xs">{booking.amount}</span>
 </>
 )}
 </div>
 </div>
  <select 
    value={booking.status} 
    onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border cursor-pointer focus:outline-none transition-all h-fit ${
      booking.status === 'مكتمل' ? 'bg-success-soft text-success border-success-soft-border' : 
      booking.status === 'قيد الانتظار' ? 'bg-warning-soft text-warning border-warning-soft-border' : 
      'bg-danger-soft text-danger border-danger-soft-border'
    }`}
  >
    <option value="قيد الانتظار">قيد الانتظار</option>
    <option value="مكتمل">مكتمل</option>
    <option value="ملغي">ملغي</option>
  </select>
 </div>
 <div className="flex items-center gap-2 pt-2 border-t border-border mt-2">
 <button onClick={() => handleViewBookingDetails(booking)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-light text-primary rounded-xl font-extrabold text-sm transition-all active:scale-95">
  <FileText size={16} />
  عرض التفاصيل
 </button>
 <button onClick={() => handleDeleteBooking(booking.id)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-danger-soft text-danger rounded-xl font-bold text-sm transition-all active:scale-95">
 <Trash2 size={16} />
 حذف
 </button>
 </div>
 </div>
 ))}


 </div>
 
 {/* Empty State */}
 {((activeTab === 'offers' && filteredOffers.length === 0) || 
 (activeTab === 'visas' && filteredVisas.length === 0) || 
 (activeTab === 'destinations' && filteredDestinations.length === 0) ||
 (activeTab === 'bookings' && filteredBookings.length === 0)) &&
 <div className="p-10 md:p-20 text-center">
 <div className="w-24 h-24 bg-surface-alt rounded-2xl flex items-center justify-center text-border-dark mx-auto mb-6 shrink-0">
 <Search size={48} />
 </div>
 <h3 className="text-lg md:text-xl font-bold text-muted-dark mb-2">لا توجد نتائج</h3>
 <p className="text-muted font-medium text-base">لم يتم العثور على أي بيانات مطابقة لبحثك.</p>
 </div>
 }
 </div>
 </div>
 )}
 </div>
</div>
</main>

 {/* Add/Edit Modal */}
 <AnimatePresence>
 {isModalOpen && (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 bg-surface/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 sm:p-6">
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className={`bg-surface rounded-2xl w-full border border-border flex flex-col overflow-y-auto custom-scrollbar ${activeTab === 'offers' ? 'max-w-6xl max-h-[92dvh] sm:max-h-[90dvh]' : 'max-w-3xl max-h-[90dvh]'}`}
 >
 <div className="p-6 md:p-8 border-b border-border flex justify-between items-center bg-surface shrink-0">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-primary-soft text-primary rounded-2xl flex items-center justify-center shrink-0">
 {editingItem ? <Edit size={24} /> : <Plus size={24} />}
 </div>
 <div>
 <h3 className="text-xl md:text-2xl font-bold text-muted-dark tracking-normal">
 {editingItem ? 'تعديل' : 'إضافة'} {activeTab === 'offers' ? 'عرض' : activeTab === 'visas' ? 'تأشيرة' : 'وجهة'}
 </h3>
 <p className="text-sm text-muted mt-1 font-medium">يرجى ملء كافة البيانات المطلوبة بدقة</p>
 </div>
 </div>
 <button type="button" onClick={() => setIsModalOpen(false)} className="p-2.5 text-muted hover:text-danger hover:bg-danger-soft rounded-xl transition-all active:scale-95">
 <X size={24} />
 </button>
 </div>
 
 <div className="flex-1 flex flex-col">
 <form id="itemForm" onSubmit={handleSave} className="flex-1 flex flex-col space-y-4">
 {activeTab === 'offers' && (
 <>
 <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-0 h-full min-h-[500px]">
     {/* Right Side (Arabic RTL) - Main Content */}
     <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 lg:border-l border-border">
        
        {/* Banner Editor */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-muted-dark block">صورة العرض الرئيسية</label>
          {formData.image ? (
            <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden border-2 border-primary/20 group">
              <img decoding="async" loading="lazy" src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                 <button type="button" onClick={() => setFormData({...formData, image: ''})} className="px-6 py-3 bg-danger text-white rounded-xl font-bold hover:bg-danger/90 transition-all transform hover:scale-105 flex items-center gap-2">
                   <Trash2 size={20} /> إزالة الصورة
                 </button>
              </div>
            </div>
          ) : (
            <div className="relative group w-full aspect-video md:aspect-[21/9]">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="w-full h-full bg-surface-alt border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-4 group-hover:border-primary group-hover:bg-primary-soft/30 transition-all">
                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload size={32} className="text-primary" />
                </div>
                  <div className="text-center">
                    <span className="block font-bold text-muted-dark text-lg mb-1">انقر لرفع صورة العرض</span>
                    <span className="text-sm font-medium text-muted">PNG, JPG, WEBP حتى 10 ميجابايت</span>
                  </div>
              </div>
            </div>
          )}
          <input type="url" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm font-medium text-muted-dark focus:border-primary focus: focus: text-left" dir="ltr" placeholder="أو أضف رابط الصورة هنا مباشرة"/>
        </div>

        {/* Title & Description */}
        <div className="grid gap-6">
          <div>
            <label className="text-xl font-bold text-muted-dark block mb-3">عنوان العرض</label>
            <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-surface-alt border border-transparent rounded-2xl px-5 py-4 text-2xl font-bold text-primary focus:bg-surface focus:border-primary/30 focus: focus: transition-all placeholder:text-muted/40" placeholder="مثال: عرض الصيف في المالديف - 7 أيام"/>
          </div>

          <div className="bg-surface-alt p-6 rounded-2xl border border-border space-y-6">
            <div>
              <label className="text-sm font-bold text-muted-dark block mb-3 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                عنوان التفاصيل الأساسية
              </label>
              <input type="text" value={formData.descriptionTitle || ''} onChange={e => setFormData({...formData, descriptionTitle: e.target.value})} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm font-bold text-muted-dark focus:border-primary transition-all" placeholder="مثال: برنامج الرحلة التفصيلي"/>
            </div>
            
            <div>
              <label className="text-sm font-bold text-muted-dark block mb-3 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                 التفاصيل
              </label>
              <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-surface border border-border rounded-xl px-4 py-4 text-sm font-medium text-muted-dark focus:border-primary transition-all min-h-[220px] resize-y leading-[1.8]" placeholder="اكتب تفاصيل البرنامج السياحي هنا، يفضل تقسيم الأيام..."></textarea>
            </div>
          </div>
        </div>

     </div>

     {/* Left Side (Sidebar) - Properties & Features */}
     <div className="w-full lg:w-[25rem] p-4 sm:p-6 md:p-8 bg-surface-alt/30 space-y-6 sm:space-y-8">
        
        {/* Pricing & Essential Details */}
        <div className="bg-surface p-5 rounded-2xl border border-border space-y-5">
          <h4 className="font-bold text-muted-dark text-sm border-b border-border pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            بطاقة تفاصيل العرض
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-base-alt font-bold text-muted uppercase tracking-widest block mb-2">السعر</label>
              <div className="flex gap-2">
                 <input type="text" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-surface-alt border border-border rounded-xl flex-1 px-3 py-2.5 text-base font-bold text-primary focus:border-primary transition-all text-left" dir="ltr" placeholder="5000"/>
                 <input type="text" value={formData.currency || ''} onChange={e => setFormData({...formData, currency: e.target.value})} className="w-[4.375rem] shrink-0 bg-surface-alt border border-border rounded-xl px-2 py-2.5 text-sm font-bold text-muted-dark focus:border-primary transition-all text-center" placeholder="ر.س"/>
              </div>
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <label className="text-base-alt font-bold text-muted uppercase tracking-widest block mb-2">مدة العرض</label>
              <input type="text" value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-surface-alt border border-border rounded-xl px-3 py-2.5 text-sm font-bold text-muted-dark focus:border-primary transition-all" placeholder="مثال: 7 أيام"/>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-base-alt font-bold text-muted uppercase tracking-widest block mb-2">الوجهة (اختياري)</label>
              <input type="text" value={formData.destination || ''} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full bg-surface-alt border border-border rounded-xl px-3 py-2.5 text-sm font-bold text-muted-dark focus:border-primary transition-all" placeholder="مثال: المالديف"/>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-base-alt font-bold text-muted uppercase tracking-widest block mb-2">السعر السابق (اختياري)</label>
              <input type="text" value={formData.oldPrice || ''} onChange={e => setFormData({...formData, oldPrice: e.target.value})} className="w-full bg-surface-alt border border-border rounded-xl px-3 py-2.5 text-sm font-bold text-muted-dark focus:border-primary transition-all text-left" dir="ltr" placeholder="مثال: 6250"/>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-base-alt font-bold text-muted uppercase tracking-widest block mb-2">نص الخصم (اختياري)</label>
              <input type="text" value={formData.badgeText || ''} onChange={e => setFormData({...formData, badgeText: e.target.value})} className="w-full bg-surface-alt border border-border rounded-xl px-3 py-2.5 text-xs font-bold text-muted-dark focus:border-primary transition-all" placeholder="مثال: وفر 25%"/>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-base-alt font-bold text-muted uppercase tracking-widest block mb-2">نص الاستعجال (اختياري)</label>
              <input type="text" value={formData.urgencyText || ''} onChange={e => setFormData({...formData, urgencyText: e.target.value})} className="w-full bg-surface-alt border border-border rounded-xl px-3 py-2.5 text-xs font-bold text-muted-dark focus:border-primary transition-all" placeholder="مثال: متبقي 3 أماكن فقط"/>
            </div>
          </div>
        </div>

        {/* Features (Included) */}
        <div className="space-y-3">
          <label className="font-bold text-muted-dark text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            العرض يشمل
          </label>
          <div className="bg-surface border border-border rounded-2xl p-3 focus-within:border-success transition-all flex flex-col gap-2">
             <div className="flex flex-wrap gap-2">
               {(() => {
                 let currentFeatures: string[] = [];
                 if (Array.isArray(formData.features)) currentFeatures = formData.features;
                 else if (typeof formData.features === 'string' && formData.features.trim() !== '') currentFeatures = formData.features.split(',').map((f: string) => f.trim());
                 return currentFeatures.map((feature, index) => (
                   <div key={index} className="bg-success-soft text-success px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2">
                     {feature}
                     <button type="button" onClick={() => removeFeature(index)} className="hover:text-danger transition-colors"><X size={12} /></button>
                   </div>
                 ));
               })()}
             </div>
             <div className="flex items-center gap-2 mt-1 border-t border-border pt-2">
               <input type="text" value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={handleAddFeature} className="flex-1 bg-transparent border-none focus:outline-none px-2 py-1 text-sm font-medium text-muted-dark" placeholder="إضافة ميزة..."/>
               <button type="button" onClick={() => handleAddFeature()} className="p-1.5 text-success hover:bg-success/10 rounded-xl transition-all"><Plus size={16}/></button>
             </div>
          </div>
        </div>

        {/* Excluded */}
        <div className="space-y-3">
          <label className="font-bold text-muted-dark text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-danger"></span>
            العرض لا يشمل (اختياري)
          </label>
          <div className="bg-surface border border-border rounded-2xl p-3 focus-within:border-danger transition-all flex flex-col gap-2">
             <div className="flex flex-wrap gap-2">
               {(() => {
                 let currentNotIncluded: string[] = [];
                 if (Array.isArray(formData.notIncluded)) currentNotIncluded = formData.notIncluded;
                 else if (typeof formData.notIncluded === 'string' && formData.notIncluded.trim() !== '') currentNotIncluded = formData.notIncluded.split(',').map((f: string) => f.trim());
                 return currentNotIncluded.map((item, index) => (
                   <div key={index} className="bg-danger-soft text-danger px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2">
                     {item}
                     <button type="button" onClick={() => removeNotIncluded(index)} className="hover:text-danger transition-colors"><X size={12} /></button>
                   </div>
                 ));
               })()}
             </div>
             <div className="flex items-center gap-2 mt-1 border-t border-border pt-2">
               <input type="text" value={notIncludedInput} onChange={e => setNotIncludedInput(e.target.value)} onKeyDown={handleAddNotIncluded} className="flex-1 bg-transparent border-none focus:outline-none px-2 py-1 text-sm font-medium text-muted-dark" placeholder="إضافة استثناء..."/>
               <button type="button" onClick={() => handleAddNotIncluded()} className="p-1.5 text-danger hover:bg-danger/10 rounded-xl transition-all"><Plus size={16}/></button>
             </div>
          </div>
        </div>

        {/* Settings */}
        <div className="pt-2">
           <label className="text-base-alt font-bold text-muted uppercase tracking-widest block mb-2">حالة النشر</label>
           <select value={formData.status || 'نشط'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-sm font-bold text-muted-dark focus:border-primary transition-all appearance-none cursor-pointer">
             <option value="نشط">نشط - يظهر في الموقع</option>
             <option value="غير نشط">غير نشط - مسودة مخفية</option>
           </select>
        </div>

     </div>
  </div>
 </>
 )}

 {activeTab === 'visas' && (
 <>
 <div className="p-4 sm:p-6 md:p-8 space-y-8 sm:space-y-10">
 <div className="space-y-6">
 <h3 className="label-caps !text-xs flex items-center gap-3 border-b border-border pb-4">
 <div className="accent-line !h-4"></div>
 المعلومات الأساسية والوسائط
 </h3>
 
 {/* Visa Image Editor */}
 <div className="space-y-4 mb-8">
   <label className="text-sm font-bold text-muted-dark block">صورة التأشيرة</label>
   {formData.image ? (
     <div className="relative w-full max-w-lg aspect-video rounded-2xl overflow-hidden border-2 border-primary/20 group">
       <img decoding="async" loading="lazy" src={formData.image} alt="Preview" className="w-full h-full object-cover" />
       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
          <button type="button" onClick={() => setFormData({...formData, image: ''})} className="px-6 py-3 bg-danger text-white rounded-xl font-bold hover:bg-danger/90 transition-all transform hover:scale-105 flex items-center gap-2">
            <Trash2 size={20} /> إزالة الصورة
          </button>
       </div>
     </div>
   ) : (
     <div className="relative group w-full max-w-lg aspect-video">
       <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
       <div className="w-full h-full bg-surface-alt border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-4 group-hover:border-primary group-hover:bg-primary-soft/30 transition-all">
         <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
           <Upload size={32} className="text-primary" />
         </div>
           <div className="text-center">
             <span className="block font-bold text-muted-dark text-lg mb-1">انقر لرفع صورة التأشيرة</span>
             <span className="text-sm font-medium text-muted">PNG, JPG, WEBP حتى 10 ميجابايت</span>
           </div>
       </div>
     </div>
   )}
   <input type="url" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full max-w-lg bg-surface border border-border rounded-xl px-4 py-3 text-sm font-medium text-muted-dark focus:border-primary focus: focus: text-left" dir="ltr" placeholder="أو أضف رابط الصورة هنا مباشرة"/>
 </div>

 <div className="grid grid-cols-1 gap-6">
 <div>
 <label className="block text-sm font-bold text-muted-dark mb-3">نوع التأشيرة</label>
 <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-surface-alt border border-border rounded-2xl px-5 py-4 text-sm font-bold text-muted-dark focus:outline-none focus:border-primary focus: focus: transition-all" placeholder="مثال: تأشيرة سياحية للسعودية"/>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div>
 <label className="block text-sm font-bold text-muted-dark mb-3">السعر</label>
 <input type="text" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-surface-alt border border-border rounded-2xl px-5 py-4 text-sm font-bold text-muted-dark focus:outline-none focus:border-primary focus: focus: transition-all" placeholder="مثال: 1500"/>
 </div>
 <div>
 <label className="block text-sm font-bold text-muted-dark mb-3">العملة</label>
 <input type="text" value={formData.currency || ''} onChange={e => setFormData({...formData, currency: e.target.value})} className="w-full bg-surface-alt border border-border rounded-2xl px-5 py-4 text-sm font-bold text-muted-dark focus:outline-none focus:border-primary focus: focus: transition-all" placeholder="مثال: ر.س، درهم، $"/>
 </div>
 <div>
 <label className="block text-sm font-bold text-muted-dark mb-3">المدة</label>
 <input type="text" value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-surface-alt border border-border rounded-2xl px-5 py-4 text-sm font-bold text-muted-dark focus:outline-none focus:border-primary focus: focus: transition-all" placeholder="مثال: 30 يوم"/>
 </div>
 </div>
 </div>
 </div>

 <div className="space-y-6">
  <h3 className="label-caps !text-xs flex items-center gap-3 border-b border-border pb-4">
  <div className="accent-line !h-4"></div>
  التفاصيل والحالة
  </h3>
 <div className="grid grid-cols-1 gap-6">
 <div>
 <label className="block text-sm font-bold text-muted-dark mb-3">وقت المعالجة</label>
 <input type="text" value={formData.processingTime || ''} onChange={e => setFormData({...formData, processingTime: e.target.value})} className="w-full bg-surface-alt border border-border rounded-2xl px-5 py-4 text-sm font-bold text-muted-dark focus:outline-none focus:border-primary focus: focus: transition-all" placeholder="مثال: 3-5 أيام عمل"/>
 </div>
 <div>
 <label className="block text-sm font-bold text-muted-dark mb-3">المميزات</label>
 <div className="w-full bg-surface-alt border border-border rounded-2xl p-2 focus-within:border-primary transition-all flex flex-wrap gap-2 min-h-[60px] items-center">
   {(() => {
     let currentFeatures: string[] = [];
     if (Array.isArray(formData.features)) {
       currentFeatures = formData.features;
     } else if (typeof formData.features === 'string' && formData.features.trim() !== '') {
       currentFeatures = formData.features.split(',').map((f: string) => f.trim());
     }
     return currentFeatures.map((feature, index) => (
       <div key={index} className="bg-primary-soft text-primary px-3 py-1.5 rounded-xl text-sm font-extrabold flex items-center gap-2">
         {feature}
         <button type="button" onClick={() => removeFeature(index)} className="hover:text-danger transition-colors">
           <X size={14} />
         </button>
       </div>
     ));
   })()}
   <input 
     type="text" 
     value={featureInput} 
     onChange={e => setFeatureInput(e.target.value)} 
     onKeyDown={handleAddFeature} 
     className="flex-1 min-w-[50px] bg-transparent border-none focus:outline-none px-3 py-1.5 text-sm font-bold text-muted-dark" 
     placeholder="اكتب الميزة واضغط Enter أو زر الإضافة..."
   />
   <button 
     type="button"
     onClick={() => handleAddFeature()}
     className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all active:scale-95 shrink-0"
     title="إضافة ميزة"
   >
     <Plus size={20} />
   </button>
 </div>
 </div>
 <div>
 <label className="block text-sm font-bold text-muted-dark mb-3">الحالة</label>
 <select value={formData.status || 'نشط'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-surface-alt border border-border rounded-2xl px-5 py-4 text-sm font-bold text-muted-dark focus:outline-none focus:border-primary focus: focus: transition-all appearance-none cursor-pointer">
 <option value="نشط">نشط</option>
 <option value="غير نشط">غير نشط</option>
 </select>
 </div>
 </div>
 </div>
 </div>
 </>
 )}

 {activeTab === 'destinations' && (
 <>
 <div className="p-4 sm:p-6 md:p-8 space-y-8 sm:space-y-10">
 <div className="space-y-6">
 <h3 className="label-caps !text-xs flex items-center gap-3 border-b border-border pb-4">
 <div className="accent-line !h-4"></div>
 المعلومات الأساسية
 </h3>
 <div className="grid grid-cols-1 gap-6">
 <div>
 <label className="block text-sm font-bold text-muted-dark mb-3">اسم الوجهة</label>
 <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface-alt border border-border rounded-2xl px-5 py-4 text-sm font-bold text-muted-dark focus:outline-none focus:border-primary focus: focus: transition-all" placeholder="مثال: باريس, فرنسا"/>
 </div>
 <div>
 <label className="block text-sm font-bold text-muted-dark mb-3">التصنيف</label>
 <input type="text" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-surface-alt border border-border rounded-2xl px-5 py-4 text-sm font-bold text-muted-dark focus:outline-none focus:border-primary focus: focus: transition-all" placeholder="مثال: سياحة ترفيهية, شهر عسل"/>
 </div>
 </div>
 </div>

 <div className="space-y-6">
  <h3 className="label-caps !text-xs flex items-center gap-3 border-b border-border pb-4">
  <div className="accent-line !h-4"></div>
  الوسائط والوصف
  </h3>
 <div className="grid grid-cols-1 gap-6">
 <div>
 <label className="block text-sm font-bold text-muted-dark mb-3">رابط الصورة أو رفع ملف</label>
 <div className="flex flex-col gap-4">
 <input type="url" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-surface-alt border border-border rounded-2xl px-5 py-4 text-sm font-bold text-muted-dark focus:outline-none focus:border-primary focus: focus: transition-all text-left" dir="ltr" placeholder="https://example.com/destination.jpg"/>
 <div className="relative group">
 <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
 <div className="w-full bg-surface-alt border-2 border-dashed border-border rounded-2xl px-5 py-8 text-muted font-bold flex flex-col items-center justify-center gap-3 group-hover:border-primary group-hover:bg-primary-soft/30 transition-all">
 <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
 <Upload size={24} className="text-primary" />
 </div>
 <span>انقر هنا لرفع صورة من جهازك</span>
 <span className="text-xs font-medium opacity-70">PNG, JPG, WEBP حتى 10 ميجابايت</span>
 </div>
 </div>
  {formData.image && (
  <div className="relative w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden border border-border group">
  <img decoding="async" loading="lazy" src={formData.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
  <button type="button" onClick={() => setFormData({...formData, image: ''})} className="p-3 bg-danger text-white rounded-xl hover:bg-danger/90 transition-all transform hover:scale-110">
  <Trash2 size={20} />
  </button>
  </div>
  </div>
  )}
        </div>
        </div>
        <div>
        <label className="block text-sm font-bold text-muted-dark mb-3">الوصف</label>
        <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-surface-alt border border-border rounded-2xl px-5 py-4 text-sm font-bold text-muted-dark focus:outline-none focus:border-primary focus: focus: transition-all min-h-[7.5rem] resize-y" placeholder="اكتب وصفاً جذاباً للوجهة..."/>
        </div>
        </div>
        </div>
        </div>
        </>
        )}
        
        <div className="p-4 sm:p-6 md:p-8 border-t border-border bg-surface shrink-0">
        <button type="submit" form="itemForm" className="w-full bg-primary hover:bg-primary-hover text-white py-3 sm:py-4 rounded-2xl font-extrabold flex items-center justify-center gap-3 transition-all transform active:scale-95 text-base sm:text-lg">
        {editingItem ? <Edit size={22} /> : <Plus size={22} />}
        {editingItem ? 'حفظ التعديلات' : 'إضافة الآن'}
        </button>
        </div>
        </form>
        </div>
        </motion.div>
        </motion.div>
        )}
        </AnimatePresence>

  {/* View Booking Modal - Simple Version */}
  <AnimatePresence>
  {viewBooking && (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[300] flex flex-col justify-center items-center p-4 sm:p-6"
    dir="rtl"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 10 }}
      className="bg-white rounded-3xl w-full max-w-2xl flex flex-col max-h-[90dvh] overflow-hidden border border-gray-100 relative mx-auto"
    >
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">تفاصيل الطلب المستلم</h3>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
            رقم: {String(viewBooking.id || '').slice(0, 12)} | {String(viewBooking.date || '')}
          </p>
          {isFetchingBookingDetails && (
            <div className="text-xs text-primary mt-1 font-bold animate-pulse">جاري سحب المرفقات...</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewBooking(null)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors no-print">
            <X size={20} />
          </button>
        </div>
      </div>
      
      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-6 print-content custom-scrollbar">
        <div className="flex flex-col gap-6">
          
          {/* Top Quick Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50/80 rounded-xl border border-gray-100">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">الخدمة</p>
              <p className="text-sm font-bold text-gray-900">{String(viewBooking.serviceType || viewBooking.service || 'غير محدد')}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">المبلغ</p>
              <p className="text-sm font-bold text-success">{viewBooking.amount || 'يتم التنسيق'}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">حالة الحجز</p>
              <div className="flex items-center gap-2">
                <select 
                  value={viewBooking.status} 
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    handleUpdateBookingStatus(viewBooking.id, newStatus);
                    setViewBooking({...viewBooking, status: newStatus});
                  }}
                  className={`text-sm font-bold bg-white border border-gray-200 rounded-xl px-3 py-1.5 cursor-pointer focus:outline-none focus: focus: transition-all ${
                    viewBooking.status === 'مكتمل' ? 'text-success' : 
                    viewBooking.status === 'قيد الانتظار' ? 'text-warning' : 'text-danger'
                  }`}
                >
                  <option value="قيد الانتظار">قيد الانتظار</option>
                  <option value="مكتمل">مكتمل</option>
                  <option value="ملغي">ملغي</option>
                </select>
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  viewBooking.status === 'مكتمل' ? 'bg-success' : 
                  viewBooking.status === 'قيد الانتظار' ? 'bg-warning' : 'bg-danger'
                }`}></div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">بيانات العميل</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-white border border-gray-100 rounded-xl p-4">
              <div>
                <span className="text-gray-400 block text-xs mb-1">الاسم الكامل</span>
                <span className="font-medium text-gray-900">{String(viewBooking.name || viewBooking.user || '-')}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs mb-1">رقم التواصل</span>
                <span className="font-medium text-gray-900 font-mono">
                  <span dir="ltr" className="inline-block">{String(viewBooking.phone || '-')}</span>
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs mb-1">البريد الإلكتروني</span>
                <span className="font-medium text-gray-900 break-all">{String(viewBooking.email || '-')}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs mb-1">رقم الجواز</span>
                <span className="font-medium text-gray-900 uppercase tracking-wider">{String(viewBooking.passportNumber || '-')}</span>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          {(typeof viewBooking.details === 'string' && viewBooking.details.trim() !== '') && (
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">تفاصيل إضافية</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 text-sm bg-white border border-gray-100 rounded-xl p-4">
                {viewBooking.details.split('\n').filter((line: string) => line.includes(':')).map((line: string, idx: number) => {
                  const [key, ...valueParts] = line.split(':');
                  const value = valueParts.join(':').trim();
                  if (!value) return null;
                  return (
                    <div key={idx} className="flex flex-col">
                      <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">{key.trim()}</span>
                      <span className="font-medium text-gray-900 text-sm">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          {viewBooking.details?.includes('ملاحظات:') && (
            <div className="bg-warning-soft text-warning p-4 rounded-xl border border-warning-soft-border text-sm">
              <span className="flex items-center gap-2 font-bold mb-2 text-muted-dark">
                <MessageCircle size={16} /> ملاحظات العميل:
              </span>
              <span className="whitespace-pre-wrap leading-relaxed text-muted-dark">{viewBooking.details.split('ملاحظات:')[1].trim()}</span>
            </div>
          )}

          {/* Attachments */}
          {(viewBooking.passportImage || viewBooking.personalPhoto || (viewBooking.documents && viewBooking.documents.length > 0)) && (
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">المرفقات</h4>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'صورة الجواز', value: viewBooking.passportImage },
                  { label: 'الصورة الشخصية', value: viewBooking.personalPhoto },
                  ...(Array.isArray(viewBooking.documents) 
                      ? viewBooking.documents.map((doc: string, idx: number) => ({ label: `مستند ${idx + 1}`, value: doc })) 
                      : (typeof viewBooking.documents === 'string' && viewBooking.documents.trim() ? [{ label: 'مستندات إضافية', value: viewBooking.documents }] : [])
                  )
                ].filter((att) => typeof att.value === 'string' && att.value.trim().length > 0).map((att, i) => {
                  // Basic XSS mitigation: only allow data uris and http schemas
                  const safeHref = att.value.startsWith('data:') || att.value.startsWith('http') ? att.value : '#';
                  return (
                  <a 
                    key={i} 
                    href={safeHref} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 border border-gray-200 rounded-xl p-2 hover:bg-gray-50 transition-all hover:border-gray-300 group"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                       {safeHref.startsWith('data:image') || safeHref.startsWith('http') ? (
                         <img src={safeHref} alt={att.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-400">📄</div>
                       )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 pr-1 pl-3">{att.label}</span>
                  </a>
                  );
                })}
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 no-print shrink-0 mt-auto">
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => {
              const phone = viewBooking.phone ? String(viewBooking.phone).replace(/\D/g, '') : '';
              if (!phone) { showToast('رقم الهاتف غير متوفر', 'error'); return; }
              const message = `مرحباً ${viewBooking.name || viewBooking.user}، بخصوص طلب حجزك (${viewBooking.serviceType || viewBooking.service})...`;
              window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
            }}
            className="flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2 bg-success text-white text-sm font-bold rounded-xl hover:bg-success/90 transition active:scale-95 flex"
          >
            <WhatsAppIcon size={16} />
            <span className="inline">واتساب</span>
          </button>
          
          <button 
            onClick={() => window.print()}
            className="flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition active:scale-95 flex"
          >
            <Printer size={16} />
            <span className="inline">طباعة</span>
          </button>
        </div>
        
        <button 
          onClick={() => setViewBooking(null)}
          className="w-full sm:w-auto px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition active:scale-95"
        >
          إغلاق النافذة
        </button>
      </div>

    </motion.div>
  </motion.div>
  )}
  </AnimatePresence>



  {/* Confirm Modal */}
  <AnimatePresence>
  {confirmModal && (
  <motion.div 
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="fixed inset-0 bg-muted-dark/40 backdrop-blur-sm z-[250] flex items-center justify-center p-4 sm:p-6">
  <motion.div
  initial={{ opacity: 0, scale: 0.95, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="bg-surface rounded-2xl w-full max-w-md overflow-hidden border border-border"
  >
  <div className="p-8 md:p-10 text-center">
  <div className="w-20 h-20 bg-danger-soft rounded-full flex items-center justify-center text-danger mx-auto mb-6 shrink-0 relative">
  <AlertTriangle size={36} />
  </div>
  <h3 className="text-2xl font-bold text-muted-dark mb-4 tracking-normal">تأكيد الحذف</h3>
  <p className="text-sm sm:text-base text-muted font-medium leading-relaxed">{confirmModal.message}</p>
  </div>
  <div className="p-5 border-t border-border flex flex-col sm:flex-row gap-3 bg-surface">
  <button onClick={() => setConfirmModal(null)} className="flex-1 py-3.5 rounded-xl font-bold text-muted-dark bg-surface border border-border hover:bg-surface-alt transition-all">
  إلغاء
  </button>
  <button onClick={confirmModal.onConfirm} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-danger hover:bg-danger/90 transition-all flex items-center justify-center gap-2">
  <Trash2 size={18} />
  تأكيد الحذف
  </button>
  </div>
  </motion.div>
  </motion.div>
  )}
  </AnimatePresence>

  {/* Toast */}
  <AnimatePresence>
  {toast && (
  <motion.div
  initial={{ opacity: 0, y: 50, x: '-50%' }}
  animate={{ opacity: 1, y: 0, x: '-50%' }}
  exit={{ opacity: 0, y: 50, x: '-50%' }}
  className={`fixed bottom-8 left-1/2 px-6 md:px-8 py-4 rounded-xl text-sm md:text-base font-bold text-white flex items-center gap-3 md:gap-4 z-[300] border-2 w-[90%] md:w-auto max-w-md justify-center text-center ${
  toast.type === 'success' 
  ? 'bg-primary border-primary' 
  : 'bg-danger border-danger-soft-border'
  }`}
  >
  <div className="w-8 h-8 rounded-2xl bg-surface/20 flex items-center justify-center shrink-0">
  {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
  </div>
  {toast.message}
  </motion.div>
  )}
  </AnimatePresence>
  </div>
  );
}
