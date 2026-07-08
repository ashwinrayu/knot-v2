import { Course, TranscriptEvaluation, Lead, AuditLog, ScraperLog, SystemUser, Institution } from '../types';

// The Receiving College's Course Catalog (Knot University)
export const RECEIVING_COURSES: Course[] = [
  {
    id: 'rec_cs101',
    code: 'CS 101',
    title: 'Introduction to Computer Science',
    credits: 4,
    department: 'Computer Science',
    description: 'Fundamental concepts of programming, problem-solving, control structures, and simple data structures using Python.',
    prerequisites: []
  },
  {
    id: 'rec_cs102',
    code: 'CS 102',
    title: 'Data Structures & Algorithms',
    credits: 4,
    department: 'Computer Science',
    description: 'Abstract data types, lists, stacks, queues, trees, sorting and searching algorithms, complexity analysis, and object-oriented design in Java.',
    prerequisites: ['CS 101']
  },
  {
    id: 'rec_cs201',
    code: 'CS 201',
    title: 'Computer Architecture & Systems',
    credits: 4,
    department: 'Computer Science',
    description: 'Machine representations of data, assembly language, memory hierarchy, processor microarchitecture, and basics of operating systems.',
    prerequisites: ['CS 102']
  },
  {
    id: 'rec_cs301',
    code: 'CS 301',
    title: 'Software Engineering Methodologies',
    credits: 3,
    department: 'Computer Science',
    description: 'Software development lifecycles, Agile/Scrum, requirement gathering, design patterns, testing, CI/CD pipelines, and team project collaboration.',
    prerequisites: ['CS 102']
  },
  {
    id: 'rec_cs310',
    code: 'CS 310',
    title: 'Database Management Systems',
    credits: 3,
    department: 'Computer Science',
    description: 'Relational algebra, SQL, database design, normalization, transactions, concurrency, and indexing. Introduction to NoSQL databases.',
    prerequisites: ['CS 102']
  },
  {
    id: 'rec_math101',
    code: 'MATH 101',
    title: 'Calculus I',
    credits: 4,
    department: 'Mathematics',
    description: 'Limits, continuity, derivatives of algebraic and transcendental functions, applications of differentiation, and introduction to integration.',
    prerequisites: []
  },
  {
    id: 'rec_math102',
    code: 'MATH 102',
    title: 'Calculus II',
    credits: 4,
    department: 'Mathematics',
    description: 'Techniques of integration, applications of integration, sequences, infinite series, power series, and Taylor expansions.',
    prerequisites: ['MATH 101']
  },
  {
    id: 'rec_math201',
    code: 'MATH 201',
    title: 'Linear Algebra',
    credits: 3,
    department: 'Mathematics',
    description: 'Systems of linear equations, matrices, determinants, vector spaces, linear transformations, eigenvalues, and eigenvectors.',
    prerequisites: ['MATH 102']
  },
  {
    id: 'rec_bus101',
    code: 'BUS 101',
    title: 'Introduction to Business Administration',
    credits: 3,
    department: 'Business',
    description: 'Survey of business functions including management, marketing, finance, accounting, business ethics, and operations in a global economy.',
    prerequisites: []
  },
  {
    id: 'rec_bus201',
    code: 'BUS 201',
    title: 'Principles of Financial Accounting',
    credits: 3,
    department: 'Business',
    description: 'Recording and reporting financial transactions, preparing financial statements (balance sheet, income statement), and analyzing financial performance.',
    prerequisites: ['BUS 101']
  },
  {
    id: 'rec_bus202',
    code: 'BUS 202',
    title: 'Principles of Marketing',
    credits: 3,
    department: 'Business',
    description: 'Product planning, pricing, promotion, distribution channels, market segmentation, target marketing, and consumer behavior.',
    prerequisites: ['BUS 101']
  },
  {
    id: 'rec_eng101',
    code: 'ENG 101',
    title: 'Academic Writing & Rhetoric',
    credits: 3,
    department: 'Humanities',
    description: 'Developing skills in critical reading, analytical writing, synthesis of sources, logical argumentation, and the writing process.',
    prerequisites: []
  },
  {
    id: 'rec_psych101',
    code: 'PSYCH 101',
    title: 'General Psychology',
    credits: 3,
    department: 'Humanities',
    description: 'Scientific study of behavior and mental processes. Includes learning, memory, cognition, development, personality, and abnormal behavior.',
    prerequisites: []
  }
];

