import { Icons } from '@/components/icons';
import { NavItem, SidebarNavItem } from '@/types';
import { Log } from '@/components/types';
// export type User = {
//   id: number;
//   name: string;
//   company: string;
//   role: string;
//   verified: boolean;
//   status: string;
// };
// export const users: User[] = [
//   {
//     id: 1,
//     name: 'Candice Schiner',
//     company: 'Dell',
//     role: 'Frontend Developer',
//     verified: false,
//     status: 'Active'
//   },
//   {
//     id: 2,
//     name: 'John Doe',
//     company: 'TechCorp',
//     role: 'Backend Developer',
//     verified: true,
//     status: 'Active'
//   },
//   {
//     id: 3,
//     name: 'Alice Johnson',
//     company: 'WebTech',
//     role: 'UI Designer',
//     verified: true,
//     status: 'Active'
//   },
//   {
//     id: 4,
//     name: 'David Smith',
//     company: 'Innovate Inc.',
//     role: 'Fullstack Developer',
//     verified: false,
//     status: 'Inactive'
//   },
//   {
//     id: 5,
//     name: 'Emma Wilson',
//     company: 'TechGuru',
//     role: 'Product Manager',
//     verified: true,
//     status: 'Active'
//   },
//   {
//     id: 6,
//     name: 'James Brown',
//     company: 'CodeGenius',
//     role: 'QA Engineer',
//     verified: false,
//     status: 'Active'
//   },
//   {
//     id: 7,
//     name: 'Laura White',
//     company: 'SoftWorks',
//     role: 'UX Designer',
//     verified: true,
//     status: 'Active'
//   },
//   {
//     id: 8,
//     name: 'Michael Lee',
//     company: 'DevCraft',
//     role: 'DevOps Engineer',
//     verified: false,
//     status: 'Active'
//   },
//   {
//     id: 9,
//     name: 'Olivia Green',
//     company: 'WebSolutions',
//     role: 'Frontend Developer',
//     verified: true,
//     status: 'Active'
//   },
//   {
//     id: 10,
//     name: 'Robert Taylor',
//     company: 'DataTech',
//     role: 'Data Analyst',
//     verified: false,
//     status: 'Active'
//   }
// ];
// export const logsdata: Log[] = [
//   {
//     id: 1,
//     chain: 'Polygon',
//     request: `{
//       "id": 5,
//       "method": "pm_sponsorUserOperation",
//       "params": [
//         {
//           "nonce": "0xb",
//           "sender": "0x6634b0d99eFE2B17dDd900E4608bFde5A6058b44",
//           "callData": "0x519454...",
//         }
//       ]
//     }`,
//     response: `"0xe3dc...1c", "jsonrpc": "2.0"`,
//     httpCode: 200,
//     age: '3 days ago',
//   },
//   {
//     id: 1,
//     chain: 'Polygon',
//     request: `{
//       "id": 5,
//       "method": "pm_sponsorUserOperation",
//       "params": [
//         {
//           "nonce": "0xb",
//           "sender": "0x6634b0d99eFE2B17dDd900E4608bFde5A6058b44",
//           "callData": "0x519454...",
//         }
//       ]
//     }`,
//     response: `"0xe3dc...1c", "jsonrpc": "2.0"`,
//     httpCode: 200,
//     age: '3 days ago',
//   },
// ];
export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  
  
  // {
  //   title: 'Account',
  //   href: '/dashboard/account',
  //   icon: 'account',
  //   label: 'account'
  // },
    
  {
    title: 'API Keys',
    href: '/dashboard/apikeys',
    icon: 'apikeys',
    label: 'apikeys'
  },

  {
    title: 'Metrics',
    href: '/dashboard/metrics',
    icon: 'apikeys',
    label: 'apikeys'
  },

 
];

export const CHAINID_NETWORK_MAP = {
  1: "mainnet",
  137: "matic",
  10: "optimism",
  5: "goerli",
  80001: "mumbai",
  42161: "arbitrum-one",
  43114: "avalanche",
  43113: "avalanche-fuji",
  84532: "base-sepolia",
  100: "gnosis",
  56: "bsc",
  250: "fantom",
  4002: "fantom-testnet",
  122: "fuse",
  8453: "base",
  11155111: "sepolia",
  421614: "arbitrum-sepolia",
  97: "bnb-testnet",
  80002: "polygon-amoy",
  11155420: "optimism-sepolia",
  7560: "cyber-mainnet",
  78600: "vanar-testnet",
  2040: "vanar-mainnet",
};