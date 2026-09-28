import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, BarChart3, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Tasks', href: '/tasks', icon: CheckSquare },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-white border-r border-gray-200">
                <div className="flex h-16 shrink-0 items-center px-6 bg-indigo-600">
                    <CheckSquare className="h-8 w-8 text-white mr-2" />
                    <span className="text-xl font-bold text-white tracking-tight">TaskFlow</span>
                </div>
                <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
                    <nav className="flex-1 space-y-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={clsx(
                                        isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                        'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold transition-colors'
                                    )}
                                >
                                    <item.icon className={clsx(isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600', 'h-5 w-5 shrink-0')} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                
                {/* User Info & Logout */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-x-3 mb-4">
                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900 truncate w-32">{user.name}</span>
                            <span className="text-xs text-gray-500 truncate w-32">{user.email}</span>
                        </div>
                    </div>
                    <button 
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-x-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        <LogOut className="h-4 w-4 text-gray-500" /> Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Nav */}
            <div className="md:hidden fixed top-0 w-full z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-indigo-600 px-4">
                <div className="flex items-center">
                    <CheckSquare className="h-6 w-6 text-white mr-2" />
                    <span className="text-lg font-bold text-white">TaskFlow</span>
                </div>
                <button type="button" className="-m-2.5 p-2.5 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <span className="sr-only">Open sidebar</span>
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-30 bg-gray-900/80 top-16">
                    <div className="bg-white w-full h-full flex flex-col pt-4">
                        <nav className="flex-1 px-4 space-y-2">
                             {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-gray-900 flex gap-x-3 rounded-md p-3 text-base font-semibold border-b border-gray-100"
                                >
                                    <item.icon className="h-5 w-5 text-indigo-600" />
                                    {item.name}
                                </Link>
                            ))}
                            <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-left text-gray-900 flex gap-x-3 rounded-md p-3 text-base font-semibold border-b border-gray-100">
                                <LogOut className="h-5 w-5 text-red-500" /> Logout
                            </button>
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 md:pl-64 pt-16 md:pt-0">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
