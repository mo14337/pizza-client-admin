import {
  Breadcrumb,
  Col,
  Flex,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import { Order, Tenant } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { getOrders, getTenants } from "../../http/api";
import { format } from "date-fns";
import { capitalizeFirst } from "../product/helpers";
import { colorMapping } from "../../constant";
import { useAuthStore } from "../../store";
import { useEffect } from "react";
import socket from "../../lib/socket";

const columns = [
  {
    title: "Order ID",
    dataIndex: "_id",
    key: "_id",
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record._id}</Typography.Text>;
    },
  },
  {
    title: "Customer",
    dataIndex: "customerId",
    key: "customerId._id",
    render: (_text: string, record: Order) => {
      if (!record.customerId) return "";
      return (
        <Typography.Text>
          {record.customerId.firstName + " " + record.customerId.lastName}
        </Typography.Text>
      );
    },
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record.address}</Typography.Text>;
    },
  },
  {
    title: "Comment",
    dataIndex: "comment",
    key: "comment",
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record?.comment}</Typography.Text>;
    },
  },
  {
    title: "Payment Mode",
    dataIndex: "paymentMode",
    key: "paymentMode",
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record.paymentMode}</Typography.Text>;
    },
  },
  {
    title: "Status",
    dataIndex: "orderStatus",
    key: "orderStatus",
    render: (_: boolean, record: Order) => {
      return (
        <Tag bordered={false} color={colorMapping[record.orderStatus]}>
          {capitalizeFirst(record.orderStatus)}
        </Tag>
      );
    },
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (text: string) => {
      return <Typography.Text>₹{text}</Typography.Text>;
    },
  },
  {
    title: "CreatedAt",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      return (
        <Typography.Text>
          {format(new Date(text), "dd/MM/yyyy HH:mm")}
        </Typography.Text>
      );
    },
  },
  {
    title: "Actions",
    render: (_: string, record: Order) => {
      return <Link to={`/orders/${record._id}`}>Details</Link>;
    },
  },
];
const Orders = () => {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTenant = searchParams.get("tenantId")
    ? Number(searchParams.get("tenantId"))
    : undefined;

  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const pageSize = searchParams.get("perPage")
    ? Number(searchParams.get("perPage"))
    : 10;

  const { data: tenantData } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      return await getTenants().then((res) => res.data.data);
    },
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", selectedTenant, currentPage, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(selectedTenant ? { tenantId: String(selectedTenant) } : {}),
        currentPage: String(currentPage),
        perPage: String(pageSize),
      }).toString();
      return await getOrders(params).then((res) => res.data);
    },
  });

  //socket
  useEffect(() => {
    if (user?.tenant?.id) {
      socket.on("order-update", (data) => {
        console.log("order", data);
      });
      socket.emit("join", {
        tenantId: user?.tenant.id,
      });
      socket.on("join", (data) => {
        console.log("joined", data);
      });
    }

    return () => {
      socket.off("join");
      socket.off("order-update");
    };
  }, [user]);

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Orders" },
            ]}
          />
        </Flex>

        {user?.role === "admin" && (
          <Col span={6}>
            <Select
              id="tenant"
              style={{ width: "100%" }}
              allowClear
              placeholder="Select Tenant"
              value={selectedTenant}
              onChange={(value) => {
                const newParams = new URLSearchParams(searchParams.toString());
                if (value) newParams.set("tenantId", String(value));
                else newParams.delete("tenantId");
                newParams.set("page", "1"); // Reset to first page on tenant change
                setSearchParams(newParams);
              }}
            >
              {tenantData?.map((item: Tenant) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
        )}

        <Table
          loading={isLoading}
          columns={columns}
          rowKey={"_id"}
          dataSource={orders?.data}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: orders?.total || 0,
          }}
          onChange={(pag) => {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set("page", String(pag.current));
            newParams.set("perPage", String(pag.pageSize));
            setSearchParams(newParams);
          }}
        />
      </Space>
    </>
  );
};

export default Orders;
