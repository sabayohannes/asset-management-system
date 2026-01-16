// assets
import { LoginOutlined, ProfileOutlined, FileAddOutlined, FileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
    FileAddOutlined,
 FileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
    id: 'group-dashboard',
    title: 'Navigation',
  type: 'group',
  children: [
      {
          id: 'asset-requests',
          title: 'Asset Requests',
          type: 'item',
          url: 'assets/requests',
          icon: icons.FileAddOutlined
      },
    
      {
          id: 'asset-report',
          title: 'Asset Report',
          type: 'item',
          url: 'assets/reports',
          icon: icons.FileAddOutlined
      },
  ]
};

export default pages;
