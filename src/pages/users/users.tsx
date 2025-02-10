import { Breadcrumb, Button, Drawer, Space, Table } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import { User } from "../../store";
import UserFilter from "./components/UserFilter";
import { useState } from "react";

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
  const [addUserDrawerOpen, setAddUserDrawerOpen] = useState(false);
  const {
    data: usersData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await getUsers().then((res) => res.data);
    },
  });

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

        <Table columns={columns} rowKey={"id"} dataSource={usersData} />
        <Drawer
          open={addUserDrawerOpen}
          title="Create user"
          width={720}
          destroyOnClose={true}
          onClose={() => setAddUserDrawerOpen(false)}
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

export default Users;
