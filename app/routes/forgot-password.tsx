import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../services/AuthService";

export function meta() {
  return [
    { title: "استعادة كلمة المرور - كرييتيف" },
    { name: "description", content: "استعادة كلمة المرور لحسابك في كرييتيف" },
  ];
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("يرجى إدخال بريدك الإلكتروني");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error) {
      console.error('خطأ في إرسال بريد إعادة تعيين كلمة المرور:', error);
      
      let errorMessage = "فشل في إرسال رابط إعادة تعيين كلمة المرور";
      
      if (error instanceof Error) {
        if (error.message.includes('user-not-found')) {
          errorMessage = "لم يتم العثور على حساب بهذا البريد الإلكتروني";
        } 
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto my-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">استعادة كلمة المرور</h1>
        <p className="text-gray-400">أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور</p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-8">
        {success ? (
          <div className="text-center">
            <div className="bg-green-900/50 border border-green-700 text-white px-4 py-4 rounded-md mb-6">
              <p>تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.</p>
              <p className="mt-2">يرجى التحقق من صندوق الوارد الخاص بك واتباع التعليمات.</p>
            </div>
            
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 mt-4 inline-block"
            >
              العودة إلى صفحة تسجيل الدخول
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-white px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  autoComplete="email"
                  dir="ltr"
                />
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
                    جاري الإرسال...
                  </>
                ) : (
                  "إرسال رابط إعادة التعيين"
                )}
              </button>
            </form>
            
            <div className="flex justify-center mt-8">
              <Link to="/login" className="text-blue-400 hover:text-blue-300">
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 