import { useSearchParams } from "react-router";
import { metafieldsService } from "../../../services/MetafieldsService";
import Spinner from "../../../components/Spinner";

import { Space, Flex, Typography, Button, Tabs } from 'antd';
import CollectionMetafieldsForm from "./form";
import { use, useEffect } from "react";
const CollectionMetafields = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { isLoading: field_loading, data: field_data } = metafieldsService.useGetMetafields({
    type: "collection",
    id: id,
  });
  if (field_loading) return <Spinner />;
  const tabItems = field_data?.metafields.map((field) => {
    const title = JSON.parse(field.value).title;
    return ({
      closable: false,
      key: field.id,
      label: title,
      children: <CollectionMetafieldsForm field={field} objectID={id} />,
    })
  });
  const handleOnClick = (key) => {
    const selectedTab = field_data?.metafields.find((field) => field.id === key);
    if (selectedTab) {
      // Handle the click event for the selected tab
      console.log("Selected tab:", selectedTab);
    }
  };
  return (
    <Space className="flex!" direction="vertical" size="large">
      <Flex gap="large" justify="space-between" align="center">
        <Typography.Title level={3} className="text-2xl">Nhóm sản phẩm</Typography.Title>
        <Flex gap="small">
          <Button htmlType="button" type="link">Trang quản trị</Button>
          <Button htmlType="button" type="link">Xem ngoài web</Button>
        </Flex>
      </Flex>
      <Tabs items={tabItems} onTabClick={handleOnClick} type="editable-card"></Tabs>
    </Space>
  );
};

export default CollectionMetafields; 
