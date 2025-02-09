import { Breadcrumb, Table } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import { User } from "../../store";

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
      <Breadcrumb
        separator={<RightOutlined />}
        items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Users" }]}
      />
      {isLoading && <div>Loading...</div>}
      {isError && <div>{error.message}</div>}
      <Table
        style={{ marginTop: "24px" }}
        columns={columns}
        dataSource={usersData}
      />
    </>
  );
};

export default Users;
