import { User, Role, SysMenu, RoleMenuMap, PendingUser, mockUsers, mockRoles, mockMenus, mockRoleMenuMaps, mockPendingUsers } from '../data/mockData';

const USERS_KEY = 'bank_users';
const ROLES_KEY = 'bank_roles';
const MENUS_KEY = 'bank_menus';
const ROLE_MENU_MAPS_KEY = 'bank_role_menu_maps';
const CURRENT_USER_KEY = 'bank_current_user';
const PENDING_USERS_KEY = 'bank_pending_users';

export const initData = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(ROLES_KEY)) {
    localStorage.setItem(ROLES_KEY, JSON.stringify(mockRoles));
  }
  if (!localStorage.getItem(MENUS_KEY)) {
    localStorage.setItem(MENUS_KEY, JSON.stringify(mockMenus));
  }
  if (!localStorage.getItem(ROLE_MENU_MAPS_KEY)) {
    localStorage.setItem(ROLE_MENU_MAPS_KEY, JSON.stringify(mockRoleMenuMaps));
  }
  if (!localStorage.getItem(PENDING_USERS_KEY)) {
    localStorage.setItem(PENDING_USERS_KEY, JSON.stringify(mockPendingUsers));
  }
};

export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : mockUsers;
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const addUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};

export const getRoles = (): Role[] => {
  const data = localStorage.getItem(ROLES_KEY);
  return data ? JSON.parse(data) : mockRoles;
};

export const getMenus = (): SysMenu[] => {
  const data = localStorage.getItem(MENUS_KEY);
  return data ? JSON.parse(data) : mockMenus;
};

export const getRoleMenuMaps = (): RoleMenuMap[] => {
  const data = localStorage.getItem(ROLE_MENU_MAPS_KEY);
  return data ? JSON.parse(data) : mockRoleMenuMaps;
};

export const saveRoleMenuMaps = (maps: RoleMenuMap[]) => {
  localStorage.setItem(ROLE_MENU_MAPS_KEY, JSON.stringify(maps));
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const findUserByNo = (user_no: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.user_no === user_no);
};

export const findUserByUsername = (username: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.login_username === username);
};

export const getRoleNameByNo = (role_no: string): string => {
  const roles = getRoles();
  const role = roles.find(r => r.role_no === role_no);
  return role ? role.role_name : '';
};

export const getMenusByRoleNo = (role_no: string): SysMenu[] => {
  const menus = getMenus();
  const maps = getRoleMenuMaps();
  const map = maps.find(m => m.role_no === role_no);
  if (!map) return [];
  return menus.filter(m => map.menu_nos.includes(m.menu_no));
};

export const validateUserNo = (user_no: string): boolean => {
  return user_no.length === 10 && /^\d+$/.test(user_no);
};

export const validatePassword = (password: string): boolean => {
  return password.length === 6 && /^\d+$/.test(password);
};

// 待审核用户相关功能
export const getPendingUsers = (): PendingUser[] => {
  const data = localStorage.getItem(PENDING_USERS_KEY);
  return data ? JSON.parse(data) : mockPendingUsers;
};

export const savePendingUsers = (users: PendingUser[]) => {
  localStorage.setItem(PENDING_USERS_KEY, JSON.stringify(users));
};

export const addPendingUser = (user: Omit<PendingUser, 'id' | 'apply_date' | 'status'>) => {
  const pendingUsers = getPendingUsers();
  const newUser: PendingUser = {
    ...user,
    id: `p${Date.now()}`,
    apply_date: new Date().toISOString().split('T')[0],
    status: 'pending',
  };
  pendingUsers.push(newUser);
  savePendingUsers(pendingUsers);
};

export const approvePendingUser = (id: string): boolean => {
  const pendingUsers = getPendingUsers();
  const index = pendingUsers.findIndex(u => u.id === id);
  if (index === -1) return false;

  const pendingUser = pendingUsers[index];
  if (pendingUser.status !== 'pending') return false;

  // 移到正式用户
  addUser({
    user_no: pendingUser.user_no,
    user_name: pendingUser.user_name,
    role_no: pendingUser.role_no,
    login_username: pendingUser.login_username,
    login_password: pendingUser.login_password,
    gender: pendingUser.gender,
    salary: pendingUser.salary,
  });

  // 更新待审核状态
  pendingUsers[index].status = 'approved';
  savePendingUsers(pendingUsers);
  return true;
};

export const rejectPendingUser = (id: string): boolean => {
  const pendingUsers = getPendingUsers();
  const index = pendingUsers.findIndex(u => u.id === id);
  if (index === -1) return false;

  pendingUsers[index].status = 'rejected';
  savePendingUsers(pendingUsers);
  return true;
};

export const findPendingByUsername = (username: string): PendingUser | undefined => {
  const pendingUsers = getPendingUsers();
  return pendingUsers.find(u => u.login_username === username);
};
