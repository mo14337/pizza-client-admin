import { Card, Col, Input, Row } from "antd";
import { ReactNode } from "react";
type UserFilterProps = {
  onFilterChange: (filterName: string, filterValue: string) => void;
  children: ReactNode;
};

const TenantFilter = ({ onFilterChange, children }: UserFilterProps) => {
  return (
    <>
      <Card>
        <Row justify={"space-between"}>
          <Col span={16}>
            <Row gutter={20}>
              <Col span={8}>
                <Input.Search
                  placeholder="Search"
                  allowClear
                  onChange={(e) =>
                    onFilterChange("userSearchQuery", e.target.value)
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
            {children}
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default TenantFilter;