// Initial Institution Details
export const DEFAULT_INSTITUTION: Institution = {
  id: 'knot_univ',
  name: 'Knot University',
  logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80',
  email: 'transfer@knot.edu',
  website: 'www.knot.edu',
  address: '100 University Ave, Boston, MA 02115',
  primaryContact: {
    name: 'Dr. Evelyn Martinez',
    email: 'e.martinez@knot.edu',
    phone: '(617) 555-0199'
  },
  onboarded: true,
  aiConfig: {
    minGrade: 'C',
    creditDifference: 1.5,
    similarityThreshold: 70,
    confidenceThreshold: 80,
    autoPublishThreshold: 90,
    reviewThreshold: 80
  }
};

// Seed evaluations
export const INITIAL_EVALUATIONS: TranscriptEvaluation[] = [
  {
    id: 'eval_001',
    studentName: 'Alex Rivera',
    studentEmail: 'alex.rivera@gmail.com',
    studentPhone: '(415) 555-2432',
    studentProgram: 'B.S. in Computer Science',
    sendingInstitution: 'Bay Area Community College',
    uploadedAt: '2026-07-06T09:12:00Z',
    status: 'pending_review',
    confidenceScore: 84.8,
    processingTime: '1.4s',
    notes: 'Alex is transferring for Fall 2026. Needs a solid review of his CS 102 equivalents.',
    comments: [
      {
        id: 'c_1',
        author: 'AI Magic Engine',
        role: 'system',
        text: 'Identified 5 course candidates. Average confidence 84.8%. 1 warning flagged for credits discrepancy on Python Programming.',
        createdAt: '2026-07-06T09:12:02Z'
      },
      {
        id: 'c_2',
        author: 'Sarah Jenkins',
        role: 'reviewer',
        text: 'Looking at CS-502. The syllabus matches our CS 102 closely. Requesting second opinion on the assembly course.',
        createdAt: '2026-07-06T11:45:00Z'
      }
    ],
    history: [
      {
        id: 'h_1',
        action: 'Transcript Uploaded',
        user: 'Alex Rivera (Student)',
        timestamp: '2026-07-06T09:12:00Z'
      },
      {
        id: 'h_2',
        action: 'AI Evaluation Run',
        user: 'AI Magic Engine',
        timestamp: '2026-07-06T09:12:02Z',
        details: 'AI Magic scan completed. Mapped 5 courses.'
      },
      {
        id: 'h_3',
        action: 'Assigned to Reviewer',
        user: 'System Admin',
        timestamp: '2026-07-06T09:15:00Z',
        details: 'Assigned to Sarah Jenkins.'
      }
    ],
    courses: [
      {
        id: 'ext_1_1',
        code: 'CS-501',
        title: 'Introduction to Programming (Python)',
        credits: 3,
        grade: 'A',
        matchedCourseId: 'rec_cs101',
        matchedCourseCode: 'CS 101',
        matchedCourseTitle: 'Introduction to Computer Science',
        receivingCredits: 3,
        confidence: 94,
        status: 'approved',
        reason: 'Syllabus and description overlap is high (94%). Course covers variables, functions, and control loops in Python. Credit difference (3 vs 4) is minor and accepted.',
        alternativeSuggestions: []
      },
      {
        id: 'ext_1_2',
        code: 'CS-502',
        title: 'Object Oriented Programming and Algorithms',
        credits: 4,
        grade: 'B+',
        matchedCourseId: 'rec_cs102',
        matchedCourseCode: 'CS 102',
        matchedCourseTitle: 'Data Structures & Algorithms',
        receivingCredits: 4,
        confidence: 88,
        status: 'pending',
        reason: 'Matches Data Structures & Algorithms with 88% similarity. Covers classes, pointers, sorting, and linked lists in Java/C++.',
        alternativeSuggestions: []
      },
      {
        id: 'ext_1_3',
        code: 'MATH-210',
        title: 'Calculus I for Engineers',
        credits: 4,
        grade: 'A-',
        matchedCourseId: 'rec_math101',
        matchedCourseCode: 'MATH 101',
        matchedCourseTitle: 'Calculus I',
        receivingCredits: 4,
        confidence: 95,
        status: 'approved',
        reason: 'Exact matches on content, derivatives, limits, and integration (95% match rate).',
        alternativeSuggestions: []
      },
      {
        id: 'ext_1_4',
        code: 'MATH-220',
        title: 'Advanced Integration and Series',
        credits: 4,
        grade: 'B',
        matchedCourseId: 'rec_math102',
        matchedCourseCode: 'MATH 102',
        matchedCourseTitle: 'Calculus II',
        receivingCredits: 4,
        confidence: 91,
        status: 'approved',
        reason: 'Covers sequences, Taylor series, and integral calculus methods (91% match rate).',
        alternativeSuggestions: []
      },
      {
        id: 'ext_1_5',
        code: 'CS-520',
        title: 'Microprocessors and Logic',
        credits: 3,
        grade: 'C-',
        matchedCourseId: 'rec_cs201',
        matchedCourseCode: 'CS 201',
        matchedCourseTitle: 'Computer Architecture & Systems',
        receivingCredits: 3,
        confidence: 56,
        status: 'pending',
        reason: 'Low confidence (56%). While it covers microprocessor logic, it lacks operating systems foundations which is a core part of our CS 201.',
        alternativeSuggestions: [
          {
            courseId: 'rec_cs201',
            code: 'CS 201',
            title: 'Computer Architecture & Systems',
            similarity: 56,
            reason: 'Weak overlap on systems-level code and OS theory.'
          }
        ]
      }
    ]
  },
  {
    id: 'eval_002',
    studentName: 'Clara Oswald',
    studentEmail: 'clara.o@outlook.com',
    studentPhone: '(617) 555-8980',
    studentProgram: 'B.S. in Business Administration',
    sendingInstitution: 'State Metropolitan College',
    uploadedAt: '2026-07-05T14:30:00Z',
    status: 'published',
    confidenceScore: 92.5,
    processingTime: '0.9s',
    notes: 'Auto-published evaluation. Met all thresholds.',
    comments: [
      {
        id: 'c_3',
        author: 'AI Magic Engine',
        role: 'system',
        text: 'Automatic approval based on config (Average Confidence 92.5% > Auto Publish 90%).',
        createdAt: '2026-07-05T14:30:01Z'
      }
    ],
    history: [
      {
        id: 'h_4',
        action: 'Transcript Uploaded',
        user: 'Clara Oswald (Student)',
        timestamp: '2026-07-05T14:30:00Z'
      },
      {
        id: 'h_5',
        action: 'AI Evaluation Run',
        user: 'AI Magic Engine',
        timestamp: '2026-07-05T14:30:01Z',
        details: 'Extracted 4 courses. 100% accepted.'
      },
      {
        id: 'h_6',
        action: 'Report Published',
        user: 'AI System',
        timestamp: '2026-07-05T14:30:01Z',
        details: 'Sent notifications to student and created a Lead.'
      }
    ],
    courses: [
      {
        id: 'ext_2_1',
        code: 'BADM-101',
        title: 'Business Principles and Practices',
        credits: 3,
        grade: 'A',
        matchedCourseId: 'rec_bus101',
        matchedCourseCode: 'BUS 101',
        matchedCourseTitle: 'Introduction to Business Administration',
        receivingCredits: 3,
        confidence: 96,
        status: 'approved',
        reason: 'Covers business fields, management ethics and leadership. High correlation.',
        alternativeSuggestions: []
      },
      {
        id: 'ext_2_2',
        code: 'ACCT-201',
        title: 'Accounting I (Financial)',
        credits: 3,
        grade: 'A-',
        matchedCourseId: 'rec_bus201',
        matchedCourseCode: 'BUS 201',
        matchedCourseTitle: 'Principles of Financial Accounting',
        receivingCredits: 3,
        confidence: 94,
        status: 'approved',
        reason: 'Ledgers, double entry, cash flow worksheets and standards.',
        alternativeSuggestions: []
      },
      {
        id: 'ext_2_3',
        code: 'MKTG-301',
        title: 'Consumer Marketing Tactics',
        credits: 3,
        grade: 'B+',
        matchedCourseId: 'rec_bus202',
        matchedCourseCode: 'BUS 202',
        matchedCourseTitle: 'Principles of Marketing',
        receivingCredits: 3,
        confidence: 90,
        status: 'approved',
        reason: 'Covers marketing mix, consumer mindset, channels of distribution.',
        alternativeSuggestions: []
      },
      {
        id: 'ext_2_4',
        code: 'PSY-100',
        title: 'Introductory Psychology',
        credits: 3,
        grade: 'B',
        matchedCourseId: 'rec_psych101',
        matchedCourseCode: 'PSYCH 101',
        matchedCourseTitle: 'General Psychology',
        receivingCredits: 3,
        confidence: 90,
        status: 'approved',
        reason: 'Scientific methods, perception, development, cognitive fields.',
        alternativeSuggestions: []
      }
    ]
  },
  {
    id: 'eval_003',
    studentName: 'Marcus Aurelius',
    studentEmail: 'marcus.aurelius@rome.edu',
    studentPhone: '(312) 555-0810',
    studentProgram: 'B.S. in Computer Science',
    sendingInstitution: 'Northern Lakes University',
    uploadedAt: '2026-07-06T11:20:00Z',
    status: 'pending_review',
    confidenceScore: 71.3,
    processingTime: '1.9s',
    notes: 'Several matches are low-confidence. Grade threshold violation on Math Course.',
    comments: [
      {
        id: 'c_4',
        author: 'AI Magic Engine',
        role: 'system',
        text: 'Warning: MAT-200 grade is D, below the threshold of C. Flagged for review/rejection.',
        createdAt: '2026-07-06T11:20:02Z'
      }
    ],
    history: [
      {
        id: 'h_7',
        action: 'Transcript Uploaded',
        user: 'Marcus Aurelius (Student)',
        timestamp: '2026-07-06T11:20:00Z'
      },
      {
        id: 'h_8',
        action: 'AI Evaluation Run',
        user: 'AI Magic Engine',
        timestamp: '2026-07-06T11:20:02Z',
        details: 'Found 3 courses. 1 warning generated for grades.'
      }
    ],
    courses: [
      {
        id: 'ext_3_1',
        code: 'CSCI-111',
        title: 'Problem Solving and Code Design',
        credits: 4,
        grade: 'B+',
        matchedCourseId: 'rec_cs101',
        matchedCourseCode: 'CS 101',
        matchedCourseTitle: 'Introduction to Computer Science',
        receivingCredits: 4,
        confidence: 89,
        status: 'approved',
        reason: 'Excellent coverage of Python coding basics and scripting models.',
        alternativeSuggestions: []
      },
      {
        id: 'ext_3_2',
        code: 'MAT-200',
        title: 'Calculus and Limits',
        credits: 4,
        grade: 'D',
        matchedCourseId: 'rec_math101',
        matchedCourseCode: 'MATH 101',
        matchedCourseTitle: 'Calculus I',
        receivingCredits: 0,
        confidence: 85,
        status: 'rejected',
        reason: 'Grade D falls below the minimum required grade threshold of C. No credits transferrable.',
        alternativeSuggestions: []
      },
      {
        id: 'ext_3_3',
        code: 'CSCI-222',
        title: 'Low Level Architecture',
        credits: 3,
        grade: 'C+',
        matchedCourseId: 'rec_cs201',
        matchedCourseCode: 'CS 201',
        matchedCourseTitle: 'Computer Architecture & Systems',
        receivingCredits: 3,
        confidence: 40,
        status: 'pending',
        reason: 'Low confidence match (40%). Course is mostly logic gates, circuit layout and has no software systems/OS programming element.',
        alternativeSuggestions: [
          {
            courseId: 'rec_cs201',
            code: 'CS 201',
            title: 'Computer Architecture & Systems',
            similarity: 40,
            reason: 'Weak overlap on software execution contexts.'
          }
        ]
      }
    ]
  }
];

