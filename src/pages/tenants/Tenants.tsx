import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getTenants } from "../../http/api";
import { ITenant } from "../../store";
import { useState } from "react";
import RestaurantFilter from "./components/TenantFilter";
import { Tenant } from "../../types";
import TenantForm from "./components/TenantForm";
import { currentPage, perPage } from "../../constant";

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
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [restaurantDrawerOpen, setAddRestaurantDrawerOpen] = useState(false);
  const [queryParams, setQueryParams] = useState({
    perPage: perPage,
    currentPage: currentPage,
  });
  const {
    data: tenantData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: async () => {
      const queryString = new URLSearchParams(
        queryParams as unknown as Record<string, string>
      ).toString();
      return await getTenants(queryString).then((res) => res.data);
    },
  });

  const { mutate: createUserMutation } = useMutation({
    mutationKey: ["tenant"],
    mutationFn: async (data: Tenant) =>
      createTenant(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  async function handleSubmit() {
    await form.validateFields();
    createUserMutation(form.getFieldsValue());
    form.resetFields();
    setAddRestaurantDrawerOpen(false);
  }
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
            onClick={() => {
              setAddRestaurantDrawerOpen(true);
              form.resetFields();
            }}
            icon={<PlusOutlined />}
            type="primary"
          >
            Add Tenant
          </Button>
        </RestaurantFilter>

        <Table
          pagination={{
            total: tenantData?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
              setQueryParams((prev) => ({
                ...prev,
                currentPage: page,
              }));
            },
          }}
          columns={columns}
          rowKey={"id"}
          dataSource={tenantData?.data}
        />
        <Drawer
          styles={{
            body: {
              background: colorBgLayout,
            },
          }}
          open={restaurantDrawerOpen}
          title="Create Tenant"
          width={720}
          destroyOnClose={true}
          onClose={() => setAddRestaurantDrawerOpen(false)}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setAddRestaurantDrawerOpen(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} type="primary">
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <TenantForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Tenants;
