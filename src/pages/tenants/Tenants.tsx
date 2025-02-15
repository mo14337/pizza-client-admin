import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  theme,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createTenant, getTenants, updateTenant } from "../../http/api";
import { ITenant } from "../../store";
import { useEffect, useMemo, useState } from "react";
import RestaurantFilter from "./components/TenantFilter";
import { FieldData, Tenant } from "../../types";
import TenantForm from "./components/TenantForm";
import { currentPage, perPage } from "../../constant";
import { debounce } from "lodash";

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
  const [currentEditingTenant, setCurrentEditingTenant] =
    useState<Tenant | null>(null);
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [restaurantDrawerOpen, setAddRestaurantDrawerOpen] = useState(false);
  const [queryParams, setQueryParams] = useState({
    perPage: perPage,
    currentPage: currentPage,
  });
  const {
    data: tenantData,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: async () => {
      const filtredParams = Object.entries(queryParams).filter(
        (item) => !!item[1]
      );
      const queryString = new URLSearchParams(
        filtredParams as unknown as Record<string, string>
      ).toString();
      return await getTenants(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const { mutate: createTenantMutation } = useMutation({
    mutationKey: ["createTenant"],
    mutationFn: async (data: Tenant) =>
      createTenant(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });

  const { mutate: updateTenantMutation } = useMutation({
    mutationKey: ["createTenant"],
    mutationFn: async (data: Tenant) =>
      updateTenant(data, currentEditingTenant!.id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });

  useEffect(() => {
    if (currentEditingTenant) {
      form.setFieldsValue(currentEditingTenant);
      setAddRestaurantDrawerOpen(true);
    }
  }, [currentEditingTenant, form]);

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  async function handleSubmit() {
    const isEditMode = !!currentEditingTenant;
    await form.validateFields();

    if (isEditMode) {
      await updateTenantMutation(form.getFieldsValue());
    } else {
      await createTenantMutation(form.getFieldsValue());
    }

    setAddRestaurantDrawerOpen(false);
    form.resetFields();
    setCurrentEditingTenant(null);
  }

  const deBounceQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);
  const onFilterChange = (changeField: FieldData[]) => {
    const changeFilterFields = changeField
      .map((item) => {
        return {
          [item.name[0]]: item.value,
        };
      })
      .reduce((acc, item) => ({ ...acc, ...item }));
    if ("q" in changeFilterFields) {
      deBounceQUpdate(changeFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changeFilterFields,
        currentPage: 1,
      }));
    }
  };
  return (
    <>
      <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Users" },
            ]}
          />
          {isFetching && <Spin indicator={<LoadingOutlined />} />}
          {isError && <div>{error.message}</div>}
        </Flex>
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <RestaurantFilter>
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
        </Form>
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
          columns={[
            ...columns,
            {
              title: "Actions",
              render: (_: string, record: Tenant) => {
                return (
                  <Space>
                    <Button
                      onClick={() => setCurrentEditingTenant(record)}
                      type="link"
                    >
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
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
          title={currentEditingTenant ? "Edit Tenant" : "Create Tenant"}
          width={720}
          destroyOnClose={true}
          onClose={() => {
            setAddRestaurantDrawerOpen(false);
            setCurrentEditingTenant(null);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setAddRestaurantDrawerOpen(false);
                  setCurrentEditingTenant(null);
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
