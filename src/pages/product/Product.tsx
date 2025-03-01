import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  theme,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProductFilters from "./component/ProductFilters";
// import { IProduct } from "../../types";
import { currentPage, perPage } from "../../constant";
import { useMemo, useState } from "react";
import {
  keepPreviousData,
  useQuery,
  // useQueryClient,
} from "@tanstack/react-query";
import { getProducts } from "../../http/api";
import { debounce } from "lodash";
import { FieldData, IProduct } from "../../types";
import { Typography } from "antd";
import { format } from "date-fns";
import { useAuthStore } from "../../store";
import ProductForm from "./component/ProductForm";
const { Text } = Typography;

const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    render: (_text: string, record: IProduct) => {
      return (
        <Space>
          <Image src={record.image} width={50} height={50} preview={false} />
          <Link to={`/products/${record._id}`}>{record.name}</Link>
        </Space>
      );
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    dataIndex: "isPublish",
    key: "isPublish",
    render: (_text: boolean, record: IProduct) => {
      return (
        <>
          {record.isPublish ? (
            <Tag color="green">Published</Tag>
          ) : (
            <Tag color="purple">Unpublished</Tag>
          )}
        </>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      return (
        <>
          <Text>{format(new Date(text), "dd/MM/yyyy HH:mm")}</Text>
        </>
      );
    },
  },
];

const Product = () => {
  const [filterForm] = Form.useForm();
  const { user } = useAuthStore();
  const [form] = Form.useForm();
  const [addProductDrawerOpen, setAddProductDrawerOpen] = useState(false);
  const [currentEditingProduct, setCurrentEditingProduct] =
    useState<IProduct | null>(null);
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  // const queryClient = useQueryClient();
  const [queryParams, setQueryParams] = useState({
    perPage: perPage,
    currentPage: currentPage,
    tenantId: user!.role === "manager" ? user?.tenant?.id : undefined,
  });

  const {
    data: productsData,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: async () => {
      const filtredParams = Object.entries(queryParams).filter(
        (item) => !!item[1]
      );
      const queryString = new URLSearchParams(
        filtredParams as unknown as Record<string, string>
      ).toString();
      return await getProducts(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

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
  async function handleSubmit() {
    // const isEditMode = !!currentEditingProduct;
    await form.validateFields();
    // console.log(form.getFieldValue())

    // if (isEditMode) {
    //   await updateUserMutation(form.getFieldsValue());
    // } else {
    //   await createUserMutation(form.getFieldsValue());
    // }

    // setAddUserDrawerOpen(false);
    // form.resetFields();
    // setCurrentEditingUser(null);
  }
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
          {isFetching && <Spin indicator={<LoadingOutlined />} />}
          {isError && <div>{error.message}</div>}
        </Flex>
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <ProductFilters>
            <Button
              onClick={() => setAddProductDrawerOpen(true)}
              icon={<PlusOutlined />}
              type="primary"
            >
              Add Product
            </Button>
          </ProductFilters>
        </Form>
        <Table
          pagination={{
            total: productsData?.total,
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
              render: () => {
                return (
                  <Space>
                    <Button onClick={() => {}} type="link">
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          rowKey={"id"}
          dataSource={productsData?.data}
        />
        <Drawer
          styles={{
            body: {
              background: colorBgLayout,
            },
          }}
          open={addProductDrawerOpen}
          title={currentEditingProduct ? "Edit Product" : "Create Product"}
          width={720}
          destroyOnClose={true}
          onClose={() => {
            setAddProductDrawerOpen(false);
            setCurrentEditingProduct(null);
            // form.resetFields();
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setAddProductDrawerOpen(false);
                  setCurrentEditingProduct(null);
                  // form.resetFields();
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
            <ProductForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Product;
