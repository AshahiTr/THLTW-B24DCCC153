// ============================================================
// Blog Service — localStorage-based data layer
// ============================================================

const POSTS_KEY = 'blog_posts';
const TAGS_KEY = 'blog_tags';
const VIEWS_KEY = 'blog_views';

// ── Seed data ──────────────────────────────────────────────

const defaultTags: Blog.ITag[] = [
  { _id: 't1', name: 'React', slug: 'react', color: '#61dafb' },
  { _id: 't2', name: 'TypeScript', slug: 'typescript', color: '#3178c6' },
  { _id: 't3', name: 'UmiJS', slug: 'umijs', color: '#1677ff' },
  { _id: 't4', name: 'Ant Design', slug: 'ant-design', color: '#1890ff' },
  { _id: 't5', name: 'Node.js', slug: 'nodejs', color: '#68a063' },
  { _id: 't6', name: 'CSS', slug: 'css', color: '#e34c26' },
  { _id: 't7', name: 'Performance', slug: 'performance', color: '#f5a623' },
  { _id: 't8', name: 'Best Practices', slug: 'best-practices', color: '#7b68ee' },
];

const defaultPosts: Blog.IPost[] = [
  {
    _id: 'p1',
    title: 'Bắt đầu với UmiJS và React TypeScript',
    slug: 'bat-dau-voi-umijs-react-typescript',
    summary: 'Hướng dẫn toàn diện để thiết lập dự án UmiJS với TypeScript, bao gồm cấu hình routes, models và services.',
    content: `# Bắt đầu với UmiJS và React TypeScript

UmiJS là một framework React enterprise-grade được thiết kế để xây dựng các ứng dụng web quy mô lớn. Trong bài viết này, chúng ta sẽ tìm hiểu cách thiết lập một dự án UmiJS hoàn chỉnh.

## Cài đặt

\`\`\`bash
npx create-umi@latest my-app
cd my-app
npm install
npm start
\`\`\`

## Cấu trúc dự án

Dự án UmiJS tiêu chuẩn có cấu trúc:

\`\`\`
src/
  pages/       # Các trang của ứng dụng
  models/      # State management (dva/hooks)
  services/    # API calls
  components/  # Shared components
config/
  routes.ts    # Cấu hình routing
\`\`\`

## Routing

UmiJS hỗ trợ file-based routing và config-based routing. Chúng ta sẽ dùng config-based:

\`\`\`typescript
export default [
  { path: '/', component: './Home' },
  { path: '/about', component: './About' },
];
\`\`\`

## Models với useModel

UmiJS cung cấp hook \`useModel\` để quản lý state toàn cục một cách đơn giản:

\`\`\`typescript
// src/models/counter.ts
import { useState } from 'react';

export default () => {
  const [count, setCount] = useState(0);
  return { count, setCount };
};
\`\`\`

## Kết luận

UmiJS là lựa chọn tuyệt vời cho các dự án React enterprise với TypeScript. Framework này cung cấp đầy đủ công cụ cần thiết để xây dựng ứng dụng quy mô lớn.`,
    thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80',
    author: 'Nguyễn Văn Dev',
    tags: ['t1', 't2', 't3'],
    status: 'published',
    views: 342,
    createdAt: '2024-11-15T08:00:00Z',
  },
  {
    _id: 'p2',
    title: 'Ant Design 5.x — Những tính năng mới đáng chú ý',
    slug: 'ant-design-5x-tinh-nang-moi',
    summary: 'Khám phá những cải tiến lớn trong Ant Design 5.x: CSS-in-JS, Design Token, và Component API mới.',
    content: `# Ant Design 5.x — Những tính năng mới đáng chú ý

Ant Design 5.x đánh dấu một bước ngoặt lớn trong sự phát triển của thư viện UI phổ biến nhất cho React.

## CSS-in-JS

Thay vì Less, Ant Design 5.x sử dụng CSS-in-JS dựa trên \`@ant-design/cssinjs\`:

\`\`\`typescript
import { theme } from 'antd';

const { useToken } = theme;

const MyComponent = () => {
  const { token } = useToken();
  return (
    <div style={{ color: token.colorPrimary }}>
      Hello World
    </div>
  );
};
\`\`\`

## Design Token

Design Token cho phép tùy chỉnh giao diện một cách hệ thống:

\`\`\`typescript
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1677ff',
      borderRadius: 8,
    },
  }}
>
  <App />
</ConfigProvider>
\`\`\`

## Component cải tiến

- **Table**: Performance tốt hơn với Virtual Scroll
- **Form**: API đơn giản hơn
- **Modal**: Hỗ trợ App.useApp() hook

## Kết luận

Ant Design 5.x mang đến trải nghiệm developer tốt hơn với hiệu năng cao hơn.`,
    thumbnail: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&q=80',
    author: 'Nguyễn Văn Dev',
    tags: ['t4', 't1'],
    status: 'published',
    views: 218,
    createdAt: '2024-11-20T09:30:00Z',
  },
  {
    _id: 'p3',
    title: 'Tối ưu hóa hiệu suất ứng dụng React',
    slug: 'toi-uu-hoa-hieu-suat-react',
    summary: 'Các kỹ thuật nâng cao để tối ưu render, bundle size và runtime performance trong ứng dụng React production.',
    content: `# Tối ưu hóa hiệu suất ứng dụng React

Hiệu suất là yếu tố then chốt trong mọi ứng dụng web. Hãy cùng khám phá các kỹ thuật tối ưu hóa React.

## 1. React.memo và useMemo

\`\`\`typescript
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>;
});

const processed = useMemo(() => 
  heavyComputation(rawData), 
  [rawData]
);
\`\`\`

## 2. Code Splitting

\`\`\`typescript
const LazyPage = React.lazy(() => import('./pages/HeavyPage'));

<Suspense fallback={<Spin />}>
  <LazyPage />
</Suspense>
\`\`\`

## 3. Virtual Scrolling

Với danh sách lớn, dùng \`react-window\` hoặc Ant Design Table với \`virtual\` prop.

## 4. Bundle Optimization

\`\`\`bash
# Phân tích bundle
npx webpack-bundle-analyzer stats.json
\`\`\`

## 5. Image Optimization

- Dùng WebP format
- Lazy loading với \`loading="lazy"\`
- Serve đúng kích thước

## Kết luận

Tối ưu hóa React là quá trình liên tục. Hãy đo lường trước khi tối ưu!`,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    author: 'Nguyễn Văn Dev',
    tags: ['t1', 't7'],
    status: 'published',
    views: 156,
    createdAt: '2024-12-01T10:00:00Z',
  },
  {
    _id: 'p4',
    title: 'TypeScript Best Practices 2024',
    slug: 'typescript-best-practices-2024',
    summary: 'Tổng hợp các best practices TypeScript được cộng đồng đề xuất năm 2024: strict mode, utility types, và patterns.',
    content: `# TypeScript Best Practices 2024

TypeScript ngày càng phổ biến. Hãy tìm hiểu các best practices mới nhất.

## 1. Bật Strict Mode

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
\`\`\`

## 2. Utility Types

\`\`\`typescript
type UserPreview = Pick<User, 'id' | 'name' | 'email'>;
type PartialConfig = Partial<Config>;
type RequiredFields = Required<OptionalData>;
type ReadonlyUser = Readonly<User>;
\`\`\`

## 3. Template Literal Types

\`\`\`typescript
type EventName = \`on\${Capitalize<string>}\`;
type CSSProperty = \`--\${string}\`;
\`\`\`

## 4. Discriminated Unions

\`\`\`typescript
type Result<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' };
\`\`\`

## Kết luận

TypeScript giúp code an toàn và dễ bảo trì hơn rất nhiều khi áp dụng đúng cách.`,
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    author: 'Nguyễn Văn Dev',
    tags: ['t2', 't8'],
    status: 'published',
    views: 289,
    createdAt: '2024-12-05T11:00:00Z',
  },
  {
    _id: 'p5',
    title: 'Xây dựng REST API với Node.js và Express',
    slug: 'xay-dung-rest-api-nodejs-express',
    summary: 'Hướng dẫn từng bước xây dựng REST API chuẩn với Node.js, Express, MongoDB và JWT authentication.',
    content: `# Xây dựng REST API với Node.js và Express

REST API là nền tảng của hầu hết ứng dụng web hiện đại. Hãy xây dựng một API hoàn chỉnh.

## Setup

\`\`\`bash
npm init -y
npm install express mongoose jsonwebtoken bcrypt dotenv
npm install -D typescript @types/express ts-node-dev
\`\`\`

## Cấu trúc dự án

\`\`\`
src/
  controllers/
  models/
  routes/
  middleware/
  utils/
server.ts
\`\`\`

## Authentication với JWT

\`\`\`typescript
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
  
  res.json({ token });
};
\`\`\`

## Kết luận

Node.js và Express là combo mạnh mẽ để xây dựng API nhanh chóng và hiệu quả.`,
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
    author: 'Nguyễn Văn Dev',
    tags: ['t5', 't8'],
    status: 'published',
    views: 197,
    createdAt: '2024-12-10T08:00:00Z',
  },
  {
    _id: 'p6',
    title: 'CSS Grid và Flexbox — Khi nào dùng cái nào?',
    slug: 'css-grid-vs-flexbox',
    summary: 'Phân tích chi tiết sự khác biệt giữa CSS Grid và Flexbox, kèm theo các use case thực tế và khi nào nên dùng mỗi cái.',
    content: `# CSS Grid và Flexbox — Khi nào dùng cái nào?

Đây là một câu hỏi phổ biến của nhiều developer. Hãy cùng phân tích rõ ràng.

## Flexbox — 1D Layout

Flexbox tốt cho layout theo một chiều (row hoặc column):

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-actions {
  display: flex;
  gap: 8px;
}
\`\`\`

## CSS Grid — 2D Layout

Grid tốt cho layout theo hai chiều:

\`\`\`css
.page-layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}
\`\`\`

## Quy tắc đơn giản

- **Flexbox**: Component-level, items trong một hàng/cột
- **Grid**: Page-level, layout phức tạp 2D

## Kết luận

Không có câu trả lời tuyệt đối. Hãy dùng cả hai khi cần thiết!`,
    thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80',
    author: 'Nguyễn Văn Dev',
    tags: ['t6', 't8'],
    status: 'published',
    views: 134,
    createdAt: '2024-12-15T09:00:00Z',
  },
  {
    _id: 'p7',
    title: 'State Management trong React 2024',
    slug: 'state-management-react-2024',
    summary: 'So sánh các giải pháp quản lý state: Zustand, Jotai, Redux Toolkit và React Query. Lựa chọn nào phù hợp với dự án của bạn?',
    content: `# State Management trong React 2024

Năm 2024, có nhiều lựa chọn tuyệt vời cho state management trong React.

## Redux Toolkit — Vẫn mạnh

\`\`\`typescript
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1; },
    decrement: state => { state.value -= 1; },
  },
});
\`\`\`

## Zustand — Đơn giản và nhẹ

\`\`\`typescript
const useStore = create<Store>(set => ({
  bears: 0,
  increase: () => set(state => ({ bears: state.bears + 1 })),
}));
\`\`\`

## React Query — Server State

\`\`\`typescript
const { data, isLoading } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
});
\`\`\`

## Kết luận

- **Nhỏ**: useState + Context
- **Vừa**: Zustand
- **Lớn**: Redux Toolkit
- **Server state**: React Query`,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    author: 'Nguyễn Văn Dev',
    tags: ['t1', 't2', 't8'],
    status: 'published',
    views: 412,
    createdAt: '2024-12-20T10:00:00Z',
  },
  {
    _id: 'p8',
    title: 'Git Workflow cho team development',
    slug: 'git-workflow-team-development',
    summary: 'Thiết lập Git workflow chuyên nghiệp cho team: Gitflow, conventional commits, branch naming và code review process.',
    content: `# Git Workflow cho team development

Một Git workflow tốt là nền tảng của mọi team phát triển phần mềm hiệu quả.

## Gitflow

\`\`\`
main        — Production code
develop     — Integration branch
feature/*   — New features
hotfix/*    — Critical fixes
release/*   — Release preparation
\`\`\`

## Conventional Commits

\`\`\`
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
refactor: simplify auth middleware
test: add unit tests for UserService
\`\`\`

## Branch Naming

\`\`\`
feature/user-authentication
bugfix/login-redirect
hotfix/security-patch
release/v2.0.0
\`\`\`

## Kết luận

Consistency trong Git workflow giúp team làm việc hiệu quả hơn và dễ dàng review code.`,
    thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&q=80',
    author: 'Nguyễn Văn Dev',
    tags: ['t8'],
    status: 'published',
    views: 89,
    createdAt: '2024-12-22T08:00:00Z',
  },
  {
    _id: 'p9',
    title: 'Micro-frontend Architecture với Module Federation',
    slug: 'micro-frontend-module-federation',
    summary: 'Hướng dẫn triển khai micro-frontend với Webpack Module Federation: chia sẻ components, routing và state giữa các app.',
    content: `# Micro-frontend Architecture với Module Federation

Module Federation là tính năng của Webpack 5 cho phép chia sẻ code giữa các ứng dụng độc lập.

## Khái niệm

- **Host**: App chính consume các remote modules
- **Remote**: App cung cấp modules cho host

## Cấu hình

\`\`\`javascript
// Remote app webpack.config.js
plugins: [
  new ModuleFederationPlugin({
    name: 'userApp',
    filename: 'remoteEntry.js',
    exposes: {
      './Button': './src/components/Button',
    },
    shared: ['react', 'react-dom'],
  }),
]
\`\`\`

## Kết luận

Micro-frontend phù hợp với các tổ chức lớn với nhiều team độc lập.`,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    author: 'Nguyễn Văn Dev',
    tags: ['t1', 't7'],
    status: 'draft',
    views: 0,
    createdAt: '2024-12-25T08:00:00Z',
  },
  {
    _id: 'p10',
    title: 'Testing React Components với Vitest',
    slug: 'testing-react-vitest',
    summary: 'Viết unit tests và integration tests cho React components sử dụng Vitest và React Testing Library.',
    content: `# Testing React Components với Vitest

Testing là một phần không thể thiếu trong phát triển phần mềm chuyên nghiệp.

## Setup

\`\`\`bash
npm install -D vitest @testing-library/react @testing-library/user-event
\`\`\`

## Unit Test

\`\`\`typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
\`\`\`

## Kết luận

Vitest nhanh hơn Jest và tích hợp tốt với Vite ecosystem.`,
    thumbnail: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=800&q=80',
    author: 'Nguyễn Văn Dev',
    tags: ['t1', 't2'],
    status: 'draft',
    views: 0,
    createdAt: '2024-12-28T09:00:00Z',
  },
];

