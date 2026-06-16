## 1. 架构设计

```mermaid
flowchart LR
    A[前端 React] --> B[Mock数据层]
    B --> C[LocalStorage]
```

## 2. 技术描述
- 前端框架：React@18 + Vite@6
- 样式方案：TailwindCSS@3
- 图标库：Lucide React
- 状态管理：React Context + useState
- 数据存储：LocalStorage

## 3. 路由定义
| 路由 | 用途 | 权限 |
|------|------|------|
| / | 登录页面 | 公开 |
| /admin | 管理员首页 | 管理员 |
| /admin/employees | 员工列表 | 管理员 |
| /admin/employees/:id | 员工详情 | 管理员 |
| /admin/roles | 权限配置 | 管理员 |
| /admin/profile | 管理员个人设置 | 管理员 |
| /employee | 员工个人中心 | 普通员工 |

## 4. 数据模型

### 4.1 用户模型
```typescript
interface User {
  user_no: string;        // 工号（10位）
  user_name: string;      // 姓名
  role_no: string;        // 岗位编号
  login_username: string; // 登录用户名
  login_password: string; // 登录密码
  gender: 'm' | 'f';      // 性别
  salary: number;         // 工资
}
```

### 4.2 岗位模型
```typescript
interface Role {
  role_no: string;   // 岗位编号
  role_name: string; // 岗位名称
}
```

### 4.3 菜单模型
```typescript
interface SysMenu {
  menu_no: string;   // 菜单编号
  menu_name: string; // 菜单名称
}
```

### 4.4 岗位菜单关联
```typescript
interface RoleMenuMap {
  role_no: string;      // 岗位编号
  menu_nos: string[];   // 关联的菜单编号数组
}
```

## 5. 组件结构
```
src/
├── components/
│   ├── Layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── AdminLayout.tsx
│   ├── UI/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── Login/
│   │   └── LoginForm.tsx
│   └── Employee/
│       ├── EmployeeList.tsx
│       └── EmployeeForm.tsx
├── pages/
│   ├── Login.tsx
│   ├── Admin/
│   │   ├── Dashboard.tsx
│   │   ├── EmployeeList.tsx
│   │   ├── EmployeeDetail.tsx
│   │   ├── RoleConfig.tsx
│   │   └── Profile.tsx
│   └── Employee/
│       └── Profile.tsx
├── context/
│   └── AuthContext.tsx
├── data/
│   └── mockData.ts
└── utils/
    └── storage.ts
```

## 6. Mock数据初始化
- 管理员账号：用户名"管理员"，密码"123456"
- 预置员工数据（8位员工）
- 两种岗位：管理岗(R001)、柜员岗(R002)
- 7个系统菜单功能