export interface User {
  user_no: string;
  user_name: string;
  role_no: string;
  login_username: string;
  login_password: string;
  gender: 'm' | 'f';
  salary: number;
}

export interface PendingUser {
  id: string;
  user_name: string;
  user_no: string;
  role_no: string;
  login_username: string;
  login_password: string;
  gender: 'm' | 'f';
  salary: number;
  apply_date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Role {
  role_no: string;
  role_name: string;
}

export interface SysMenu {
  menu_no: string;
  menu_name: string;
}

export interface RoleMenuMap {
  role_no: string;
  menu_nos: string[];
}

export const mockRoles: Role[] = [
  { role_no: 'R001', role_name: '管理岗' },
  { role_no: 'R002', role_name: '柜员岗' },
];

export const mockMenus: SysMenu[] = [
  { menu_no: 'M01', menu_name: '查看自我档案' },
  { menu_no: 'M02', menu_name: '修改自我密码' },
  { menu_no: 'M03', menu_name: '新建员工档案' },
  { menu_no: 'M04', menu_name: '查看员工档案' },
  { menu_no: 'M05', menu_name: '修改员工档案' },
  { menu_no: 'M06', menu_name: '修改管理员密码' },
  { menu_no: 'M07', menu_name: '岗位权限配置' },
  { menu_no: 'M08', menu_name: '注册审核' },
];

export const mockRoleMenuMaps: RoleMenuMap[] = [
  { role_no: 'R001', menu_nos: ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08'] },
  { role_no: 'R002', menu_nos: ['M01', 'M02'] },
];

export const mockUsers: User[] = [
  { user_no: '0000000000', user_name: '管理员', role_no: 'R001', login_username: '管理员', login_password: '123456', gender: 'm', salary: 10000 },
  { user_no: '0000000001', user_name: '胡小广', role_no: 'R001', login_username: '胡小广', login_password: '123456', gender: 'm', salary: 9500 },
  { user_no: '0000000002', user_name: '田小豪', role_no: 'R001', login_username: '田小豪', login_password: '123456', gender: 'm', salary: 9000 },
  { user_no: '2024000001', user_name: '张三', role_no: 'R002', login_username: '张三', login_password: '123456', gender: 'm', salary: 5000 },
  { user_no: '2024000002', user_name: '李四', role_no: 'R002', login_username: '李四', login_password: '123456', gender: 'f', salary: 5500 },
  { user_no: '0000000003', user_name: '王小乾', role_no: 'R002', login_username: '王小乾', login_password: '123456', gender: 'm', salary: 5200 },
  { user_no: '0000000004', user_name: '魏小涛', role_no: 'R002', login_username: '魏小涛', login_password: '123456', gender: 'm', salary: 5300 },
  { user_no: '0000000005', user_name: '张小坤', role_no: 'R002', login_username: '张小坤', login_password: '123456', gender: 'm', salary: 5100 },
];

export const mockPendingUsers: PendingUser[] = [
  {
    id: 'p1',
    user_name: '陈小文',
    user_no: '2024000006',
    role_no: 'R002',
    login_username: '陈小文',
    login_password: '123456',
    gender: 'f',
    salary: 5000,
    apply_date: '2024-06-12',
    status: 'pending',
  },
  {
    id: 'p2',
    user_name: '刘小华',
    user_no: '2024000007',
    role_no: 'R002',
    login_username: '刘小华',
    login_password: '123456',
    gender: 'm',
    salary: 5200,
    apply_date: '2024-06-10',
    status: 'pending',
  },
];