// Initial CRM Leads
export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead_001',
    studentName: 'Alex Rivera',
    studentEmail: 'alex.rivera@gmail.com',
    studentPhone: '(415) 555-2432',
    studentProgram: 'B.S. in Computer Science',
    sendingInstitution: 'Bay Area Community College',
    evaluationDate: '2026-07-06',
    leadScore: 78,
    status: 'new',
    notes: ['AI transcript analyzed', 'Needs credit evaluation approval'],
    evaluationId: 'eval_001'
  },
  {
    id: 'lead_002',
    studentName: 'Clara Oswald',
    studentEmail: 'clara.o@outlook.com',
    studentPhone: '(617) 555-8980',
    studentProgram: 'B.S. in Business Administration',
    sendingInstitution: 'State Metropolitan College',
    evaluationDate: '2026-07-05',
    leadScore: 92,
    status: 'contacted',
    notes: ['Auto-published evaluation reports sent', 'Called student on July 5 to discuss admissions', 'Very excited about transferring 12 credits'],
    evaluationId: 'eval_002'
  },
  {
    id: 'lead_003',
    studentName: 'Marcus Aurelius',
    studentEmail: 'marcus.aurelius@rome.edu',
    studentPhone: '(312) 555-0810',
    studentProgram: 'B.S. in Computer Science',
    sendingInstitution: 'Northern Lakes University',
    evaluationDate: '2026-07-06',
    leadScore: 40,
    status: 'evaluating',
    notes: ['Grade warning flagged', 'Checking if student can retake Calculus I in summer session'],
    evaluationId: 'eval_003'
  },
  {
    id: 'lead_004',
    studentName: 'Sarah Connor',
    studentEmail: 'sconnor@skynet.com',
    studentPhone: '(213) 555-1984',
    studentProgram: 'B.S. in Mechanical Engineering',
    sendingInstitution: 'Pasadena City College',
    evaluationDate: '2026-07-02',
    leadScore: 85,
    status: 'won',
    notes: ['Transcript evaluated', 'Transfer report sent and accepted', 'Paid enrollment deposit!'],
    evaluationId: 'eval_002'
  }
];

