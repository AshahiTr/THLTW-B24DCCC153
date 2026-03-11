import { useState } from 'react';
import { Button, Input, Select, Table, Card, Row, Col, Space, Tag, Popconfirm } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

type DifficultyLevel = 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';

interface KnowledgeBlock {
  id: number;
  ten: string;
}

interface Subject {
  id: number;
  ma: string;
  ten: string;
  tinChi: number;
}

interface Question {
  id: number;
  monId: number;
  noiDung: string;
  doKho: DifficultyLevel;
  khoiId: number;
}

interface ExamRequirement {
  khoiId: number;
  doKho: DifficultyLevel;
  soCau: number;
}

interface Exam {
  id: number;
  monId: number;
  cauHois: Question[];
  yeuCaus: ExamRequirement[];
}

const DIFFICULTY_LEVELS: DifficultyLevel[] = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];
const TABS = ['Khối KT', 'Môn học', 'Câu hỏi', 'Đề thi'];

const getDifficultyColor = (difficulty: DifficultyLevel): string => {
  switch (difficulty) {
    case 'Dễ': return '#52c41a';
    case 'Trung bình': return '#faad14';
    case 'Khó': return '#ff7a45';
    case 'Rất khó': return '#f5222d';
    default: return '#1890ff';
  }
};

