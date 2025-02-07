import {
  Card,
  Form,
  Layout,
  Space,
  Input,
  Checkbox,
  Button,
  Flex,
  Alert,
} from "antd";
import React from "react";
import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "../../components/Logo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ICredentials } from "../../types";
import { login, self } from "../../http/api";

const getSelf = async () => {
  const { data } = await self();
  return data;
};

const loginUser = async (userData: ICredentials) => {
  //server call logic
  const { data } = await login(userData);
  return data;
};

const Login: React.FC = () => {
  const { data: selfData, refetch } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    enabled: false,
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      // call self api
      refetch();
      console.log(selfData);
    },
  });

  return (
    <>
      <Layout
        style={{ height: "100vh", display: "grid", placeItems: "center" }}
      >
        <Space direction="vertical" align="center" size="large">
          <Layout.Content>
            <Logo />
          </Layout.Content>
          <Card
            bordered={false}
            style={{
              width: 300,
            }}
            title={
              <Space
                style={{
                  width: "100%",
                  fontSize: "16px",
                  justifyContent: "center",
                }}
              >
                <LockFilled /> Sign in
              </Space>
            }
          >
            <Form
              onFinish={(values) => {
                mutate({
                  email: values.username,
                  password: values.password,
                  remember: values.remember,
                });
                // console.log(values);
              }}
              initialValues={{ remember: true }}
            >
              {isError && (
                <Alert
                  style={{ marginBottom: "10px" }}
                  type="error"
                  message={error.message}
                />
              )}
              <Form.Item
                name={"username"}
                rules={[
                  {
                    required: true,
                    message: "Username is required!",
                  },
                  {
                    type: "email",
                    message: "Enter a valid email.",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="username"
                  type="text"
                />
              </Form.Item>
              <Form.Item
                name={"password"}
                rules={[
                  {
                    required: true,
                    message: "Password is required",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="password"
                />
              </Form.Item>
              <Flex justify="space-between">
                <Form.Item name={"remember"} valuePropName="checked">
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a id="forgot-password-link" href="">
                  Forgot password
                </a>
              </Flex>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={isPending}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Layout>
    </>
  );
};

export default Login;
