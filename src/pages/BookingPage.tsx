import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plane, Building, ShieldCheck, Globe, Shield, User, Phone, Mail, FileText, ArrowRight, CheckCircle2, Camera, FileCode
} from 'lucide-react';
import { apiService } from '../lib/apiService';
import { securityUtils } from '../lib/utils';

interface BookingPageProps {
  initialServiceType?: string;
  context?: any;
  contactInfo?: any;
  showAppToast: (message: string, type: 'success' | 'error') => void;
  onNavigate: (page: string, service?: string, context?: any) => void;
  onAddBooking: (booking: any) => void;
  currentUser?: any;
}

export const BookingPage: React.FC<BookingPageProps> = ({ 
  initialServiceType = 'flight', 
  context, 
  contactInfo, 
  showAppToast, 
  onNavigate, 
  onAddBooking,
  currentUser
}) => {
  const [serviceType, setServiceType] = useState(initialServiceType);
  const [whatsappFallbackUrl, setWhatsappFallbackUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setServiceType(initialServiceType);
  }, [initialServiceType]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    website: '', // Honeypot field
    preferredContact: 'whatsapp',
    preferredContactTime: 'any',
    passportNumber: '',
    passportImage: null as string | null,
    personalPhoto: null as string | null,
    documents: null as string | null,
    notes: context?.offerName 
      ? `أرغب بحجز العرض: ${context.offerName}` 
      : context?.visaName 
        ? `أرغب بطلب تأشيرة: ${context.visaName}` 
        : '',
    // Flight fields
    flightFrom: '',
    flightTo: context?.destination || '',
    flightDate: '',
    flightReturnDate: '',
    flightAdults: '1',
    flightChildren: '0',
    flightInfants: '0',
    flightType: 'round_trip',
    flightClass: 'economy',
    flightPreferredTime: 'any',
    flightDirect: 'any',
    // Hotel fields
    hotelCity: context?.destination || '',
    hotelCheckIn: '',
    hotelCheckOut: '',
    hotelAdults: '1',
    hotelChildren: '0',
    hotelRooms: '1',
    hotelMealPlan: 'breakfast',
    hotelRoomType: 'double',
    // Visa fields
    visaNationality: '',
    visaDestination: context?.destination || '',
    visaType: 'tourist',
    visaDate: '',
    visaDuration: '30',
    visaPassportExpiry: '',
    // Travel Insurance fields
    insuranceDestination: context?.destination || '',
    insuranceStartDate: '',
    insuranceEndDate: '',
    insuranceDOB: '',
    // Company Setup fields
    companyCountry: context?.destination || '',
    companyType: 'llc',
    companyPartners: '1',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGeneralPassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAppToast('حجم الملف كبير جداً. الحد الأقصى هو 5 ميجابايت.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, passportImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showAppToast('حجم الملف كبير جداً. الحد الأقصى هو 10 ميجابايت.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, documents: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAppToast('حجم الملف كبير جداً. الحد الأقصى هو 5 ميجابايت.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, personalPhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (formData.website) {
      console.warn('Bot submission detected');
      setIsSuccess(true); // Fake success to fool bots
      return;
    }

    setIsSubmitting(true);
    
    try {
      let details = '';
      if (serviceType === 'flight') {
        const typeMap: any = { 'one_way': 'ذهاب فقط', 'round_trip': 'ذهاب وعودة', 'multi': 'وجهات متعددة' };
        const classMap: any = { 'economy': 'اقتصادية', 'business': 'رجال أعمال', 'first': 'درجة أولى' };
        const timeMap: any = { 'any': 'أي وقت', 'morning': 'صباحاً', 'afternoon': 'ظهراً', 'evening': 'مساءً' };
        const directMap: any = { 'any': 'أي رحلة', 'direct': 'مباشرة فقط' };
        details = `نوع الرحلة: ${typeMap[formData.flightType]}\nالدرجة: ${classMap[formData.flightClass]}\nمن: ${formData.flightFrom}\nإلى: ${formData.flightTo}\nتاريخ الذهاب: ${formData.flightDate}${formData.flightType === 'round_trip' ? `\nتاريخ العودة: ${formData.flightReturnDate}` : ''}\nالبالغين: ${formData.flightAdults}\nالأطفال: ${formData.flightChildren}\nالرضع: ${formData.flightInfants}\nالوقت المفضل: ${timeMap[formData.flightPreferredTime]}\nتفضيل الرحلة: ${directMap[formData.flightDirect]}`;
      } else if (serviceType === 'hotel') {
        const mealMap: any = { 'room_only': 'بدون وجبات', 'breakfast': 'إفطار', 'half_board': 'إقامة مع وجبتين', 'full_board': 'إقامة كاملة', 'all_inclusive': 'شامل كلياً' };
        const roomMap: any = { 'single': 'غرفة مفردة', 'double': 'غرفة مزدوجة', 'triple': 'غرفة ثلاثية', 'suite': 'جناح' };
        details = `المدينة/الفندق: ${formData.hotelCity}\nنوع الغرفة: ${roomMap[formData.hotelRoomType]}\nنظام الوجبات: ${mealMap[formData.hotelMealPlan]}\nوصول: ${formData.hotelCheckIn}\nمغادرة: ${formData.hotelCheckOut}\nالغرف: ${formData.hotelRooms}\nالبالغين: ${formData.hotelAdults}\nالأطفال: ${formData.hotelChildren}`;
      } else if (serviceType === 'visa' || serviceType === 'visa_uae' || serviceType === 'visa_other') {
        const visaTypeMap: any = { 'tourist': 'سياحية', 'business': 'عمل', 'study': 'دراسة', 'medical': 'علاج' };
        details = `الجنسية: ${formData.visaNationality}\nالوجهة: ${formData.visaDestination}\nالنوع: ${visaTypeMap[formData.visaType]}\nالمدة: ${formData.visaDuration} يوم\nالتاريخ المتوقع: ${formData.visaDate}\nانتهاء الجواز: ${formData.visaPassportExpiry}\nصورة الجواز: ${formData.passportImage ? 'مرفقة' : 'غير مرفقة'}`;
      } else if (serviceType === 'travel_insurance') {
        details = `الوجهة: ${formData.insuranceDestination}\nتاريخ البداية: ${formData.insuranceStartDate}\nتاريخ النهاية: ${formData.insuranceEndDate}\nتاريخ الميلاد: ${formData.insuranceDOB}`;
      } else if (serviceType === 'company_setup') {
        const companyTypeMap: any = { 'llc': 'ذات مسؤولية محدودة (LLC)', 'freezone': 'منطقة حرة', 'offshore': 'أوفشور' };
        details = `الدولة/المدينة: ${formData.companyCountry}\nنوع الشركة: ${companyTypeMap[formData.companyType]}\nعدد الشركاء: ${formData.companyPartners}`;
      }

      const contactMap: any = { 'whatsapp': 'واتساب', 'call': 'اتصال هاتفي', 'email': 'بريد إلكتروني' };
      const contactTimeMap: any = { 'any': 'أي وقت', 'morning': 'صباحاً', 'afternoon': 'ظهراً', 'evening': 'مساءً' };
      const serviceNameMap: any = {
        'flight': 'طيران',
        'hotel': 'فنادق',
        'visa': 'تأشيرات',
        'visa_uae': 'تأشيرة سياحة الإمارات',
        'visa_other': 'تأشيرة سياحة أخرى',
        'travel_insurance': 'تأمين سفر',
        'company_setup': 'تأسيس شركات'
      };
      const message = `*طلب حجز جديد*\n\n*الخدمة:* ${serviceNameMap[serviceType] || serviceType}\n*الاسم:* ${formData.name}\n*رقم الجواز:* ${formData.passportNumber}\n*الهاتف:* ${formData.phone}\n*الايميل:* ${formData.email || 'غير محدد'}\n*وسيلة التواصل:* ${contactMap[formData.preferredContact]}\n*وقت التواصل المفضل:* ${contactTimeMap[formData.preferredContactTime]}\n*مرفقات:* ${formData.passportImage ? 'صورة الجواز' : ''} ${formData.personalPhoto ? 'الصورة الشخصية' : ''} ${formData.documents ? 'مستندات إضافية' : ''}\n\n*التفاصيل:*\n${details}\n\n*ملاحظات:* ${formData.notes || 'لا يوجد'}`;
      
      const whatsappNumber = '201154162244';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      // Open immediately to bypass popup blockers
      const whatsappWindow = window.open('about:blank', '_blank');
      
      const bookingData = {
        userId: currentUser?.id || null,
        name: securityUtils.sanitizeString(formData.name),
        phone: securityUtils.sanitizeString(formData.phone),
        email: formData.email ? securityUtils.sanitizeString(formData.email) : '',
        passportNumber: securityUtils.sanitizeString(formData.passportNumber),
        preferredContact: contactMap[formData.preferredContact],
        preferredContactTime: contactTimeMap[formData.preferredContactTime],
        service: serviceNameMap[serviceType] || serviceType,
        serviceType: serviceType,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        details: securityUtils.sanitizeString(formData.notes ? `${details}\n\nملاحظات: ${formData.notes}` : details),
        passportImage: formData.passportImage,
        personalPhoto: formData.personalPhoto,
        documents: formData.documents
      };

      // Set fallback and success state early to improve perceived speed
      setWhatsappFallbackUrl(whatsappUrl);
      
      // Update the opened window with the whatsapp URL
      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }

      // Show success screen immediately
      setIsSuccess(true);
      showAppToast('تم إرسال طلبك بنجاح! سيتم تحويلك إلى واتساب.', 'success');

      // Save to database in background
      try {
        const savedBooking = await apiService.addBooking(bookingData);
        onAddBooking(savedBooking);
      } catch (saveError: any) {
        console.error('Background save error:', saveError);
        // Inform user that even though WhatsApp opened, the database save failed
        showAppToast(`تنبيه: تم فتح واتساب ولكن فشل حفظ البيانات في النظام (${saveError.message})`, 'error');
      }
    } catch (error: any) {
      console.error('Booking submission error:', error);
      showAppToast(`خطأ في الإرسال: ${error.message || 'يرجى المحاولة مرة أخرى.'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-12 md:py-20 px-4 max-w-2xl mx-auto min-h-[70vh] flex flex-col justify-center"
      >
        <div className="bg-surface rounded-3xl border border-border p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="w-20 h-20 bg-primary-soft text-primary rounded-2xl flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 size={40} strokeWidth={2.5} />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-muted-dark mb-4">
            تم استلام طلبك بنجاح
          </h2>
          
          <p className="text-muted text-base md:text-lg mb-10 leading-relaxed max-w-md mx-auto font-medium">
            شكراً لثقتك بنا. طلبك الآن قيد المعالجة، وسيقوم أحد مسؤولي الحجوزات بالتواصل معك عبر واتساب لمتابعة الإجراءات.
          </p>
          
          <div className="space-y-4 max-w-sm mx-auto">
            {whatsappFallbackUrl && (
              <a 
                href={whatsappFallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 h-14 bg-success text-white rounded-xl font-bold text-base hover:bg-success/90 transition-all active:scale-95"
              >
                المتابعة عبر واتساب
              </a>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="h-14 bg-surface text-muted-dark border border-border hover:border-primary/40 hover:text-primary rounded-xl font-bold text-sm transition-all"
              >
                حجز جديد
              </button>
              <button 
                onClick={() => onNavigate('home')}
                className="h-14 bg-surface text-muted-dark border border-border hover:border-primary/40 hover:text-primary rounded-xl font-bold text-sm transition-all"
              >
                الرئيسية
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-6 md:py-8 px-4 md:px-6 max-w-4xl mx-auto"
    >
      <div className="relative mb-8 md:mb-10 flex flex-col items-center">
        <div className="w-full flex justify-start mb-6 md:absolute md:top-2 md:right-0 md:mb-0">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 md:gap-2 text-muted hover:text-primary transition-all font-bold text-xs md:text-sm group"
          >
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            العودة للرئيسية
          </button>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-extrabold mb-4 border border-primary/10 uppercase tracking-[0.2em] mx-auto">
             احجز رحلتك الآن
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-muted-dark mb-4 leading-tight tracking-normal">
            طلب <span className="text-primary relative inline-block">
              حجز جديد
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/20" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 10 Q 50 18 100 10" fill="transparent" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-sm md:text-base text-muted font-medium max-w-xl mx-auto leading-relaxed">
            يرجى ملء البيانات التالية وسنقوم بالتواصل معك في أقرب وقت لإتمام حجزك بأفضل الخيارات المتاحة.
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
        
        <div className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Honeypot field - hidden from users */}
            <div className="hidden" aria-hidden="true">
              <input 
                type="text" 
                name="website" 
                value={formData.website} 
                onChange={handleChange} 
                tabIndex={-1} 
                autoComplete="off" 
              />
            </div>

            {/* Service Selection */}
            <div className="space-y-6">
              <h3 className="text-base md:text-lg font-bold text-muted-dark flex items-center gap-3">
                <div className="accent-line"></div>
                اختر نوع الخدمة
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
                {[
                  { id: 'flight', label: 'طيران', icon: Plane },
                  { id: 'hotel', label: 'فنادق', icon: Building },
                  { id: 'visa_uae', label: 'تأشيرة سياحة الإمارات', icon: ShieldCheck },
                  { id: 'visa_other', label: 'تأشيرة سياحة أخرى', icon: Globe },
                  { id: 'travel_insurance', label: 'تأمين سفر', icon: Shield },
                  { id: 'company_setup', label: 'تأسيس شركات', icon: Building },
                ].map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setServiceType(service.id)}
                    className={`group h-full py-3 md:py-5 px-1 md:px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 md:gap-3 transition-all duration-300 border-2 active:scale-95 select-none ${
 serviceType === service.id 
 ? 'bg-primary-light/30 border-primary text-primary' 
 : 'bg-surface-alt border-transparent text-muted hover:bg-border hover:text-muted-dark'
 }`}
                  >
                    <div className={`shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all ${
 serviceType === service.id ? 'bg-primary text-white' : 'bg-surface text-muted group-hover:text-muted-dark'
 }`}>
                      <service.icon size={16} strokeWidth={2.5} className="md:w-5 md:h-5" />
                    </div>
                    <span className="text-[10px] md:text-sm font-bold text-center px-0.5 leading-tight">{service.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Info */}
            <div className="space-y-6">
              <h3 className="text-base md:text-lg font-bold text-muted-dark flex items-center gap-3">
                <div className="accent-line"></div>
                البيانات الشخصية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-2">
                  <label className="block label-caps mb-2 pr-1">الاسم الكامل</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                      <User size={18} />
                    </div>
                    <input 
                      required 
                      type="text"
                      name="name"
                      value={formData.name || ''} 
                      onChange={handleChange} 
                      className="w-full bg-surface-alt border border-border rounded-xl pr-11 pl-4 py-3.5 text-sm md:text-base text-muted-dark font-medium focus:outline-none focus:border-primary transition-all"
                      placeholder="أحمد محمد"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block label-caps mb-2 pr-1">رقم الهاتف</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                      <Phone size={18} />
                    </div>
                    <input 
                      required 
                      type="tel"
                      name="phone"
                      value={formData.phone || ''} 
                      onChange={handleChange} 
                      className="w-full bg-surface-alt border border-border rounded-xl pr-11 pl-4 py-3.5 text-sm md:text-base text-muted-dark font-medium focus:outline-none focus:border-primary transition-all text-right"
                      placeholder="+201553004593"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block label-caps mb-2 pr-1">البريد الإلكتروني (اختياري)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email || ''} 
                      onChange={handleChange} 
                      className="w-full bg-surface-alt border border-border rounded-xl pr-11 pl-4 py-3.5 text-sm md:text-base text-muted-dark font-medium focus:outline-none focus:border-primary transition-all text-left"
                      placeholder="example@mail.com"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block label-caps mb-2 pr-1">رقم الجواز</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                      <FileText size={18} />
                    </div>
                    <input 
                      required 
                      type="text"
                      name="passportNumber"
                      value={formData.passportNumber || ''} 
                      onChange={handleChange} 
                      className="w-full bg-surface-alt border border-border rounded-xl pr-11 pl-4 py-3.5 text-sm md:text-base text-muted-dark font-medium focus:outline-none focus:border-primary transition-all text-left"
                      placeholder="A1234567"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block label-caps mb-2 pr-1">طريقة التواصل المفضلة</label>
                  <select name="preferredContact" value={formData.preferredContact} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm md:text-base font-medium focus:outline-none focus:border-primary transition-all">
                    <option value="whatsapp">واتساب</option>
                    <option value="call">اتصال هاتفي</option>
                    <option value="email">بريد إلكتروني</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block label-caps mb-2 pr-1">وقت التواصل المفضل</label>
                  <select name="preferredContactTime" value={formData.preferredContactTime} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm md:text-base font-medium focus:outline-none focus:border-primary transition-all">
                    <option value="any">أي وقت</option>
                    <option value="morning">صباحاً</option>
                    <option value="afternoon">ظهراً</option>
                    <option value="evening">مساءً</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-6">
              <h3 className="text-base md:text-lg font-bold text-muted-dark flex items-center gap-3">
                <div className="accent-line"></div>
                تفاصيل الحجز
              </h3>
              
              {serviceType === 'flight' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">من</label>
                    <input type="text" name="flightFrom" value={formData.flightFrom} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" placeholder="مطار المغادرة" />
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">إلى</label>
                    <input type="text" name="flightTo" value={formData.flightTo} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" placeholder="مطار الوصول" />
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">تاريخ الذهاب</label>
                    <input type="date" min={today} name="flightDate" value={formData.flightDate} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">تاريخ العودة</label>
                    <input type="date" min={formData.flightDate || today} name="flightReturnDate" value={formData.flightReturnDate} onChange={handleChange} disabled={formData.flightType === 'one_way'} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all disabled:opacity-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">نوع الرحلة</label>
                    <select name="flightType" value={formData.flightType} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all">
                      <option value="round_trip">ذهاب وعودة</option>
                      <option value="one_way">ذهاب فقط</option>
                      <option value="multi">وجهات متعددة</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">الدرجة</label>
                    <select name="flightClass" value={formData.flightClass} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all">
                      <option value="economy">اقتصادية</option>
                      <option value="business">رجال أعمال</option>
                      <option value="first">درجة أولى</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">الوقت المفضل للرحلة</label>
                    <select name="flightPreferredTime" value={formData.flightPreferredTime} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all">
                      <option value="any">أي وقت</option>
                      <option value="morning">صباحاً</option>
                      <option value="afternoon">ظهراً</option>
                      <option value="evening">مساءً</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">تفضيل التوقف</label>
                    <select name="flightDirect" value={formData.flightDirect} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all">
                      <option value="any">أي رحلة (مع توقف أو بدون)</option>
                      <option value="direct">رحلات مباشرة فقط</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-3 md:col-span-2">
                    <div className="space-y-2">
                      <label className="block label-caps mb-2 pr-1">بالغين</label>
                      <input type="number" min="1" name="flightAdults" value={formData.flightAdults} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="block label-caps mb-2 pr-1">أطفال</label>
                      <input type="number" min="0" name="flightChildren" value={formData.flightChildren} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="block label-caps mb-2 pr-1">رضع</label>
                      <input type="number" min="0" name="flightInfants" value={formData.flightInfants} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {serviceType === 'hotel' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <label className="block label-caps mb-2 pr-1">المدينة أو الفندق</label>
                    <input type="text" name="hotelCity" value={formData.hotelCity} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" placeholder="أين تريد الإقامة؟" />
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">تاريخ الوصول</label>
                    <input type="date" min={today} name="hotelCheckIn" value={formData.hotelCheckIn} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">تاريخ المغادرة</label>
                    <input type="date" min={formData.hotelCheckIn || today} name="hotelCheckOut" value={formData.hotelCheckOut} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">نوع الغرفة</label>
                    <select name="hotelRoomType" value={formData.hotelRoomType} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all">
                      <option value="single">غرفة مفردة</option>
                      <option value="double">غرفة مزدوجة</option>
                      <option value="triple">غرفة ثلاثية</option>
                      <option value="suite">جناح</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">نظام الوجبات</label>
                    <select name="hotelMealPlan" value={formData.hotelMealPlan} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all">
                      <option value="room_only">بدون وجبات</option>
                      <option value="breakfast">إفطار</option>
                      <option value="half_board">إقامة مع وجبتين</option>
                      <option value="full_board">إقامة كاملة</option>
                      <option value="all_inclusive">شامل كلياً</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-3 md:col-span-2">
                    <div className="space-y-2">
                      <label className="block label-caps mb-2 pr-1">بالغين</label>
                      <input type="number" min="1" name="hotelAdults" value={formData.hotelAdults} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="block label-caps mb-2 pr-1">أطفال</label>
                      <input type="number" min="0" name="hotelChildren" value={formData.hotelChildren} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="block label-caps mb-2 pr-1">عدد الغرف</label>
                      <input type="number" min="1" name="hotelRooms" value={formData.hotelRooms} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {(serviceType === 'visa' || serviceType === 'visa_uae' || serviceType === 'visa_other') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">الجنسية</label>
                    <input type="text" name="visaNationality" value={formData.visaNationality} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" placeholder="مثلاً: مصري" />
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">الوجهة</label>
                    <input type="text" name="visaDestination" value={formData.visaDestination} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" placeholder="الدولة المراد السفر إليها" />
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">نوع التأشيرة</label>
                    <select name="visaType" value={formData.visaType} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all">
                      <option value="tourist">سياحية</option>
                      <option value="business">عمل</option>
                      <option value="study">دراسة</option>
                      <option value="medical">علاج</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">مدة الإقامة (أيام)</label>
                    <input type="number" name="visaDuration" value={formData.visaDuration} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">تاريخ السفر المتوقع</label>
                    <input type="date" min={today} name="visaDate" value={formData.visaDate} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">تاريخ انتهاء الجواز</label>
                    <input type="date" min={today} name="visaPassportExpiry" value={formData.visaPassportExpiry} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                  </div>
                </div>
              )}

              {serviceType === 'travel_insurance' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <label className="block label-caps mb-2 pr-1">الوجهة</label>
                    <input type="text" name="insuranceDestination" value={formData.insuranceDestination} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" placeholder="الدولة المراد تغطيتها" />
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">تاريخ البداية</label>
                    <input type="date" min={today} name="insuranceStartDate" value={formData.insuranceStartDate} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">تاريخ النهاية</label>
                    <input type="date" min={formData.insuranceStartDate || today} name="insuranceEndDate" value={formData.insuranceEndDate} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">تاريخ الميلاد</label>
                    <input type="date" name="insuranceDOB" max={today} value={formData.insuranceDOB} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                  </div>
                </div>
              )}

              {serviceType === 'company_setup' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">الدولة / المدينة</label>
                    <input type="text" name="companyCountry" value={formData.companyCountry} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" placeholder="أين تريد تأسيس الشركة؟" />
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">نوع الشركة</label>
                    <select name="companyType" value={formData.companyType} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all">
                      <option value="llc">ذات مسؤولية محدودة (LLC)</option>
                      <option value="freezone">منطقة حرة</option>
                      <option value="offshore">أوفشور</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">عدد الشركاء</label>
                    <input type="number" min="1" name="companyPartners" value={formData.companyPartners} onChange={handleChange} className="w-full bg-surface-alt border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                  </div>
                </div>
              )}

              {/* Attachments Section */}
              <div className="space-y-6 pt-6 border-t border-border">
                <h3 className="text-base md:text-lg font-bold text-muted-dark flex items-center gap-3">
                  <div className="accent-line"></div>
                  المرفقات (صور/مستندات)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">صورة الجواز</label>
                    <div className="relative h-24 bg-surface-alt border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all">
                      <input type="file" accept="image/*" onChange={handleGeneralPassportUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      {formData.passportImage ? <CheckCircle2 className="text-success" size={24} /> : <Camera className="text-muted" size={24} />}
                      <span className="text-[10px] font-bold text-muted mt-2">{formData.passportImage ? 'تم الرفع' : 'رفع صورة'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">صورة شخصية</label>
                    <div className="relative h-24 bg-surface-alt border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all">
                      <input type="file" accept="image/*" onChange={handlePersonalPhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      {formData.personalPhoto ? <CheckCircle2 className="text-success" size={24} /> : <User className="text-muted" size={24} />}
                      <span className="text-[10px] font-bold text-muted mt-2">{formData.personalPhoto ? 'تم الرفع' : 'رفع صورة'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block label-caps mb-2 pr-1">مستندات إضافية</label>
                    <div className="relative h-24 bg-surface-alt border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all">
                      <input type="file" accept="image/*,application/pdf" onChange={handleDocumentsUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      {formData.documents ? <CheckCircle2 className="text-success" size={24} /> : <FileCode className="text-muted" size={24} />}
                      <span className="text-[10px] font-bold text-muted mt-2">{formData.documents ? 'تم الرفع' : 'رفع ملف'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

              {/* Add other service types as needed... */}

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-bold text-muted-dark flex items-center gap-3">
                <div className="accent-line"></div>
                ملاحظات إضافية
              </h3>
              <textarea 
                name="notes"
                value={formData.notes} 
                onChange={handleChange} 
                rows={4}
                className="w-full bg-surface-alt border border-border rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-primary transition-all resize-none"
                placeholder="أخبرنا بأي متطلبات خاصة أو تفاصيل إضافية..."
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-extrabold text-base md:text-lg transition-all duration-300 active:scale-95 select-none flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  ارسال طلب الحجز
                  <ArrowRight size={20} className="rotate-180" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.section>
  );
};
