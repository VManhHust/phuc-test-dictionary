export const isUserAdmin = (): boolean => {
    // Đoạn mã này chỉ là giả lập, trong thực tế sẽ kiểm tra từ context xác thực
    // Ví dụ: return session?.user?.role === 'ADMIN';
    return true; // Luôn trả về true trong môi trường phát triển
};

// HOC để bảo vệ các trang admin
export const withAdminAuth = (Component: React.ComponentType) => {
    const AdminProtectedComponent = (props: any) => {
        // Đây là nơi bạn sẽ thực hiện kiểm tra xác thực thực tế
        // Nếu không phải admin, chuyển hướng đến trang đăng nhập hoặc hiển thị lỗi
        const isAdmin = isUserAdmin();

        if (!isAdmin) {
            return (
                <div className="flex items-center justify-center h-screen bg-red-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Truy cập bị từ chối</h1>
            <p className="text-gray-600 mb-4">
                Bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập với tài khoản admin.
            </p>
            <a href="/" className="text-blue-600 hover:underline">
                Quay lại trang chủ
            </a>
            </div>
            </div>
        );
        }

        return <Component {...props} />;
    };

    // Copy getInitialProps nếu có
    if ((Component as any).getInitialProps) {
        AdminProtectedComponent.getInitialProps = (Component as any).getInitialProps;
    }

    return AdminProtectedComponent;
};