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
import { useEffect, useMemo, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  // useQueryClient,
} from "@tanstack/react-query";
import { createProduct, getProducts } from "../../http/api";
import { debounce } from "lodash";
import { FieldData, IProduct } from "../../types";
import { Typography } from "antd";
import { format } from "date-fns";
import { useAuthStore } from "../../store";
import ProductForm from "./component/ProductForm";
import { makeFormData } from "./helpers";
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
  const queryClient = useQueryClient();
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

  const { mutate: createProductMutation, isPending: isCreateLoading } =
    useMutation({
      mutationKey: ["createProduct"],
      mutationFn: async (data: IProduct) =>
        createProduct(data).then((res) => res.data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
    });
  useEffect(() => {
    if (currentEditingProduct) {
      setAddProductDrawerOpen(true);
    }
    if (currentEditingProduct) {
      const priceConfiguration = Object.entries(
        currentEditingProduct.priceConfiguration
      ).reduce((acc, [key, value]) => {
        const stringifiedField = JSON.stringify({
          configurationKey: key,
          priceType: value.priceType,
        });
        return {
          ...acc,
          [stringifiedField]: value.availableOptions,
        };
      }, {});
      const attributes = currentEditingProduct.attributes.reduce(
        (acc, item) => {
          return { ...acc, [item.name]: item.value };
        },
        {}
      );
      console.log(priceConfiguration, attributes);
      form.setFieldsValue({
        ...currentEditingProduct,
        priceConfiguration,
        attributes,
        categoryId: currentEditingProduct.category._id,
      });
      setAddProductDrawerOpen(true);
    }
  }, [currentEditingProduct, form]);

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
    const isEditMode = !!currentEditingProduct;
    await form.validateFields();

    const priceConfiguration = form.getFieldValue("priceConfiguration");
    const pricing = Object.entries(priceConfiguration).reduce(
      (acc, [key, value]) => {
        const parsedKey = JSON.parse(key);
        return {
          ...acc,
          [parsedKey.configurationKey]: {
            priceType: parsedKey.priceType,
            availableOptions: value,
          },
        };
      },
      {}
    );
    const attributes = Object.entries(form.getFieldValue("attributes")).map(
      ([key, value]) => {
        return {
          name: key,
          value,
        };
      }
    );
    const productData = {
      ...form.getFieldsValue(),
      tenantId:
        user!.role === "manager"
          ? user?.tenant?.id
          : form.getFieldValue("tenantId"),
      image: form.getFieldValue("image"),
      isPublish: form.getFieldValue("isPublish") ? true : false,
      priceConfiguration: pricing,
      attributes,
    };
    const formData = makeFormData(productData);
    if (isEditMode && formData) {
      // await updateUserMutation(form.getFieldsValue());
    } else {
      await createProductMutation(formData as unknown as IProduct);
    }

    setAddProductDrawerOpen(false);
    form.resetFields();
    setCurrentEditingProduct(null);
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
              render: (_text, record: IProduct) => {
                return (
                  <Space>
                    <Button
                      onClick={() => {
                        setCurrentEditingProduct(record);
                      }}
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
            form.resetFields();
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setAddProductDrawerOpen(false);
                  setCurrentEditingProduct(null);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                type="primary"
                loading={isCreateLoading}
              >
                Submit
              </Button>
            </Space>
          }
        >
          <Form autoComplete="off" layout="vertical" form={form}>
            <ProductForm form={form} />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Product;
