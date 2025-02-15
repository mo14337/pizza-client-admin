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
import { createUsers, getUsers, updateUser } from "../../http/api";
import { CreateUser, User } from "../../store";
import UserFilter from "./components/UserFilter";
import { useEffect, useMemo, useState } from "react";
import UserForm from "./components/UserForm";
import { currentPage, perPage } from "../../constant";
import { FieldData } from "../../types";
import { debounce } from "lodash";

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
  {
    title: "Tenant",
    dataIndex: "tenant",
    key: "tenant",
    render: (_text: string, record: User) => {
      return <div>{record?.tenant?.name}</div>;
    },
  },
];

const Users = () => {
  const [currentEditingUser, setCurrentEditingUser] = useState<User | null>(
    null
  );
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const queryClient = useQueryClient();
  const [queryParams, setQueryParams] = useState({
    perPage: perPage,
    currentPage: currentPage,
  });

  const [addUserDrawerOpen, setAddUserDrawerOpen] = useState(false);
  const {
    data: usersData,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: async () => {
      const filtredParams = Object.entries(queryParams).filter(
        (item) => !!item[1]
      );
      const queryString = new URLSearchParams(
        filtredParams as unknown as Record<string, string>
      ).toString();
      return await getUsers(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const { mutate: createUserMutation } = useMutation({
    mutationKey: ["createUser"],
    mutationFn: async (data: CreateUser) =>
      createUsers(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const { mutate: updateUserMutation } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: async (data: CreateUser) =>
      updateUser(data, currentEditingUser!.id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  useEffect(() => {
    if (currentEditingUser) {
      setAddUserDrawerOpen(true);
      form.setFieldsValue({
        ...currentEditingUser,
        tenantId: currentEditingUser.tenant?.id,
      });
    }
  }, [currentEditingUser, form]);

  async function handleSubmit() {
    const isEditMode = !!currentEditingUser;
    await form.validateFields();

    if (isEditMode) {
      await updateUserMutation(form.getFieldsValue());
    } else {
      await createUserMutation(form.getFieldsValue());
    }

    setAddUserDrawerOpen(false);
    form.resetFields();
    setCurrentEditingUser(null);
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
              { title: "Tenants" },
            ]}
          />
          {isFetching && <Spin indicator={<LoadingOutlined />} />}
          {isError && <div>{error.message}</div>}
        </Flex>
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <UserFilter>
            <Button
              onClick={() => setAddUserDrawerOpen(true)}
              icon={<PlusOutlined />}
              type="primary"
            >
              Add User
            </Button>
          </UserFilter>
        </Form>

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
          columns={[
            ...columns,
            {
              title: "Actions",
              render: (_: string, record: User) => {
                return (
                  <Space>
                    <Button
                      onClick={() => setCurrentEditingUser(record)}
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
          dataSource={usersData?.data}
        />
        <Drawer
          styles={{
            body: {
              background: colorBgLayout,
            },
          }}
          open={addUserDrawerOpen}
          title={currentEditingUser ? "Edit User" : "Create user"}
          width={720}
          destroyOnClose={true}
          onClose={() => {
            setAddUserDrawerOpen(false);
            setCurrentEditingUser(null);
            form.resetFields();
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setAddUserDrawerOpen(false);
                  setCurrentEditingUser(null);
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
          <Form autoComplete="off" layout="vertical" form={form}>
            <UserForm isEditMode={!!currentEditingUser} />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Users;
