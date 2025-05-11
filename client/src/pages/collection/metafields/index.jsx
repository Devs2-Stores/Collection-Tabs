import { useEffect } from "react";
import { collectionService } from "../../../services/CollectionService";
import TinyEditor from "../../../components/Editor";
import { useSearchParams } from "react-router";

const CollectionMetafields = () => {
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const id = searchParams.get("id");
    console.log(id);
    collectionService.fetchCollection();
  }, []);
  return (
    <div className="collection-metafields-template space-y-4">
      <div className="collection-metafields-template-heading flex justify-between items-center">
        <h2 className="text-2xl inline-block">Collection Data</h2>
        <div className="collection-metafields-template-heading-action flex items-center gap-8">
          <a href="/" target="_blank">Trang quản trị</a>
          <a href="/" target="_blank">Xem ngoài web</a>
        </div>
      </div>


      <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <li class="me-2">
          <a href="#" aria-current="page" class="inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active">Profile</a>
        </li>
        <li class="me-2">
          <a href="#" class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ">Dashboard</a>
        </li>
        <li class="me-2">
          <a href="#" class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Settings</a>
        </li>
      </ul>

      <div className="collection-metafields-template-editor">
        <form className="form">
          <div className="form-group">
            <label htmlFor="namespace">Trạng thái kích hoạt</label>
            <input className="form-control" type="checkbox" id="namespace" name="namespace" placeholder="Namespace" />
          </div>
          <div className="form-group">
            <label htmlFor="namespace">Tiêu đề</label>
            <input className="form-control" type="text" id="namespace" name="namespace" placeholder="Namespace" />
          </div>
          <div className="form-group">
            <label htmlFor="key">Mô tả</label>
            <TinyEditor />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectionMetafields;
