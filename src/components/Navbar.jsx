import { useState } from 'react';
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiLogOut, 
  FiUser, 
  FiHome,
  FiFileText,
  FiUsers,
  FiSettings,
  FiEdit,
  FiKey,
  FiActivity
} from 'react-icons/fi';

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const navItems = [
    { 
      name: 'Dashboard', 
      path: 'product-list',
      icon: <FiHome size={24} />
    },
    { 
      name: 'Forms', 
      path: 'product-management',
      icon: <FiEdit size={24} />
    },
    { 
      name: 'Users', 
      path: '#',
      icon: <FiUsers size={24} />
    },
    { 
      name: 'Settings', 
      path: '#',
      icon: <FiSettings size={24} />,
      dropdown: [
        { name: 'System Config', path: '#', icon: <FiSettings size={18} /> },
        { name: 'Process management', path: 'process-management', icon: <FiKey size={18} /> },
        { name: 'Audit Log', path: '#', icon: <FiActivity size={18} /> }
      ]
    }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gray-700 text-white shadow-sm border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          {/* Logo - Big text without icon */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold tracking-tight">PRODUCT MANAGEMENT</span>
          </div>
          
          {/* Main Navigation */}
          <div className="flex flex-1 justify-center">
            <div className="flex items-center space-x-2">
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="flex items-center justify-between h-24 w-36 px-4 hover:bg-white hover:text-black transition-colors duration-300 group"
                      >
                        <div className="flex flex-col items-center">
                          {item.icon}
                          <span className="text-sm mt-2 font-medium">{item.name}</span>
                        </div>
                        {openDropdown === item.name ? (
                          <FiChevronUp className="ml-2 text-gray-400 group-hover:text-black" size={18} />
                        ) : (
                          <FiChevronDown className="ml-2 text-gray-400 group-hover:text-black" size={18} />
                        )}
                      </button>
                      
                      {openDropdown === item.name && (
                        <div className="absolute left-0 mt-0 w-56 rounded-sm shadow-lg bg-white text-black border border-gray-200 z-10">
                          <div className="py-1">
                            {item.dropdown.map((subItem) => (
                              <a
                                key={subItem.name}
                                href={subItem.path}
                                className="flex items-center px-4 py-3 text-sm hover:bg-black hover:text-white transition-colors duration-300"
                              >
                                {subItem.icon}
                                <span className="ml-3">{subItem.name}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.path}
                      className="flex flex-col items-center justify-center h-24 w-36 px-4 hover:bg-white hover:text-black transition-colors duration-300"
                    >
                      {item.icon}
                      <span className="text-sm mt-2 font-medium">{item.name}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* User dropdown */}
          <div className="flex-shrink-0 w-32 flex justify-center">
            <div className="relative">
              <button
                onClick={() => toggleDropdown('user')}
                className="flex items-center justify-between h-24 w-36 px-4 hover:bg-white hover:text-black transition-colors duration-300 group"
              >
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center">
                    <FiUser size={18} />
                  </div>
                  <span className="text-sm mt-2 font-medium">Admin</span>
                </div>
                {openDropdown === 'user' ? (
                  <FiChevronUp className="ml-2 text-gray-400 group-hover:text-black" size={18} />
                ) : (
                  <FiChevronDown className="ml-2 text-gray-400 group-hover:text-black" size={18} />
                )}
              </button>

              {openDropdown === 'user' && (
                <div className="absolute right-0 mt-0 w-48 rounded-sm shadow-lg bg-white text-black border border-gray-200 z-10">
                  <div className="py-1">
                    <a
                      href="#"
                      className="flex items-center justify-center px-4 py-3 text-sm hover:bg-black hover:text-white transition-colors duration-300"
                    >
                      <FiLogOut className="mr-3" size={18} />
                      Logout
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;