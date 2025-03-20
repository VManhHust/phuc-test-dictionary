import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// HOC để bảo vệ các trang admin
export function withAdminAuth(Component: React.ComponentType) {
  return function WithAdminAuth(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Nếu đã load xong và không có user hoặc user không phải admin
      if (!loading && (!user || !user.roles?.includes('ADMIN'))) {
        router.replace('/login?redirect=' + encodeURIComponent(router.asPath));
      }
    }, [user, loading, router]);

    // Hiển thị loading khi đang kiểm tra xác thực
    if (loading || !user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Đang xác thực...</p>
          </div>
        </div>
      );
    }

    // Nếu user không phải admin, không render gì cả (sẽ redirect)
    if (!user.roles?.includes('ADMIN')) {
      return null;
    }

    // Nếu là admin, render component
    return <Component {...props} />;
  };
}

// HOC để bảo vệ các trang yêu cầu đăng nhập
export function withAuth(Component: React.ComponentType) {
  return function WithAuth(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace('/login?redirect=' + encodeURIComponent(router.asPath));
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Đang xác thực...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}