// Initial Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'a_1',
    userId: 'u_1',
    userName: 'Evelyn Martinez',
    role: 'Admin',
    action: 'AI Parameters Changed',
    timestamp: '2026-07-05T09:00:00Z',
    details: 'Changed Auto Publish Threshold from 95% to 90%'
  },
  {
    id: 'a_2',
    userId: 'u_2',
    userName: 'Sarah Jenkins',
    role: 'Reviewer',
    action: 'Evaluation Approved',
    timestamp: '2026-07-05T14:30:00Z',
    details: 'Approved evaluation eval_002 (Clara Oswald)'
  },
  {
    id: 'a_3',
    userId: 'system',
    userName: 'AI System',
    role: 'System',
    action: 'AI Magic Scan Executed',
    timestamp: '2026-07-06T09:12:00Z',
    details: 'Processed Alex Rivera transcript. High reliability.'
  }
];

// Initial Scraper Logs
export const INITIAL_SCRAPER_LOGS: ScraperLog[] = [
  {
    id: 'scr_1',
    url: 'https://www.bacc.edu/catalog/computer-science',
    timestamp: '2026-07-04T10:15:00Z',
    status: 'success',
    coursesExtractedCount: 4,
    logs: [
      'Initializing Chrome headless subagent...',
      'Navigating to target catalog page...',
      'Target page loaded in 420ms.',
      'Parsing HTML tree structure...',
      'Found 4 course blocks matching pattern .course-item.',
      'Extracted: CS-501 (3 credits), CS-502 (4 credits), CS-520 (3 credits), MATH-210 (4 credits).',
      'Imported into staging buffer.'
    ],
    previewCourses: [
      { code: 'CS-501', title: 'Introduction to Programming (Python)', credits: 3, department: 'Computer Science' },
      { code: 'CS-502', title: 'Object Oriented Programming and Algorithms', credits: 4, department: 'Computer Science' },
      { code: 'CS-520', title: 'Microprocessors and Logic', credits: 3, department: 'Computer Science' },
      { code: 'MATH-210', title: 'Calculus I for Engineers', credits: 4, department: 'Mathematics' }
    ]
  }
];

// Default Users
export const SYSTEM_USERS: SystemUser[] = [
  {
    id: 'u_1',
    name: 'Dr. Evelyn Martinez',
    email: 'e.martinez@knot.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&q=80',
    permissions: ['all_access', 'configure_ai', 'modify_catalog', 'user_management']
  },
  {
    id: 'u_2',
    name: 'Sarah Jenkins',
    email: 's.jenkins@knot.edu',
    role: 'reviewer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&q=80',
    permissions: ['review_evaluations', 'read_catalog', 'add_comments']
  },
  {
    id: 'u_3',
    name: 'Marcus Brody',
    email: 'm.brody@knot.edu',
    role: 'admissions',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&q=80',
    permissions: ['read_evaluations', 'manage_leads', 'export_reports']
  }
];
