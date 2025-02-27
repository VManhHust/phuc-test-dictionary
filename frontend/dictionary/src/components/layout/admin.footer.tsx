'use client'
import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;

    return (
        <Footer style={{ backgroundColor: "#002B5B", textAlign: "center", padding: "20px", color: "white" }}>
            © {new Date().getFullYear()} Từ điển tiếng Việt. All rights reserved.
        </Footer>
    )
}

export default AdminFooter;