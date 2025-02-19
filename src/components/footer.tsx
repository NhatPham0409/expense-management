import { Footer } from "antd/es/layout/layout";

export default function AppFooter() {
  return (
    <Footer className="text-white">
      <div className="text-center text-gray-400">
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </div>
    </Footer>
  );
}
