import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'My Plan', href: '/my-plan' },
  { name: 'Smart Cart', href: '/cart' },
  { name: 'Take Quiz', href: '/quiz' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  const filteredNavigation = navigation.filter(item => {
    if (['Dashboard', 'My Plan', 'Smart Cart'].includes(item.name)) {
      return !!user; // Only members see these
    }
    if (item.name === 'Take Quiz' && user) {
      return false; // Members don't take quiz again
    }
    return true;
  });

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center">
            <span className="text-gray-900 font-black text-2xl tracking-tighter">SATHVIC</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden sm:ml-10 sm:block">
            <div className="flex space-x-1">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
                      'rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200',
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button className="text-gray-400 hover:text-gray-900 transition-colors">
                  <BellIcon className="size-6" />
                </button>
                <Menu as="div" className="relative">
                  <MenuButton className="flex rounded-full bg-indigo-600 size-10 items-center justify-center text-white font-bold hover:ring-4 hover:ring-indigo-100 transition-all uppercase">
                    {user.name.charAt(0)}
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none"
                  >
                    <MenuItem>
                      <span className="block px-4 py-2 text-xs text-gray-400 font-bold uppercase tracking-widest border-b border-gray-50 mb-1">{user.name}</span>
                    </MenuItem>
                    <MenuItem>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Your Profile</a>
                    </MenuItem>
                    <MenuItem>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Settings</a>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900 px-3 py-2 transition-colors">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <DisclosureButton className="text-gray-500 hover:text-gray-900">
                <Bars3Icon className="size-8" />
              </DisclosureButton>
            </div>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden bg-white border-b">
        <div className="space-y-1 px-4 pt-2 pb-6">
          {filteredNavigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.href}
              className={classNames(
                location.pathname === item.href ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50',
                'block rounded-xl px-4 py-3 text-base font-bold',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
          {!user && (
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <DisclosureButton as={Link} to="/login" className="block rounded-xl px-4 py-3 text-base font-bold text-gray-500 hover:bg-gray-50">Login</DisclosureButton>
              <DisclosureButton as={Link} to="/register" className="block rounded-xl px-4 py-3 text-base font-bold bg-indigo-600 text-white text-center">Sign Up</DisclosureButton>
            </div>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
