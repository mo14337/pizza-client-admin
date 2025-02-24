import { Breadcrumb, Button, Flex, Form, Space } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProductFilters from "./component/ProductFilters";

const Product = () => {
  const [filterForm] = Form.useForm();
  return (
    <>
      <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Products" },
            ]}
          />
        </Flex>
        <Form form={filterForm} onFieldsChange={() => {}}>
          <ProductFilters>
            <Button
              // onClick={() => setAddUserDrawerOpen(true)}
              icon={<PlusOutlined />}
              type="primary"
            >
              Add Product
            </Button>
          </ProductFilters>
        </Form>
      </Space>
    </>
  );
};

export default Product;