export default function QuanLyNganHangCauHoi() {
  const [activeTab, setActiveTab] = useState(0);

  const [knowledgeBlocks, setKnowledgeBlocks] = useState<KnowledgeBlock[]>([
    { id: 1, ten: 'Tổng quan' },
    { id: 2, ten: 'Chuyên sâu' },
  ]);
  const [blockNameInput, setBlockNameInput] = useState('');

  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, ma: 'IT001', ten: 'Nhập môn CNTT', tinChi: 3 },
  ]);
  const [subjectForm, setSubjectForm] = useState({ ma: '', ten: '', tinChi: 2 });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionForm, setQuestionForm] = useState<Omit<Question, 'id'>>({
    monId: 0,
    noiDung: '',
    doKho: 'Dễ',
    khoiId: 0,
  });
  const [questionFilter, setQuestionFilter] = useState({ monId: 0, doKho: '', khoiId: 0 });

  const [exams, setExams] = useState<Exam[]>([]);
  const [examStructure, setExamStructure] = useState<{ monId: number; yeuCaus: ExamRequirement[] }>({
    monId: 0,
    yeuCaus: [],
  });
  const [requirementForm, setRequirementForm] = useState<ExamRequirement>({
    khoiId: 0,
    doKho: 'Dễ',
    soCau: 1,
  });

  const filteredQuestions = questions.filter((q) =>
    (!questionFilter.monId || q.monId === questionFilter.monId) &&
    (!questionFilter.doKho || q.doKho === questionFilter.doKho) &&
    (!questionFilter.khoiId || q.khoiId === questionFilter.khoiId),
  );

  const addKnowledgeBlock = () => {
    if (blockNameInput.trim()) {
      setKnowledgeBlocks((prev) => [...prev, { id: Date.now(), ten: blockNameInput }]);
      setBlockNameInput('');
    }
  };

  const deleteKnowledgeBlock = (id: number) => {
    setKnowledgeBlocks((prev) => prev.filter((k) => k.id !== id));
  };

  const addSubject = () => {
    if (subjectForm.ma && subjectForm.ten) {
      setSubjects((prev) => [...prev, { id: Date.now(), ...subjectForm }]);
      setSubjectForm({ ma: '', ten: '', tinChi: 2 });
    }
  };

  const deleteSubject = (id: number) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const addQuestion = () => {
    if (questionForm.noiDung && questionForm.monId && questionForm.khoiId) {
      setQuestions((prev) => [...prev, { id: Date.now(), ...questionForm }]);
      setQuestionForm((prev) => ({ ...prev, noiDung: '' }));
    }
  };

  const deleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const generateExam = () => {
    const selectedQuestions: Question[] = [];

    for (const req of examStructure.yeuCaus) {
      const available = questions.filter(
        (q) =>
          q.monId === examStructure.monId &&
          q.khoiId === req.khoiId &&
          q.doKho === req.doKho,
      );

      if (available.length < req.soCau) {
        const blockName = knowledgeBlocks.find((k) => k.id === req.khoiId)?.ten;
        alert(
          `Không đủ câu: ${blockName} - ${req.doKho} (cần ${req.soCau}, có ${available.length})`,
        );
        return;
      }

      const shuffled = [...available].sort(() => Math.random() - 0.5);
      selectedQuestions.push(...shuffled.slice(0, req.soCau));
    }

    setExams((prev) => [
      ...prev,
      {
        id: Date.now(),
        monId: examStructure.monId,
        cauHois: selectedQuestions,
        yeuCaus: examStructure.yeuCaus,
      },
    ]);
    alert(`Tạo đề thành công! ${selectedQuestions.length} câu.`);
  };

  const addRequirement = () => {
    if (requirementForm.khoiId) {
      setExamStructure((prev) => ({
        ...prev,
        yeuCaus: [...prev.yeuCaus, { ...requirementForm }],
      }));
      setRequirementForm({ khoiId: 0, doKho: 'Dễ', soCau: 1 });
    }
  };

  const removeRequirement = (index: number) => {
    setExamStructure((prev) => ({
      ...prev,
      yeuCaus: prev.yeuCaus.filter((_, i) => i !== index),
    }));
  };

  const renderKnowledgeBlockTab = () => (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={16}>
          <Input.Group compact style={{ display: 'flex' }}>
            <Input
              placeholder="Tên khối kiến thức"
              value={blockNameInput}
              onChange={(e) => setBlockNameInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addKnowledgeBlock()}
              style={{ flex: 1 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={addKnowledgeBlock}>
              Thêm
            </Button>
          </Input.Group>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {knowledgeBlocks.map((block) => (
          <Col key={block.id} xs={24} sm={12} md={8}>
            <div style={{ height: 3, width: '100%', backgroundColor: '#1890ff', marginBottom: 0 }} />
            <Card
              hoverable
              style={{ borderRadius: '0px 0px 12px 12px', marginBottom: 0 }}
              bodyStyle={{ paddingBottom: 20 }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Tag color="blue">{block.id}</Tag>
                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>{block.ten}</div>
                <Popconfirm
                  title="Xóa khối kiến thức?"
                  onConfirm={() => deleteKnowledgeBlock(block.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button danger size="small" icon={<DeleteOutlined />}>
                    Xóa
                  </Button>
                </Popconfirm>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Space>
  );

  const renderSubjectsTab = () => (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Input
            placeholder="Mã môn"
            value={subjectForm.ma}
            onChange={(e) => setSubjectForm((s) => ({ ...s, ma: e.target.value }))}
          />
        </Col>
        <Col xs={24} sm={12}>
          <Input
            placeholder="Tên môn học"
            value={subjectForm.ten}
            onChange={(e) => setSubjectForm((s) => ({ ...s, ten: e.target.value }))}
          />
        </Col>
        <Col xs={24} sm={4}>
          <Input
            type="number"
            placeholder="Tín chỉ"
            value={subjectForm.tinChi}
            onChange={(e) => setSubjectForm((s) => ({ ...s, tinChi: Number(e.target.value) }))}
          />
        </Col>
        <Col xs={24} sm={2}>
          <Button type="primary" icon={<PlusOutlined />} onClick={addSubject} block>
            Thêm
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {subjects.map((subject) => (
          <Col key={subject.id} xs={24} sm={12} md={8}>
            <div style={{ height: 3, width: '100%', backgroundColor: '#52c41a', marginBottom: 0 }} />
            <Card hoverable style={{ borderRadius: '0px 0px 12px 12px', marginBottom: 0 }} bodyStyle={{ paddingBottom: 20 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Tag color="green">{subject.ma}</Tag>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{subject.ten}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Tín chỉ: {subject.tinChi}</div>
                <Popconfirm
                  title="Xóa môn học?"
                  onConfirm={() => deleteSubject(subject.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button danger size="small" icon={<DeleteOutlined />}>
                    Xóa
                  </Button>
                </Popconfirm>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Space>
  );

  const renderQuestionsTab = () => {
    const columns = [
      {
        title: 'Môn học',
        key: 'monId',
        render: (_: any, record: Question) => subjects.find((s) => s.id === record.monId)?.ten,
        width: '15%',
      },
      {
        title: 'Nội dung',
        dataIndex: 'noiDung',
        key: 'noiDung',
        render: (text: string) => <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</div>,
        width: '45%',
      },
      {
        title: 'Độ khó',
        key: 'doKho',
        render: (_: any, record: Question) => (
          <Tag color={getDifficultyColor(record.doKho)}>{record.doKho}</Tag>
        ),
        width: '12%',
      },
      {
        title: 'Khối KT',
        key: 'khoiId',
        render: (_: any, record: Question) => knowledgeBlocks.find((k) => k.id === record.khoiId)?.ten,
        width: '15%',
      },
      {
        title: 'Thao tác',
        key: 'action',
        render: (_: any, record: Question) => (
          <Popconfirm
            title="Xóa câu hỏi?"
            onConfirm={() => deleteQuestion(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        ),
        width: '13%',
      },
    ];

    return (
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="Thêm câu hỏi">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Select
                  placeholder="Chọn môn học"
                  value={questionForm.monId || undefined}
                  onChange={(value) => setQuestionForm((q) => ({ ...q, monId: value }))}
                  style={{ width: '100%' }}
                  options={[
                    { label: '📚 Chọn môn học', value: 0 },
                    ...subjects.map((s) => ({ label: s.ten, value: s.id })),
                  ]}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Select
                  placeholder="Chọn khối kiến thức"
                  value={questionForm.khoiId || undefined}
                  onChange={(value) => setQuestionForm((q) => ({ ...q, khoiId: value }))}
                  style={{ width: '100%' }}
                  options={[
                    { label: '🏛️ Chọn khối kiến thức', value: 0 },
                    ...knowledgeBlocks.map((k) => ({ label: k.ten, value: k.id })),
                  ]}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Select
                  value={questionForm.doKho}
                  onChange={(value) => setQuestionForm((q) => ({ ...q, doKho: value }))}
                  style={{ width: '100%' }}
                  options={DIFFICULTY_LEVELS.map((d) => ({ label: d, value: d }))}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Input.TextArea
                  placeholder="Nội dung câu hỏi..."
                  value={questionForm.noiDung}
                  onChange={(e) => setQuestionForm((q) => ({ ...q, noiDung: e.target.value }))}
                  rows={3}
                />
              </Col>
            </Row>
            <Button type="primary" icon={<PlusOutlined />} onClick={addQuestion}>
              Thêm câu
            </Button>
          </Space>
        </Card>

        <Card title="🔍 Bộ lọc">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Tất cả môn"
                value={questionFilter.monId || undefined}
                onChange={(value) => setQuestionFilter((f) => ({ ...f, monId: value }))}
                style={{ width: '100%' }}
                options={[
                  { label: 'Tất cả môn', value: 0 },
                  ...subjects.map((s) => ({ label: s.ten, value: s.id })),
                ]}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Tất cả độ khó"
                value={questionFilter.doKho || undefined}
                onChange={(value) => setQuestionFilter((f) => ({ ...f, doKho: value }))}
                style={{ width: '100%' }}
                options={[
                  { label: 'Tất cả độ khó', value: '' },
                  ...DIFFICULTY_LEVELS.map((d) => ({ label: d, value: d })),
                ]}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Tất cả khối"
                value={questionFilter.khoiId || undefined}
                onChange={(value) => setQuestionFilter((f) => ({ ...f, khoiId: value }))}
                style={{ width: '100%' }}
                options={[
                  { label: 'Tất cả khối', value: 0 },
                  ...knowledgeBlocks.map((k) => ({ label: k.ten, value: k.id })),
                ]}
              />
            </Col>
          </Row>
        </Card>

        <Card title={`📋 Danh sách câu hỏi (${filteredQuestions.length})`}>
          <Table
            columns={columns}
            dataSource={filteredQuestions.map((q) => ({ ...q, key: q.id }))}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </Card>
      </Space>
    );
  };

  const renderExamsTab = () => {
    const requirementColumns = [
      {
        title: 'Khối KT',
        key: 'khoiId',
        render: (_: any, record: ExamRequirement) => knowledgeBlocks.find((k) => k.id === record.khoiId)?.ten,
        width: '30%',
      },
      {
        title: 'Độ khó',
        key: 'doKho',
        render: (_: any, record: ExamRequirement) => (
          <Tag color={getDifficultyColor(record.doKho)}>{record.doKho}</Tag>
        ),
        width: '30%',
      },
      {
        title: 'Số câu',
        dataIndex: 'soCau',
        key: 'soCau',
        width: '20%',
      },
      {
        title: 'Thao tác',
        key: 'action',
        render: (_: any, __: ExamRequirement, index: number) => (
          <Popconfirm
            title="Xóa yêu cầu?"
            onConfirm={() => removeRequirement(index)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        ),
        width: '20%',
      },
    ];

    return (
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="Chọn môn học">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Select
                placeholder="Chọn môn học"
                value={examStructure.monId || undefined}
                onChange={(value) => setExamStructure((es) => ({ ...es, monId: value }))}
                style={{ width: '100%' }}
                options={[
                  { label: 'Chọn môn học', value: 0 },
                  ...subjects.map((s) => ({ label: s.ten, value: s.id })),
                ]}
              />
            </Col>
          </Row>
        </Card>

        <Card title="Thêm yêu cầu">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Select
                  placeholder="Khối kiến thức"
                  value={requirementForm.khoiId || undefined}
                  onChange={(value) => setRequirementForm((r) => ({ ...r, khoiId: value }))}
                  style={{ width: '100%' }}
                  options={[
                    { label: 'Khối kiến thức', value: 0 },
                    ...knowledgeBlocks.map((k) => ({ label: k.ten, value: k.id })),
                  ]}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Select
                  value={requirementForm.doKho}
                  onChange={(value) => setRequirementForm((r) => ({ ...r, doKho: value }))}
                  style={{ width: '100%' }}
                  options={DIFFICULTY_LEVELS.map((d) => ({ label: d, value: d }))}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Input
                  type="number"
                  min="1"
                  placeholder="Số câu"
                  value={requirementForm.soCau}
                  onChange={(e) => setRequirementForm((r) => ({ ...r, soCau: Number(e.target.value) }))}
                />
              </Col>
            </Row>
            <Button type="primary" icon={<PlusOutlined />} onClick={addRequirement}>
              Thêm yêu cầu
            </Button>
          </Space>
        </Card>

        {examStructure.yeuCaus.length > 0 && (
          <Card title="Yêu cầu đã thêm">
            <Table
              columns={requirementColumns}
              dataSource={examStructure.yeuCaus.map((req, index) => ({ ...req, key: index }))}
              pagination={false}
            />
          </Card>
        )}

        <Button
          type="primary"
          size="large"
          onClick={generateExam}
          disabled={examStructure.monId === 0 || examStructure.yeuCaus.length === 0}
          block
        >
          📄 Tạo đề thi
        </Button>

        <Card title={`Đề đã lưu (${exams.length})`}>
          {exams.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
              Chưa có đề thi nào
            </div>
          ) : (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {exams.map((exam) => (
                <Card
                  key={exam.id}
                  size="small"
                  title={`📋 Đề #${exam.id} — ${subjects.find((s) => s.id === exam.monId)?.ten} — ${exam.cauHois.length} câu`}
                >
                  <ol style={{ marginTop: 0, paddingLeft: 20 }}>
                    {exam.cauHois.map((q, idx) => (
                      <li key={idx} style={{ marginBottom: 12, lineHeight: 1.6 }}>
                        <strong style={{ color: getDifficultyColor(q.doKho) }}>
                          [{q.doKho}]
                        </strong>{' '}
                        <div style={{ marginTop: 4 }}>{q.noiDung}</div>
                        <em style={{ color: '#999', fontSize: 12 }}>
                          ({knowledgeBlocks.find((k) => k.id === q.khoiId)?.ten})
                        </em>
                      </li>
                    ))}
                  </ol>
                </Card>
              ))}
            </Space>
          )}
        </Card>
      </Space>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px 0' }}>
          📚 Quản Lý Ngân Hàng Câu Hỏi Tự Luận
        </h1>
        <div style={{ color: '#666', fontSize: 12 }}>
          Quản lý kiến thức, môn học, câu hỏi và tạo đề thi tự động
        </div>
      </div>

      <Row gutter={[12, 12]} style={{ marginBottom: 24, justifyContent: 'center' }}>
        {TABS.map((tabName, idx) => (
          <Col key={idx}>
            <Button
              type={activeTab === idx ? 'primary' : 'default'}
              onClick={() => setActiveTab(idx)}
              size="large"
              style={{ minWidth: 100 }}
            >
              {tabName}
            </Button>
          </Col>
        ))}
      </Row>

      <Card>
        {activeTab === 0 && renderKnowledgeBlockTab()}
        {activeTab === 1 && renderSubjectsTab()}
        {activeTab === 2 && renderQuestionsTab()}
        {activeTab === 3 && renderExamsTab()}
      </Card>
    </div>
  );
}