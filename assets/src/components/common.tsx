import React, {FunctionComponent} from 'react';
import Alert from 'antd/lib/alert';
import AutoComplete from 'antd/lib/auto-complete';
import Badge from 'antd/lib/badge';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import Divider from 'antd/lib/divider';
import Drawer from 'antd/lib/drawer';
import Dropdown from 'antd/lib/dropdown';
import Empty from 'antd/lib/empty';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Layout from 'antd/lib/layout';
import List from 'antd/lib/list';
import Mentions from 'antd/lib/mentions';
import Menu from 'antd/lib/menu';
import Modal from 'antd/lib/modal';
import notification from 'antd/lib/notification';
import Popconfirm from 'antd/lib/popconfirm';
import Popover from 'antd/lib/popover';
import Radio from 'antd/lib/radio';
import Result from 'antd/lib/result';
import Select from 'antd/lib/select';
import Spin from 'antd/lib/spin';
import Statistic from 'antd/lib/statistic';
import Switch from 'antd/lib/switch';
import Table from 'antd/lib/table';
import Tabs from 'antd/lib/tabs';
import Tag from 'antd/lib/tag';
import Tooltip from 'antd/lib/tooltip';
import Typography from 'antd/lib/typography';
import Upload from 'antd/lib/upload';

import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {prism as syntaxHighlightingLanguage} from 'react-syntax-highlighter/dist/esm/styles/prism';

import {
  blue,
  green,
  red,
  volcano,
  orange,
  gold,
  purple,
  magenta,
  grey,
} from '@ant-design/colors';

import {Box, BoxProps, Flex, SxStyleProp} from 'theme-ui';
import DatePicker from './DatePicker';
import MarkdownRenderer from './MarkdownRenderer';

export type {UploadChangeParam} from 'antd/lib/upload';
export type {UploadFile} from 'antd/lib/upload/interface';

const {Title, Text, Paragraph} = Typography;
const {Header, Content, Footer, Sider} = Layout;
const {RangePicker} = DatePicker;

export const colors = {
  white: '#ffffff',
  black: '#000000',
  primary: '#1677ff', // Netia primary blue
  primaryLight: '#eaf3ff', // primary-50
  primaryDark: '#0b63d1', // primary-600
  primaryHover: '#0958d9',
  green: green[5],
  red: red[5],
  gold: gold[5],
  volcano: volcano[5],
  orange: orange[5],
  purple: purple[5],
  magenta: magenta[5],
  blue: blue, // expose all blues
  gray: grey, // expose all grays
  // Modern text colors
  textPrimary: '#000000',
  textSecondary: '#1a1a1a',
  textMuted: '#6b6b6b',
  text: '#1a1a1a', // Modern foreground color
  secondary: '#6b6b6b', // Modern muted color
  muted: '#6b6b6b',
  // Modern background colors
  bgWhite: '#ffffff',
  bgSurface: '#fafafa',
  bgHover: '#f5f5f5',
  surface: '#fafafa',
  // Modern border colors
  border: '#e5e5e5',
  borderLight: '#f0f0f0',
  borderDark: '#d9d9d9',
  // Sidebar colors
  sidebarBg: '#000000',
  sidebarText: '#ffffff',
  sidebarHover: 'rgba(255, 255, 255, 0.08)',
  sidebarActive: 'rgba(255, 255, 255, 0.12)',
  // Legacy colors (for backward compatibility)
  note: '#fff1b8',
  noteSecondary: 'rgba(254,237,175,.4)',
};

export const shadows = {
  // Modern, subtle shadows inspired by Notion, Linear, Intercom
  small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  primary: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  medium:
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  large:
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

export const StandardSyntaxHighlighter: FunctionComponent<{
  language: string;
  style?: any;
  children?: React.ReactNode;
}> = ({language, children, style = {}}) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={syntaxHighlightingLanguage}
      customStyle={style}
    >
      {children}
    </SyntaxHighlighter>
  );
};

export const Card = ({
  children,
  shadow = false,
  sx = {},
  ...props
}: {
  children: any;
  shadow?: boolean | 'small' | 'medium' | 'large';
  sx?: SxStyleProp;
} & BoxProps) => {
  const shadowKey = shadow && typeof shadow === 'boolean' ? 'primary' : shadow;
  const boxShadow = shadowKey ? shadows[shadowKey] || shadows.primary : 'none';

  return (
    <Box
      sx={{
        bg: colors.bgWhite,
        border: `1px solid ${colors.border}`,
        borderRadius: 8, // Modern border radius
        boxShadow,
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export const Container = ({
  children,
  sx = {},
}: {
  children: any;
  sx?: SxStyleProp;
}) => {
  return (
    <Flex
      sx={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100%',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Box
        p={4}
        sx={{flex: 1, width: '100%', maxWidth: 1080, ...sx, textAlign: 'left'}}
      >
        {children}
      </Box>
    </Flex>
  );
};

export const TextArea = Input.TextArea;

/**
 * Whitelist node types that we allow when we render markdown.
 * Reference https://github.com/rexxars/react-markdown#node-types
 */
export const allowedNodeTypes: Array<any> = [
  'root',
  'text',
  'break',
  'paragraph',
  'emphasis',
  'strong',
  'blockquote',
  'delete',
  'link',
  'linkReference',
  'list',
  'listItem',
  'heading',
  'inlineCode',
  'code',
  'image',
];

export {
  // Typography
  Title,
  Text,
  Paragraph,
  // Layout
  Content,
  Footer,
  Layout,
  Header,
  Sider,
  // Components
  Alert,
  AutoComplete,
  Badge,
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Input,
  InputNumber,
  List,
  MarkdownRenderer,
  Mentions,
  Menu,
  Modal,
  notification,
  Popconfirm,
  Popover,
  Radio,
  RangePicker,
  Result,
  Select,
  Switch,
  Spin,
  Statistic,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Upload,
};
