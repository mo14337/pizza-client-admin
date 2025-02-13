import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUsers, getUsers } from "../../http/api";
import { CreateUser, User } from "../../store";
import UserFilter from "./components/UserFilter";
import { useState } from "react";
import UserForm from "./components/UserForm";
import { currentPage, perPage } from "../../constant";

const columns = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text: string, record: User) => {
      return (
        <Link to="/users">
          {record.firstName} {record.lastName}
        </Link>
      );
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
];

const Users = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [queryParams, setQueryParams] = useState({
    perPage: perPage,
    currentPage: currentPage,
  });

  const [addUserDrawerOpen, setAddUserDrawerOpen] = useState(false);
  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: async () => {
      const queryString = new URLSearchParams(
        queryParams as unknown as Record<string, string>
      ).toString();
      return await getUsers(queryString).then((res) => res.data);
    },
  });

  const { mutate: createUserMutation } = useMutation({
    mutationKey: ["user"],
    mutationFn: async (data: CreateUser) =>
      createUsers(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  async function handleSubmit() {
    await form.validateFields();
    createUserMutation(form.getFieldsValue());
    await refetch();
    form.resetFields();
    setAddUserDrawerOpen(false);
  }

  return (
    <>
      <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Users" }]}
        />
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}
        <UserFilter
          onFilterChange={(filterName: string, value: string) => {
            console.log(filterName, value);
          }}
        >
          <Button
            onClick={() => setAddUserDrawerOpen(true)}
            icon={<PlusOutlined />}
            type="primary"
          >
            Add User
          </Button>
        </UserFilter>

        <Table
          pagination={{
            total: usersData?.total,
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
          dataSource={usersData?.data}
        />
        <Drawer
          styles={{
            body: {
              background: colorBgLayout,
            },
          }}
          open={addUserDrawerOpen}
          title="Create user"
          width={720}
          destroyOnClose={true}
          onClose={() => {
            setAddUserDrawerOpen(false);
            form.resetFields();
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setAddUserDrawerOpen(false);
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
            <UserForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Users;