// ── Helpers ────────────────────────────────────────────────

const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`;

const now = () => new Date().toISOString();

// ── Tags CRUD ──────────────────────────────────────────────

export const getTags = (): Blog.ITag[] => {
  const raw = localStorage.getItem(TAGS_KEY);
  if (!raw) {
    localStorage.setItem(TAGS_KEY, JSON.stringify(defaultTags));
    return defaultTags;
  }
  return JSON.parse(raw);
};

export const saveTags = (tags: Blog.ITag[]) => {
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
};

export const createTag = (data: Omit<Blog.ITag, '_id'>): Blog.ITag => {
  const tags = getTags();
  const tag: Blog.ITag = { ...data, _id: generateId(), createdAt: now() };
  saveTags([...tags, tag]);
  return tag;
};

export const updateTag = (id: string, data: Partial<Blog.ITag>): Blog.ITag => {
  const tags = getTags().map(t => t._id === id ? { ...t, ...data } : t);
  saveTags(tags);
  return tags.find(t => t._id === id)!;
};

export const deleteTag = (id: string) => {
  saveTags(getTags().filter(t => t._id !== id));
};

// ── Posts CRUD ─────────────────────────────────────────────

export const getPosts = (): Blog.IPost[] => {
  const raw = localStorage.getItem(POSTS_KEY);
  if (!raw) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(defaultPosts));
    return defaultPosts;
  }
  return JSON.parse(raw);
};

export const savePosts = (posts: Blog.IPost[]) => {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

export const createPost = (data: Omit<Blog.IPost, '_id' | 'views' | 'createdAt'>): Blog.IPost => {
  const posts = getPosts();
  const post: Blog.IPost = { ...data, _id: generateId(), views: 0, createdAt: now() };
  savePosts([post, ...posts]);
  return post;
};

export const updatePost = (id: string, data: Partial<Blog.IPost>): Blog.IPost => {
  const posts = getPosts().map(p => p._id === id ? { ...p, ...data, updatedAt: now() } : p);
  savePosts(posts);
  return posts.find(p => p._id === id)!;
};

export const deletePost = (id: string) => {
  savePosts(getPosts().filter(p => p._id !== id));
};

export const incrementView = (id: string) => {
  const viewsRaw = localStorage.getItem(VIEWS_KEY);
  const views: Record<string, number> = viewsRaw ? JSON.parse(viewsRaw) : {};
  if (!views[id]) {
    views[id] = 1;
    localStorage.setItem(VIEWS_KEY, JSON.stringify(views));
    const posts = getPosts().map(p => p._id === id ? { ...p, views: p.views + 1 } : p);
    savePosts(posts);
  }
};

export const clearViewedPost = (id: string) => {
  const viewsRaw = localStorage.getItem(VIEWS_KEY);
  const views: Record<string, number> = viewsRaw ? JSON.parse(viewsRaw) : {};
  delete views[id];
  localStorage.setItem(VIEWS_KEY, JSON.stringify(views));
};

// ── Enriched getters ───────────────────────────────────────

export const getEnrichedPosts = (): Blog.IPost[] => {
  const posts = getPosts();
  const tags = getTags();
  return posts.map(p => ({
    ...p,
    tagDetails: p.tags.map(tid => tags.find(t => t._id === tid)).filter(Boolean) as Blog.ITag[],
  }));
};

export const getPostBySlug = (slug: string): Blog.IPost | undefined => {
  return getEnrichedPosts().find(p => p.slug === slug);
};

export const getTagsWithCount = (): Blog.ITag[] => {
  const tags = getTags();
  const posts = getPosts();
  return tags.map(tag => ({
    ...tag,
    postCount: posts.filter(p => p.tags.includes(tag._id) && p.status === 'published').length,
  }));
};
