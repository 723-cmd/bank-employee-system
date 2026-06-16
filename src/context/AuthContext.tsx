import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../data/mockData';
import { getCurrentUser, setCurrentUser, findUserByUsername, findPendingByUsername, initData } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initData();
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = (username: string, password: string): { success: boolean; message: string } => {
    // 先检查正式用户
    const foundUser = findUserByUsername(username);
    if (foundUser && foundUser.login_password === password) {
      setUser(foundUser);
      setCurrentUser(foundUser);
      return { success: true, message: '登录成功' };
    }

    // 检查待审核用户
    const pendingUser = findPendingByUsername(username);
    if (pendingUser) {
      if (pendingUser.status === 'pending') {
        return { success: false, message: '账户正在审核中，请等待管理员审批' };
      } else if (pendingUser.status === 'rejected') {
        return { success: false, message: '注册申请已被拒绝，请联系管理员' };
      }
    }

    return { success: false, message: '用户名或密码错误' };
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
  };

  const isAdmin = user?.role_no === 'R001';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
