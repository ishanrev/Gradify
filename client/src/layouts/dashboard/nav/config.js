// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: icon('ic_analytics'),
  // },
  // {
  //   title: 'user',
  //   path: '/dashboard/user',
  //   icon: icon('ic_user'),
  // },
  {
    title: 'browse',
    path: '/dashboard/browse',
    icon: icon('ic_cart'),
  },
  {
    title: 'My Connections',
    path: '/connection/home',
    icon: icon('ic_user'),
  },
  {
    title: 'logout',
    path: '/login',
    icon: icon('ic_lock'),
  },
  
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
