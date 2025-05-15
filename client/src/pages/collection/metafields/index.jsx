import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { metafieldsService } from "../../../services/MetafieldsService";
import Spinner from "../../../components/Spinner";

import { Space, Flex, Typography, Button, Tabs } from 'antd';
import CollectionMetafieldsForm from "./form";
 
const CollectionMetafields = () => {

  const MAX_TABS = 10;
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { isLoading: field_loading, data: field_data } = metafieldsService.useGetMetafields({type: "collection", id: id });
  const [tabItems, setTabItems] = useState([]);

  useEffect(() => {
    // Tạo map để tra cứu nhanh metafield theo key
    const metafieldMap = {};
    field_data?.metafields?.forEach((mf) => {
      try {
        const key = JSON.parse(mf.value)?.key;
        if (key) metafieldMap[key] = mf;
      } catch { }
    });

    const tabs = Array.from({ length: MAX_TABS }, (_, i) => {
      const key = `tabs${i + 1}`;
      const field = metafieldMap[key] || {};
      const title = field.value ? JSON.parse(field.value).title : `Tab ${i + 1}`;
      return {
        key: field.id || `new_${i + 1}`,
        label: title,
        children: (
          <CollectionMetafieldsForm field={field} objectID={id} tabIndex={key} />
        ),
      };
    });
    setTabItems(tabs);
  }, [field_data, id]);

  if (field_loading) return <Spinner />;

  return (
    <Space className="flex!" direction="vertical" size="large">
      <Flex gap="large" justify="space-between" align="center">
        <Typography.Title level={3} className="text-2xl mb-0!">Nhóm sản phẩm - Collection Tabs</Typography.Title>
        <Flex gap="small">
          <Button htmlType="button" type="link">Trang quản trị</Button>
        </Flex>
      </Flex>
      <Tabs size="small" items={tabItems} type="line"></Tabs>
    </Space>
  );
};

export default CollectionMetafields;