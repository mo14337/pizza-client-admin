import { Breadcrumb, Button, Drawer, Space, Table } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../http/api";
import { ITenant } from "../../store";
import { useState } from "react";
import RestaurantFilter from "./components/TenantFilter";

const columns = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (_text: string, record: ITenant) => {
      return <Link to="/tenants">{record.name}</Link>;
    },
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

const Tenants = () => {
  const [restaurantDrawerOpen, setAddRestaurantDrawerOpen] = useState(false);
  const {
    data: tenantData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      return await getTenants().then((res) => res.data);
    },
  });

  return (
    <>
      <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: "Tenants" },
          ]}
        />
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}
        <RestaurantFilter
          onFilterChange={(filterName: string, value: string) => {
            console.log(filterName, value);
          }}
        >
          <Button
            onClick={() => setAddRestaurantDrawerOpen(true)}
            icon={<PlusOutlined />}
            type="primary"
          >
            Add Tenant
          </Button>
        </RestaurantFilter>

        <Table columns={columns} rowKey={"id"} dataSource={tenantData} />
        <Drawer
          open={restaurantDrawerOpen}
          title="Create Tenant"
          width={720}
          destroyOnClose={true}
          onClose={() => setAddRestaurantDrawerOpen(false)}
          extra={
            <Space>
              <Button>Cancel</Button>
              <Button type="primary">Submit</Button>
            </Space>
          }
        ></Drawer>
      </Space>
    </>
  );
};

export default Tenants;
