import {
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
  TwitterOutlined,
  CodeOutlined,
  BookOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Divider, Progress, Row, Tag, Tooltip, Typography } from 'antd';
import React from 'react';
import './index.less';

const { Title, Paragraph, Text } = Typography;

const skills = [
  { name: 'React / TypeScript', level: 92, color: '#61dafb' },
  { name: 'UmiJS / Ant Design', level: 88, color: '#1677ff' },
  { name: 'Node.js / Express', level: 80, color: '#68a063' },
  { name: 'CSS / Tailwind', level: 85, color: '#e34c26' },
  { name: 'MongoDB / PostgreSQL', level: 75, color: '#47a248' },
  { name: 'Docker / DevOps', level: 65, color: '#2496ed' },
];

const experiences = [
  {
    year: '2023 — Nay',
    role: 'Senior Frontend Developer',
    company: 'Tech Corp Vietnam',
    desc: 'Xây dựng hệ thống quản lý nội bộ quy mô lớn với React, TypeScript và UmiJS.',
  },
  {
    year: '2021 — 2023',
    role: 'Fullstack Developer',
    company: 'Startup Hub',
    desc: 'Phát triển các sản phẩm SaaS với React, Node.js và MongoDB.',
  },
  {
    year: '2019 — 2021',
    role: 'Frontend Developer',
    company: 'Agency Digital',
    desc: 'Xây dựng landing pages và web app cho nhiều khách hàng doanh nghiệp.',
  },
];

const techTags = [
  'React', 'TypeScript', 'UmiJS', 'Ant Design',
  'Node.js', 'Express', 'MongoDB', 'PostgreSQL',
  'Docker', 'Git', 'REST API', 'GraphQL',
  'Tailwind CSS', 'Webpack', 'Vite', 'Jest',
];

const AboutPage: React.FC = () => {
  return (
    <div className="blog-about">
      {/* Hero */}
      <div className="blog-about__hero">
        <div className="blog-about__hero-bg" />
        <div className="blog-about__hero-content">
          <div className="blog-about__avatar-wrap">
            <Avatar
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=DevBlog&backgroundColor=b6e3f4"
              size={130}
              className="blog-about__avatar"
            />
            <div className="blog-about__avatar-ring" />
          </div>

          <Title className="blog-about__name">Nguyễn Văn Dev</Title>
          <Text className="blog-about__role">Full-stack Developer · Content Creator</Text>

          <div className="blog-about__social">
            <Tooltip title="GitHub">
              <Button
                shape="circle"
                icon={<GithubOutlined />}
                href="https://github.com"
                target="_blank"
                className="blog-about__social-btn"
              />
            </Tooltip>
            <Tooltip title="LinkedIn">
              <Button
                shape="circle"
                icon={<LinkedinOutlined />}
                href="https://linkedin.com"
                target="_blank"
                className="blog-about__social-btn linkedin"
              />
            </Tooltip>
            <Tooltip title="Twitter">
              <Button
                shape="circle"
                icon={<TwitterOutlined />}
                href="https://twitter.com"
                target="_blank"
                className="blog-about__social-btn twitter"
              />
            </Tooltip>
            <Tooltip title="Email">
              <Button
                shape="circle"
                icon={<MailOutlined />}
                href="mailto:dev@example.com"
                className="blog-about__social-btn email"
              />
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="blog-about__body">
        <Row gutter={[32, 32]}>
          {/* Left Column */}
          <Col xs={24} lg={8}>
            {/* Bio */}
            <Card className="blog-about__card" bordered={false}>
              <div className="blog-about__section-header">
                <BookOutlined className="blog-about__section-icon" />
                <Title level={5} style={{ margin: 0 }}>Về tôi</Title>
              </div>
              <Divider style={{ margin: '12px 0 16px' }} />
              <Paragraph style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginBottom: 0 }}>
                Xin chào! Tôi là một <strong>Full-stack Developer</strong> với hơn <strong>5 năm kinh nghiệm</strong> xây dựng ứng dụng web.
              </Paragraph>
              <Paragraph style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginTop: 12, marginBottom: 0 }}>
                Đam mê chia sẻ kiến thức lập trình, tôi viết blog để ghi lại những gì học được và giúp đỡ cộng đồng developer Việt Nam.
              </Paragraph>
              <Paragraph style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginTop: 12, marginBottom: 0 }}>
                Ngoài code, tôi thích đọc sách công nghệ, chơi game indie và khám phá các framework mới.
              </Paragraph>
            </Card>

            {/* Tech Stack */}
            <Card className="blog-about__card" bordered={false} style={{ marginTop: 20 }}>
              <div className="blog-about__section-header">
                <CodeOutlined className="blog-about__section-icon" />
                <Title level={5} style={{ margin: 0 }}>Tech Stack</Title>
              </div>
              <Divider style={{ margin: '12px 0 16px' }} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {techTags.map(tech => (
                  <Tag
                    key={tech}
                    style={{
                      borderRadius: 20,
                      padding: '3px 12px',
                      fontSize: 13,
                      background: '#f0f7ff',
                      border: '1px solid #d0e4ff',
                      color: '#1677ff',
                    }}
                  >
                    {tech}
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={16}>
            {/* Skills */}
            <Card className="blog-about__card" bordered={false}>
              <div className="blog-about__section-header">
                <TrophyOutlined className="blog-about__section-icon" />
                <Title level={5} style={{ margin: 0 }}>Kỹ năng</Title>
              </div>
              <Divider style={{ margin: '12px 0 20px' }} />
              <Row gutter={[24, 16]}>
                {skills.map(skill => (
                  <Col key={skill.name} xs={24} md={12}>
                    <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong style={{ fontSize: 14 }}>{skill.name}</Text>
                      <Text type="secondary" style={{ fontSize: 13 }}>{skill.level}%</Text>
                    </div>
                    <Progress
                      percent={skill.level}
                      showInfo={false}
                      strokeColor={skill.color}
                      trailColor="#f0f0f0"
                      strokeWidth={8}
                      style={{ borderRadius: 4 }}
                    />
                  </Col>
                ))}
              </Row>
            </Card>

            {/* Experience */}
            <Card className="blog-about__card" bordered={false} style={{ marginTop: 20 }}>
              <div className="blog-about__section-header">
                <BookOutlined className="blog-about__section-icon" />
                <Title level={5} style={{ margin: 0 }}>Kinh nghiệm</Title>
              </div>
              <Divider style={{ margin: '12px 0 16px' }} />
              <div className="blog-about__timeline">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="blog-about__timeline-item">
                    <div className="blog-about__timeline-dot" />
                    {idx < experiences.length - 1 && (
                      <div className="blog-about__timeline-line" />
                    )}
                    <div className="blog-about__timeline-content">
                      <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                        {exp.year}
                      </Text>
                      <Title level={5} style={{ margin: '4px 0 2px' }}>{exp.role}</Title>
                      <Text style={{ color: '#1677ff', fontSize: 14, fontWeight: 500 }}>
                        {exp.company}
                      </Text>
                      <Paragraph
                        style={{ marginTop: 8, marginBottom: 0, color: '#666', fontSize: 14 }}
                      >
                        {exp.desc}
                      </Paragraph>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AboutPage;
