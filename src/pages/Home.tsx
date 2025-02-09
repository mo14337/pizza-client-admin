import Title from "antd/es/typography/Title";
import { useAuthStore } from "../store";
import { Card, Col, List, Row, Statistic, Tag, Typography } from "antd";
import { BarChartOutlined, ShoppingOutlined } from "@ant-design/icons";
import Link from "antd/es/typography/Link";
const { Text } = Typography;

const orders = [
  {
    orderSummary: "Order #101 - 2x Headphones",
    address: "123, MG Road, Mumbai",
    amount: 2999,
    status: "Delivered",
    loading: false,
  },
  {
    orderSummary: "Order #102 - 1x Laptop",
    address: "56, Nehru Street, Delhi",
    amount: 54999,
    status: "In Transit",
    loading: false,
  },
  {
    orderSummary: "Order #103 - 3x Mobile Covers",
    address: "78, Ring Road, Surat",
    amount: 999,
    status: "Pending",
    loading: false,
  },
  {
    orderSummary: "Order #104 - 1x Camera",
    address: "45, Park Avenue, Bangalore",
    amount: 34999,
    status: "Canceled",
    loading: false,
  },
  {
    orderSummary: "Order #105 - 1x Smartwatch",
    address: "89, VIP Circle, Ahmedabad",
    amount: 1999,
    status: "Shipped",
    loading: false,
  },
];

const getStatusTagColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "green";
    case "In Transit":
      return "blue";
    case "Pending":
      return "orange";
    case "Canceled":
      return "red";
    case "Shipped":
      return "purple";
    default:
      return "default";
  }
};

function Home() {
  const { user } = useAuthStore();
  return (
    <>
      <div>
        <Title level={5}>Welcome, {user?.firstName}</Title>
        <Row className="mt-4" gutter={16}>
          <Col span={12}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card bordered={false}>
                  <Statistic title="Total orders" value={52} />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic title="Total Sales" value={70000} />
                </Card>
              </Col>
              <Col span={24}>
                <Card
                  title={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <BarChartOutlined />
                      <Typography.Text>Sales</Typography.Text>
                    </div>
                  }
                  bordered={false}
                >
                  Card content
                </Card>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Card
              title={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <ShoppingOutlined />
                  <Typography.Text>Recent Orders</Typography.Text>
                </div>
              }
              bordered={false}
            >
              <List
                itemLayout="horizontal"
                dataSource={orders}
                renderItem={(order) => (
                  <List.Item>
                    {/* <Skeleton active={order.loading} title={false}> */}
                    <Row
                      style={{ width: "100%" }}
                      justify="space-between"
                      align="middle"
                    >
                      <Col span={10}>
                        <Text strong>
                          {order?.orderSummary || "Loading..."}
                        </Text>
                        <br />
                        <Text type="secondary">
                          {order?.address || "Loading address..."}
                        </Text>
                      </Col>
                      <Col
                        span={6}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Text strong>
                          {order?.amount ? `₹${order.amount}` : null}
                        </Text>
                      </Col>
                      <Col span={6} style={{ textAlign: "right" }}>
                        {order?.status && (
                          <Tag color={getStatusTagColor(order.status)}>
                            {order.status}
                          </Tag>
                        )}
                      </Col>
                    </Row>
                    {/* </Skeleton> */}
                  </List.Item>
                )}
              />
              <Row justify="start" style={{ marginTop: 16 }}>
                <Link>See all orders</Link>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Home;
