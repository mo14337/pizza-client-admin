import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";
import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import {
  BellOutlined,
  GiftOutlined,
  HomeOutlined,
  ProductOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Logo from "../components/Logo";
import { logout } from "../http/api";
import { useMutation } from "@tanstack/react-query";

const getMenuItems = (role: string) => {
  const baseItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <NavLink to={"/"}>Home</NavLink>,
    },

    {
      key: "/tenants",
      icon: <ShopOutlined />,
      label: <NavLink to={"/tenants"}>Tenants</NavLink>,
    },
    {
      key: "/Products",
      icon: <ProductOutlined />,
      label: <NavLink to={"/products"}>Products</NavLink>,
    },
    {
      key: "/promos",
      icon: <GiftOutlined />,
      label: <NavLink to={"/promos"}>Promos</NavLink>,
    },
  ];
  if (role === "admin") {
    const menus = [...baseItems];
    menus.splice(1, 0, {
      key: "/users",
      icon: <UserOutlined />,
      label: <NavLink to={"/users"}>Users</NavLink>,
    });
    return menus;
  }
  return baseItems;
};
const adminOnlyRoutes = ["/users"];
const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout: logoutFromStore } = useAuthStore();
  const { pathname } = useLocation();

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: async () => {
      logoutFromStore();
      return;
    },
  });
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  if (!user) {
    return <Navigate to={"/auth/login"} replace={true} />;
  }
  if (user.role !== "admin" && adminOnlyRoutes.includes(pathname)) {
    return <Navigate to={"/"} replace={true} />;
  }
  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="sidebar-logo">
            <Logo />
          </div>
          <Menu
            theme="light"
            defaultSelectedKeys={["/"]}
            mode="inline"
            items={getMenuItems(user.role)}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              paddingLeft: "16px",
              paddingRight: "16px",
              background: colorBgContainer,
            }}
          >
            <Flex gap="middle" align="start" justify="space-between">
              <Badge
                text={
                  user.role === "admin"
                    ? "You Are The Admin"
                    : user?.tenant?.name
                }
                status="success"
              />
              <Space size={16}>
                <Badge>
                  <BellOutlined />
                </Badge>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 1,
                        label: "Logout",
                        onClick: () => logoutMutate(),
                      },
                    ],
                  }}
                  placement="bottomRight"
                  arrow
                >
                  <Avatar>U</Avatar>
                </Dropdown>
              </Space>
            </Flex>
          </Header>
          <Content style={{ margin: "24px" }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>Mern Pizza app</Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default Dashboard;
