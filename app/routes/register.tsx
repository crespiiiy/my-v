import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Route } from "./+types/register";
import { useAuth } from "../contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "إنشاء حساب - كرييتيف" },
    { name: "description", content: "إنشاء حساب جديد في كرييتيف" },
  ];
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // إزالة الخطأ عند تعديل الحقل
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "الاسم الأول مطلوب";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "الاسم الأخير مطلوب";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "يرجى إدخال بريد إلكتروني صالح";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "يجب أن تكون كلمة المرور 6 أحرف على الأقل";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمات المرور غير متطابقة";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      
      if (result.success) {
        navigate("/account");
      } else {
        setErrors({ form: result.error || "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى." });
      }
    } catch (err) {
      setErrors({ form: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى." });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto my-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">إنشاء حساب جديد</h1>
        <p className="text-gray-400">انضم إلى مجتمع كرييتيف</p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-8">
        {errors.form && (
          <div className="bg-red-900/50 border border-red-700 text-white px-4 py-3 rounded-md mb-6">
            {errors.form}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                الاسم الأول
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-700 border ${
                  errors.firstName ? "border-red-500" : "border-gray-600"
                } rounded-md text-white`}
                autoComplete="given-name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                الاسم الأخير
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-700 border ${
                  errors.lastName ? "border-red-500" : "border-gray-600"
                } rounded-md text-white`}
                autoComplete="family-name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 border ${
                errors.email ? "border-red-500" : "border-gray-600"
              } rounded-md text-white`}
              autoComplete="email"
              dir="ltr"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 border ${
                errors.password ? "border-red-500" : "border-gray-600"
              } rounded-md text-white`}
              autoComplete="new-password"
              dir="ltr"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          
          <div className="mb-8">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-700 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-600"
              } rounded-md text-white`}
              autoComplete="new-password"
              dir="ltr"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors flex justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري إنشاء الحساب...
              </>
            ) : (
              "إنشاء حساب"
            )}
          </button>
        </form>
        
        <div className="flex justify-center mt-8">
          <p className="text-gray-400">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 